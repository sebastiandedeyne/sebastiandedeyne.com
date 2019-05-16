---
date: 2016-02-04
title: Adventure Time with Webpack
subtitle: Written for Webpack 1.12
categories: ["articles"]
tags:
  - webpack
  - javascript
---

Over the past few weeks I've been migrating our asset pipeline at [Spatie](https://spatie.be) from Laravel Elixir (a gulp wrapper) to webpack. Between having endless possibilities, the occasional incomplete section in the docs, and the fact that everyone has slightly different needs for their asset pipeline (which makes examples hard), it has surely been an adventure. I'm going to do a quick summary of my goals, and how I achieved them with webpack. Hopefully there will be some useful snippets in here for when you're setting up your own webpack configuration.

I'm not going to explain any basic concepts. If you're new to webpack, I'd recommend you to go through [Webpack Your Bags](https://blog.madewithlove.be/post/webpack-your-bags/) on madewithlove's blog first. On the other hand, if you just want a tl;dr in the form of a webpack config file, our base configuration is hosted on [Github](https://github.com/spatie-custom/blender-gulp/blob/f2b09cde73b2d18e296eb20e686166c5dcdc6de3/config/webpack.js).

<!--more-->

## Goals

Our previous setup was a gulpfile utilizing [Laravel Elixir](https://laravel.com/docs/5.2/elixir/), which compiled our sass files and bundled our javascript files with Browserify. The reason for giving webpack a shot was mainly because we wanted a faster javascript bundler and a growing interest in [hot module replacement](http://gaearon.github.io/react-hot-loader/).

This all boiled down to the following we-want-these-features list:

- Bundle our js and transpile es6/jsx
- Compile our sass files, and autoprefix the output
- Asset revisioning for the css and js output
- Minification and uglification in production
- Wrap everything in a gulp task to maintain a consistent API with older projects
- Hot, or at least live, reloading (I'll do a Laravel Homestead specific post on this later)

An extra webpack-specific caveat: by default css files are saved as js files, for now we wanted to stay with the traditional single(ish) css-file in the page's `<head>`.

## The basics

First off, a bird's eye view of what our webpack's config file looks like:

```
const config = {
    // ... (a)
};

// ... (b)

module.exports = config;
```

We'll populate `(a)` with most of our configuration, and `(b)` with some environment specific configuration (like minification in production). For a less abstract example, [this](https://github.com/spatie-custom/blender-gulp/blob/f2b09cde73b2d18e296eb20e686166c5dcdc6de3/config/webpack.js) is what our final base configuration looks like (some minor differences with the examples that will follow, but the gist of it is the same).

Before we set up compilation, bundling, or other fancy stuff we need to tell webpack where to look for everything, and where to save our build.

```
const path = require('path');

const config = {
    // Context is an absolute path to the directory where webpack will be
    // looking for our entry points.
    context: path.resolve(process.cwd(), 'resources/assets'),

    // Our entry points, with a unique name as key and a relative path
    // (starting from `context`) as value.
    entry: {
        'front.app': './js/front/app.js',
        'front.style': './sass/front/site.scss',
    },

    output: {
        // An absolute path to the desired output directory.
        path: path.resolve(process.cwd(), 'public/build'),

        // A filename pattern for the output files. This would create
        // `front.app.js` and `front.style.js`.
        filename: '[name].js',

        // A filename pattern for generated chunks.
        chunkFilename: '[name].js',
    },

    // An array of extensions webpack should try to resolve in `require`,
    // `import`, etc. statements.
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.scss'],
    },
    // ...
};
```

In short: we'll be saving our raw assets in `/resources/assets`, and compiling them to `/public/build`.

## Transpiling & bundling Javascript

Since we occasionally use React, we'll need to transpile both plain `js` files and `jsx` files. The `react-hot` loader will convert the latter to plain javascript, and enable hot module replacement for React components. Since everything we import from external packages is already transpiled to es5, the `node_modules` file gets excluded.

```
loaders: [
    {
        test: /.jsx?$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/,
    },
    // ...
],
```

## Compiling sass & autoprefixing the output

Our sites consist of two completely seperate sections, a front site and an admin area. This means we'll need two instances of the `ExtractTextPlugin` (by default webpack bundles css in a js file) to handle these independently.

```
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractFrontCss = new ExtractTextPlugin('front', 'front.css');
const ExtractBackCss = new ExtractTextPlugin('back', 'back.css');

const config = {
    loaders: [
        {
            test: /\.scss$/,
            include: /\/sass\/front\//,
            loader: ExtractFrontCss.extract('style', 'css!postcss!sass'),
        },
        {
            test: /\.scss$/,
            include: /\/sass\/back\//,
            loader: ExtractBackCss.extract('style', 'css!postcss!sass'),
        },
    ],
    plugins: [
        ExtractFrontCss,
        ExtractBackCss,
        // ...
    ],
    // ...
};
```

Sometimes we need to include 3rd party css or sass files. These need to be resolved from the `node_modules` folder, so we'll add it to `includePaths`.

```
const config = {
    sassLoader: {
        includePaths: [path.resolve(process.cwd(), 'node_modules')],
    },
    // ...
};
```

We'll also pipe our css through postcss for autoprefixing.

```
const autoprefixer = require('autoprefixer');

const config = {
    postcss() {
        return [autoprefixer];
    },
    // ...
};
```

## Ignoring files

We're currently not processing any extra assets like images in webpack. Certain extensions need to be ignored so webpack doesn't break trying to resolve them (e.g. in `url()` properties in css files).

```
// Note: This part also requires the `node-noop` package

const webpack = require('webpack');

const config = {
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /\.(jpe?g|png|gif|svg)$/,
            'node-noop'
        ),
        // ...
    ],
    // ...
};
```

## Getting ready for production

We prefer full control over our production build, so we set our own production flag instead of using the out of the box `webpack -p` command. Using the `NODE_ENV` variable to check for production is considered a best practice since some webpack plugins behave differently when it's set. (declaring the environment variable happens via gulp, which is explained in the next section)

```
const PRODUCTION = process.NODE_ENV === 'production';
```

First off, we're going to revisit some previous settings. We'll only be extracting our css in production, and we'll add hashes to our output file names for cache busting. We'll also create a revision manifest so our views know which hashes need to be appended to the scripts. The reason we're only doing these steps in production, is because they don't always seem to play nice with hot module replacement, which we want in development.

```
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const ExtractFrontCss = new ExtractTextPlugin('front', 'front-[hash].css', {
    disable: !PRODUCTION
});

const ExtractBackCss = new ExtractTextPlugin('back', 'back-[hash].css', {
    disable: !PRODUCTION
});

const config = {
    output: {
        filename: PRODUCTION ? '[name]-[hash].js' : '[name].js',
        chunkFilename: PRODUCTION ? '[name]-[chunkhash].js' : '[name].js',
    },
    plugins: [
        new ManifestPlugin({
            fileName: 'rev-manifest.json',
        }),
    ],
};
```

Additionally, we'll be running webpack's `OccurrenceOrderPlugin` and `UglifyJsPlugin`.

```
const webpack = require('webpack');

const config = {
    // ...
};

if (PRODUCTION) {
    config.plugins = config.plugins.concat([
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            mangle: true,
            screw_ie8: true,
        }),
    ]);
}
```

## Calling webpack through gulp

Since we want to keep our workflow consistent between older and newer projects, we spin up a webpack process through gulp instead of calling the `webpack` command. The added benefit is that we still have gulp in our project for some less common tasks, like favicon generation.

I wanted to avoid some `gulp-webpack`-esque plugin with fancy error handling and other features since all I really care about is piping the process' output to the terminal, which can be done with node's native `child_process`. In this simple example the `--production` and `--watch` flags are also available. These will respectively set the `NODE_ENV` variable and add a `-w` flag.

```
const { spawn } = require('child_process');
const gulp = require('gulp');
const gutils = require('gulp-util');

gulp.task('default', callback => {

    const options = [];

    // $ gulp --production
    if (gutil.env.production) {
        process.env.NODE_ENV = 'production';
    }

    // $ gulp --watch
    if (gutil.env.watch) {
        options.push('-w');
    }

    spawn('webpack', options, { stdio: 'inherit', env: process.env })
        .on('close', code => code !== 1 ? callback() : null);
});
```

## Wrapping up

Setting up your first webpack config file can be pretty rough, but once you're used to it, you can set it up in a fresh project in ~10 minutes. If your stuck or just want some extra explanation, feel free to drop a comment!

## More resources

- The webpack docs — [https://webpack.js.org](https://webpack.js.org/concepts/)
- Webpack Your Bags: A getting started post by madewithlove — [madewithlove.be](http://blog.madewithlove.be/post/webpack-your-bags/)
- Our base gulp + webpack workflow in an npm package — [Github](https://github.com/spatie-custom/blender-gulp)
- A similar but simpler example: this website's webpack configuration — [Github](https://github.com/sebastiandedeyne/v1.sebastiandedeyne.com/blob/78638073ad7c3de2a59a2257834707799028a705/webpack.config.js)
