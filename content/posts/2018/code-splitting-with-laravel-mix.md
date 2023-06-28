---
date: 2018-04-16
title: Code splitting with Laravel Mix
categories: ["articles"]
tags:
  - Laravel
  - JavaScript
---

Code splitting is bundler feature—if you're using Laravel Mix, you're bundling your assets with Webpack—that allows you to split application scripts in multiple files. These can then conditionally be loaded at a later stage.

<!--more-->

You might already be code splitting with Mix! If you do [vendor extraction](https://laravel.com/docs/5.5/mix#vendor-extraction) with `mix.extract()`, Mix will split your bundle into a vendor and application script.

There are many code splitting techniques, the Webpack docs have an [entire guide on it](https://webpack.js.org/guides/code-splitting/). This post tackles manual code splitting with dynamic `import()` statements in an app that uses Laravel Mix, and speeding things up even more by prefetching the chunks.

<aside>
While this article assumes your using Laravel Mix, the concepts & examples in this post can be useful for anyone using a JavaScript bundler.
</aside>

## A simple use case

Consider the following: you're building a traditional webapp with some lightweight JavaScript sprinkled throughout over a few pages. There's this one heavy-duty Vue component that needs to be rendered on a select few pages.

In an ideal world, that component and Vue would only be loaded when needed. There's no need to delay the first page load for your visitors if they're on a lightweight page without the component. You'd also only have a single `app.js` to determine which scripts should be loaded. This is way more maintainable than a bunch of views littered with conditional `script` tags depending on their contents.

## Webpack and dynamic `import()`

The initial version of our `app.js` probably looks similar to this:

```js
// Load all dependencies with `import` statements.
import Vue from "vue";
import initResponsiveMenu from "./initResponsiveMenu";
import MyBigFatComponent from "./components/MyBigFatComponent";

// Every page has a responsive menu, we should initialize
// it on every page.
initResponsiveMenu();

// Depending on the page, the large component may or may
// not be needed.
if (document.getElementById("widget")) {
  new Vue({
    el: "#widget",

    components: {
      MyBigFatComponent
    }
  });
}
```

The red flag above is that we're always loading Vue and the big fat component while we might not need them.

This won't matter too much on a desktop computer equipped with a fast connection. However, JavaScript is a huge bottleneck on devices with a slow CPU or internet connection. We should do better for our users.

### Dynamically loading modules

There's one issue here: dynamically loading modules conditionally will _never_ be possible with `import` statements, because they're static. Luckily, there's a dynamic alternative we can use: the `import()` function.

At the time of writing, `import()` is a stage 3 ECMAScript proposal, which means Babel doesn't support it by default. In order to enable the new syntax in our scripts we'll need to install the Babel plugin.

```bash
npm install babel-plugin-syntax-dynamic-import --save-dev
```

Next, we'll create a `.babelrc` file in our project root. Laravel Mix uses `babel-preset-env` by default, so we'll define that in our configuration too.

```json
{
  "presets": ["babel-preset-env"],
  "plugins": ["babel-plugin-syntax-dynamic-import"]
}
```

The `import()` syntax is pretty straightforward. It accepts a single argument: the module you want to import. It then returns a promise that resolves with the module contents. If we'd apply that to the `vue` dependency, it would look like this:

```js
import("vue").then(Vue => {
  new Vue({
    // ...
  });
});
```

There's still one issue: `import()` only can handle one module at a time while `MyBigFatComponent` has two dependencies: Vue and the component. Lets move those imports to their own module, `initMyBigFatComponent`, which we can dynamically import from `app.js`.

```js
// initMyBigFatComponent.js

import Vue from 'vue';
import MyBigFatComponent from './components/MyBigFatComponent';

export default initMyBigFatComponent() {
  new Vue({
    el: '#widget',

    components: {
      MyBigFatComponent,
    },
  });
}
```

```js
// app.js

import initResponsiveMenu from "./initResponsiveMenu";

initResponsiveMenu();

if (document.getElementById("widget")) {
  import("./initMyBigFatComponent").then(initMyBigFatComponent => {
    initMyBigFatComponent();
  });
}
```

We've succesfully refactored our code to use a dynamic import! So how would we split this modulefrom `app.js`? No extra steps necessary! Webpack will take care of everything for us.

When we run `npm run production` to build our assets, we'll see a new chunk in the output:

```txt
DONE  Compiled successfully in 871ms

     Asset     Size  Chunks                    Chunk Names
      0.js  92.8 kB       0  [emitted]  [big]
/js/app.js   1.7 kB       1  [emitted]         /js/app
```

Judging by the bundle sizes, we've split our scripts as expected.

Unfortunately `0.js` is a pretty vague file name. Webpack can't predict chunk names, but we can define it ourselves with a _magic comment_.

```js
import("./initMyBigFatComponent" /* webpackChunkName: "js/my-component" */).then(
  initMyBigFatComponent => {
    // ...
  }
);
```

```txt
 DONE  Compiled successfully in 790ms

             Asset     Size  Chunks                    Chunk Names
js/my-component.js  92.8 kB       0  [emitted]  [big]  js/widget
        /js/app.js   1.7 kB       1  [emitted]         /js/app
```

That's it! Webpack will dump all chunks straight in the `public` folder, so I generally prefix them with `js/` so I can easily ignore them in Git.

## Prefetching scripts

After splitting page-specific scripts, we can make some additional performance improvements. Consider an app with two pages: A and B. Page A is a lightweight document, page B uses our `my-component.js` chunk.

If a visitor lands on page A and navigates to page B, they'll need to wait for the `my-component.js` module to download and parse. We sped up page A's load time, but slowed down page B's.

It would be cool if we could give the browser a little hint of what's to come in page A. Something like—

_"Hey browser, here's this script I might need sometime in the future. If you've got some spare time feel free to go fetch it already, no hurry!"_

Browsers are pretty nifty nowadays, and that's totally possible! With the `link` tag, we're able to ask the browser to prefetch a resource if possible.

```
<link
    rel="prefetch"
    href="{{ asset('/js/my-component.js') }}"
    as="script"
>
```

Now, the browser will prefetch `my-component.js` without affecting the main page load. If a visitor goes from page A to B now, B won't need to download any more scripts because they're already cached.

## Go forth and split

Code splitting and prefetching look daunting at first, but once you've grasped the basic concepts, they're quite a performance boost for little effort.

A working example of the code is this post is available on [GitHub](https://github.com/sebastiandedeyne/code-splitting-with-laravel-mix).
