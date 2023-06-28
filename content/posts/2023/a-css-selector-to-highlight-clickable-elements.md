---
title: "A CSS selector to highlight clickable elements"
slug: a-css-selector-to-highlight-clickable-elements
date: 2023-03-31T11:00:00+02:00
tags:
  - CSS
---

I was building wireframes for a website with HTML & CSS. Since it's a prototype, not all actions are functional. When a visitor reviewing the prototype tries to click something that isn't hooked up, I wanted to clarify what they _could_ interact with. This also allows visitors to click anywhere on the page to highlight what they can click.

In the past, I've used JavaScript to add an `outline` to clickable elements when something non-interactive was clicked. But with the `:has` and `:is` selectors, this is doable with plain CSS.

```css
html:active:not(:has(a:active, button:active, label:active)) :is(a, button, label) {
  outline: 2px solid blue;
}
```

How it works:

- `html:active` will match whenever you hold down your mouse on the page
- `:not(:has(a:active, button:active, label:active))` will not match when you're holding down your mouse on an `a`, `button`, or `label` element, to avoid the outline from appearing when the user clicks something that _is_ functional
- `:is(a, button, label)` matches all  `a`, `button`, and `label` elements on the page

View a demo on [CodePen](https://codepen.io/sebdd/pen/ZEMwxqB?editors=1100).
