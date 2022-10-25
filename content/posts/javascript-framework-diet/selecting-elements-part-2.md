---
date: 2020-02-06T10:40:00+01:00
title: Selecting elements (part 2)
slug: javascript-framework-diet/selecting-elements-part-2
categories: ["articles"]
series: javascript-framework-diet
tags:
  - JavaScript
  - Vanilla JS
---

In [Selecting elements (part 1)](/javascript-framework-diet/selecting-elements-part-1) we learned how to select elements from the DOM, and how to find elements inside other elements, both with our own `$` and `$$` helpers.

In part 2, we're going to review two DOM element instance methods: `closest` and `matches`.

<!--more-->

## Finding the nearest matching parent with `closest`

`Element.closest()` traverses the DOM upwards until it finds a parent that matches the specified selector. If nothing was found, it returns `null`.

While `querySelector` allows you to find all elements contained in another element, `closest` allows you to find an element in which another element is contained in.

```html
<ul data-image-gallery>
  <li><img></li>
  <li><img></li>
</ul>
```

```js
$$('img').forEach(image => {
  // Log the parent gallery
  console.log(
    image.closest('[data-image-gallery]')
  );
});
```

Read all about `Element.closest()` on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest).

## Testing selectors on an element with `matches`

Sometimes you have an element, but want to know whether it matches a certain selector. Here's where `Element.matches()` comes in.

`matches` returns `true` or `false` depending on whether the selector applies to the element or not.

```html
<input type="text">
<input type="email">
<input type="checkbox">
```

```js
$$('input').forEach(input => {
  if (input.matches('[type="checkbox"]')) {
    // Do something...
  }

  // Do something else...
});
```

Read all about `Element.matches()` on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches).

`Element.closest()` and `Element.matches()` will be used a lot more sparingly than `$` and `$$`. They're lesser known but very powerful when needed.
