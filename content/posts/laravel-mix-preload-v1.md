---
title: "Laravel Mix Preload v1"
date: 2019-10-21
categories: ["articles"]
tags:
  - Laravel
---

Today I tagged v1 of a new package: Laravel Mix Preload. It automatically generates `preload` and `prefetch` links based on the contents of your `mix-manifest.json` file.

<!--more-->

In a nutshell, a `preload` link loads a resource after the document has loaded. It doesn't do anything with the resource, the browser just ensures it ready for future use.

A `prefetch` link hints the browser that a resource might be needed. The browser can fetch the resource when it has some extra time on its hands, but it's not a certainty.

Addy Osmani wrote an [in-depth post](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf) about preloading and prefetching if you want to read about the nitty gritty details.

I wrote the majority of this package back in March when I was designing and building a website for [Full Stack Belgium](https://fullstackbelgium.be). It contains a section with meetup photos that open a lightbox when clicked. The lightbox library only gets loaded  when necessary. However, I wanted the lightbox script to be preloaded so it would open as soon as possible when called upon.

Preload and prefetch links need to be manually inserted in the page's `head`. I didn't like this approach because I wanted to declare what needs to be preload in my script files instead. This avoids the risk of trying to preload resources that don't exist anymore, or forgetting to preload something altogether.

The package adds a `@preload` Blade directive that will generate preload and prefetch links for all scripts and stylesheets that have `preload` or `prefetch` as part of their file name.

```html
<head>
    <title>Preloading things</title>

    @preload
</head>
```

On [fullstackbelgium.be](https://fullstackbelgium.be/), I used a dynamic import in [the main script](https://github.com/fullstackbelgium/fullstackbelgium.be/blob/9e33730d51af04bda9eb99bafb8f1f9b9526c641/resources/js/app.js) to pull in the lightbox library when an image is clicked on the page. Using Webpack's [special `webpackChunkName` comment](https://webpack.js.org/api/module-methods/#magic-comments), I added `preload` to the chunk name. That tells the package to preload the chunk by rendering a `<link rel="preload">` link where the `@preload` directive is placed.

```js
import('./photoswipe' /* webpackChunkName: "preload-photoswipe" */)
  .then(({ init }) => {
    init({ pswpEl, items, index });
  });
```

You can find the package with full documentation and more examples [on GitHub](https://github.com/spatie/laravel-mix-preload).
