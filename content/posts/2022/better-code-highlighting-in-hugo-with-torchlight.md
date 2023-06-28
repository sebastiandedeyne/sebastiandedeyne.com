---
title: "Better code highlighting in Hugo with Torchlight"
slug: better-code-highlighting-in-hugo-with-torchlight
date: 2022-11-18
categories: ["articles"]
tags:
  - Hugo
---

During my latest [redesign](https://sebastiandedeyne.com/2022-redesign/), I replaced Hugo's default code highlighting with [Torchlight](https://torchlight.dev). In this post, I'll explain how I set up Torchlight CLI for my Hugo site. (Although this can be applied to any static site.)

<!--more-->

Torchlight is a code-highlighter-as-a-service built on Visual Studio Code's editor highlighter editor. You throw blocks of code to Torchlight and they return them in a highlighted form. This results in a more complete highlight than alternatives like highlight.js, and a lot of available themes. Torchlight also supports less popular syntaxes like Laravel Blade.

In addition, Torchlight has a number of custom annotations. For example, you can collapse code by wrapping it between `[tl! collapse:start]` and `[tl! collapse:end]`.

```js
module.exports = { // [tl! collapse:start]
  // Your token from https://torchlight.dev
  token: process.env.TORCHLIGHT_TOKEN, // [tl! collapse:end]
}
```

To set up Torchlight with Hugo, we'll need to follow a few steps:

1. Register on torchlight.dev and generate an API token
2. Install Torchlight CLI
3. Configure Torchlight
4. Update our deploy script

## Register on torchlight.dev

You can create a free account on [torchlight.dev](https://torchlight.dev/) for personal and open source projects. When you have an account set up, generate a personal token to get started with the API.

## Torchlight CLI

For a static site, Torchlight CLI is the most straightforward way to get going.

```
npm i -g @torchlight-api/torchlight-cli
npx torchlight
```

The CLI tool scans a folder for HTML files, looks for `<pre><code>` blocks, passes them through the API and overwrites the original HTML. That means our statis site generator doesn't need to know about Torchlight and vice-versa. Hugo generates HTML, then Torchlight transforms it.

## Torchlight configuration

You'll also need a `torchlight.config.js` file to configure Torchlight and store your token.

Here's the config used by this site (less relevant parts are collapsed):

```js
module.exports = {
  // Your token from https://torchlight.dev
  token: process.env.TORCHLIGHT_TOKEN,

  // The Torchlight client caches highlighted code blocks. Here you
  // can define which directory you'd like to use. You'll likely
  // want to add this directory to your .gitignore. Set to
  // `false` to use an in-memory cache. You may also
  // provide a full cache implementation.
  cache: false,

  // Which theme you want to use. You can find all of the themes at
  // https://torchlight.dev/docs/themes.
  theme: "fortnite",

  // The Host of the API.
  host: "https://api.torchlight.dev",

  // Global options to control block-level settings.
  // https://torchlight.dev/docs/options
  options: { // [tl! collapse:start]
    // Turn line numbers on or off globally.
    lineNumbers: false,

    // Control the `style` attribute applied to line numbers.
    // lineNumbersStyle: '',

    // Turn on +/- diff indicators.
    diffIndicators: true,

    // If there are any diff indicators for a line, put them
    // in place of the line number to save horizontal space.
    diffIndicatorsInPlaceOfLineNumbers: true,

    // When lines are collapsed, this is the text that will
    // be shown to indicate that they can be expanded.
    summaryCollapsedIndicator: 'Click to expand…', // [tl! collapse:end]
  },

  // Options for the highlight command.
  highlight: {
    // Directory where your un-highlighted source files live. If
    // left blank, Torchlight will use the current directory.
    input: "public",

    // Directory where your highlighted files should be placed. If
    // left blank, files will be modified in place.
    output: "", // [tl! collapse:start]

    // Globs to include when looking for files to highlight.
    includeGlobs: ["**/*.htm", "**/*.html"],

    // String patterns to ignore (not globs). The entire file
    // path will be searched and if any of these strings
    // appear, the file will be ignored.
    excludePatterns: ["/node_modules/", "/vendor/"], // [tl! collapse:end]
  },
};
```

Things that stand out:

- `token`: We'll pass the token through an environment variable, more on that below
- `cache`: We'll only run Torchlight when deploying, so no need for a cache
- `theme`: My syntax highlighting theme of choice, there are many [themes](https://torchlight.dev/docs/themes) available
- `highlight.input`: This is where Torchlight CLI will scan files, the `public` folder is where Hugo outputs the final HTML.
- `highlight.output`: This is where Torchlight CLI will store the highlighted HTML files, it's empty so Torchlight will overwrite the input files.

## Deployment

This site is hosted on Netlify, `netlify.toml` has the following build command set up:

```toml
[build]
command = "hugo --minify"
publish = "public"
```

Since Torchlight needs to run after Hugo builds the site, we can chain a few additional commands.

```toml
[build]
command = """
hugo --minify
npm i -g @torchlight-api/torchlight-cli
npx torchlight
"""
publish = "public"
```

After adding a `TORCHLIGHT_TOKEN` environment variable in Netlify's UI we're up and running With the Torchlight configuration we set up earlier, Torchlight will highlight all files in `public` before they get published by Netlify.

## Local development

The biggest tradeoff with Torchlight is build speed. Hugo is fast (like, really fast), and adding a tool that relies on network requests is going to slow things down considerably.

I haven't configured Torchlight to run when watching for changes with `hugo server` because I value the instant build speed more when writing. Before I deploy, I'll often run the full build command locally to double check, but I don't really care about the highlighting while I'm in the middle of editing.

---

That's all you need to know to set up Torchlight with a static site. Thanks to [Aaron Francis](https://aaronfrancis.com/) for making Torchlight free for personal use!
