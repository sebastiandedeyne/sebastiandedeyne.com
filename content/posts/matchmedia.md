---
title: "The window.matchMedia API"
slug: matchmedia
date: 2021-04-05
categories: ["articles"]
keywords:
  - JavaScript
---

To execute a piece of code when the viewport is a certain size, the first thing that comes to mind is adding a `resize` event listener to the `window` object. This is one way, but not always the best. Sometimes the lesser known `window.matchMedia` API is a better fit.

<!--more-->

This is the well-known way to trigger something in JavaScript when the viewport size changes.

```js
window.addEventListener('resize', (event) => {
  if (window.innerWidth >= 960) {
        // …
  } else {
    // …
  }
});
```

The `resize` event is triggered whenever the viewport size changes. If the browser window is 1200px wide, and the user resizes, the callback will be called `n` times until they stop.

Performance issues can be solved with a [debounce](https://davidwalsh.name/javascript-debounce-function) function to reduce the number of calls. Or, we can use the declarative `matchMedia` listener that will only execute when the match result changes.

```js
window.matchMedia('(min-width: 960px)')
  .addEventListener('change', (query) => {
    if(query.matches) {
      // …
    } else {
      // …
    }
  });
```

The callback will be invoked whenever `query.matches` changes `true` or `false`.

`matchMedia` is a fun little API. You can also access the current result with `matches`.

```js
window.matchMedia('(min-width: 960px)').matches;
```

Since it's built on media queries, you can use `matchMedia` for other things too—like dark mode!

```js
window.matchMedia('(prefers-color-scheme: dark)').matches;
```
