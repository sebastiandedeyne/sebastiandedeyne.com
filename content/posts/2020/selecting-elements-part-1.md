---
date: 2020-02-06T10:39:00+01:00
title: Selecting elements (part 1)
slug: javascript-framework-diet-selecting-elements-part-1
tags:
  - JavaScript
  - Vanilla JS
  - JavaScript Framework Diet
---

Lets get warmed up! Before we can get productive, we need two small helpers that we'll be using in most components we'll build from here on. I'm talking about `$` and `$$`, which are wrappers around `document.querySelector` and `document.querySelectorAll`.

<!--more-->

```js
function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function $$(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}
```

Why bother since they're near aliases of their native counterparts? One of the reasons we declare these is because the native functions names are so damn long. It's not about laziness, the verbosity of the native functions hurts readability.

## Selecting a single element

`$` selects a single occurrence of an element that matches a given selector.

```js
function $(selector, scope = document) {
  return scope.querySelector(selector);
}

const map = $('[data-map]');
```

By default, `$` looks for a matching element across the entire document. Use the optional `scope` argument to look for an element inside another.

```html
<div data-map>
  <div data-map-marker></div>
</div>
```

```js
const map = $('[data-map]');

const marker = $('[data-map-marker]', map);
```

## Selecting multiple elements

`$$` selects all occurrences of an element that matches a given selector.

```js
function $$(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

const imageGalleries = $$('[data-image-gallery]');
```

This one contains a bit more plumbing than `$`.  `document.querySelectorAll` returns a `NodeList` object, which doesn't provide any array functions like `map` and `forEach` (in most browsers at least). Before returing the result, the `NodeList` gets transformed to an array, which is way more useful.

```js
$$('[data-image-gallery]').forEach(imageGallery => {
  //
});
```

Just like `$$` it can accept a scope as its second argument.

```html
<ul data-image-gallery>
  <li><img></li>
  <li><img></li>
</ul>
```

```js
$$('[data-image-gallery]').forEach(imageGallery => {
  const images = $$('img', imageGallery);

  //
});
```

## A note on performance

Browsers also have more specific functions to target nodes like `getElementById` and `getElementsByClassName`. These are more than twice as fast as `querySelector`, should we use those instead?

`querySelector` can run _over thousands times per millisecond_. This is probably more than fast enough for your application. If you're writing low level framework code, it's a different story, but for application development, `querySelector` is cheap enough.

In [Chris Ferdinandi's words](https://gomakethings.com/javascript-selector-performance/): It's not slow. It's just not _as_ fast.

These selector functions will be one of the main building blocks for the vanilla JS components we'll be creating over the next few weeks.
