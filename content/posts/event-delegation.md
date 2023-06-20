---
date: 2020-02-13
title: Event delegation
slug: javascript-framework-diet-event-delegation
categories: ["articles"]
tags:
  - JavaScript
  - Vanilla JS
  - JavaScript Framework Diet
---

After learning how to select elements in the DOM, it's time to zoom into events. This is the third post in the JavaScript Framework Diet series.

<!--more-->

<aside>
Haven't read the first two posts? Get started with the <a href="/javascript-framework-diet">introduction</a>.
</aside>

Consider the following piece of HTML:

```html
<a href="/projects">
  <svg><!-- List icon --></svg>
  Projects
</a>
<a href="/account">
  <svg><!-- User icon --></svg>
  Account
</a>
<a href="/settings">
  <svg><!-- Cog icon --></svg>
  Settings
</a>
```

If we want to listen to clicks on links with JavaScript, the first thing that generally comes to mind is `addEventListener`.

```js
function handleClick(event) {
  event.preventDefault();

  console.log('Clicked', event.target.href);
}

$$('a').forEach(link => {
  link.addEventListener('click', handleClick);
});
```

If we are to add more `a` elements to the DOM dynamically, we need to ensure we add more event listeners. This is an error-prone approach. It's easy to forget and adds bloat.

```js
const link = document.createElement('a');
link.href = '/';
link.textContent = 'Home';

document.body.appendChild(link);

link.addEventListener('click', handleClick);
```

With event delegation, you bind an event to the topmost element (in the case of the DOM, that's the `document` element), capture every event, and run the registered callback after determining whether it's relevant.

```js
document.addEventListener('click', event => {
  if (event.target.matches('a')) {
    event.preventDefault();

    console.log('Clicked', event.target.href);
  }
});
```

We need to register the event listener just once, and every `a` tag that gets added will also trigger the listener.

Our implementation isn't perfect yet. What if the visitor clicks one of the `svg` icons inside the link instead? Then `event.target` will be an SVG, despite it being nested inside the `a` tag.

We don't only need to check the event target, but traverse the DOM upwards to see if we're *inside* the event target too. The DOM has a solution for this: `Element.closest()`.

```js
document.addEventListener('click', event => {
  const target = event.target.closest('a');

  if (target) {
    event.preventDefault();

    console.log('Clicked', target.href);
  }
});
```

We're going to look for the `closest` target, and if we find one, execute a piece of code.

## Cleaning things up

Next to selecting DOM elements, listening to events is one of the most common things we'll be doing when building web apps. The setup for event delegation requires some boilerplate, so let's wrap it up in a `listen` function.

```js
function listen(type, selector, callback) {
  document.addEventListener(type, event => {
    const target = event.target.closest(selector);

    if (target) {
      callback(event, target);
    }
  });
}
```

To register a delegate event listener, specify an event type (what we're listening for), a selector (where we're listening for it) and a
callback (how to handle the event).

Now we can bind events in a similar way to `addEventListener`. The main difference is that `event.target` isn't entirely reliable anymore, so we need to pass our own target to the callback manually.

```js
listen('click', 'a', (event, target) => {
  event.preventDefault();

  console.log(`Clicked ${target.href}`);
});
```

## Why event delegation?

The main benefit of delegate event listeners is that you don't need to bind and unbind event listeners when the DOM changes. With `addEventListener`, you need to register a new event listener whenever an `a` gets added to the DOM. With event delegation, you set it once and can forget about it.

Event delegation can also positively affect performance. While this approach will get triggered more often (*every* click triggers the event listener, not just relevant ones), you only need to register a single listener, which has a more significant impact on performance.
