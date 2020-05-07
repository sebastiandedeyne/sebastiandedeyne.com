---
date: 2020-05-04
title: Enter & leave transitions
slug: javascript-framework-diet/enter-leave-transitions
categories: ["articles"]
series: javascript-framework-diet
keywords:
  - JavaScript
  - Vanilla JS
---

Now that we've built a dropdown list, lets add some transitions to create open & close animations.

<!--more-->

Broadly speaking, there are two ways to implement enter & leave transitions:

- Just use the `transition` CSS properties
- Animations with JavaScript (either by modifying CSS properties, with the web animation API, or with third-party animation libraries)

Unfortunately, `transition` doesn't cut it. Here's what we need for our dropdown list transition:

- When the dropdown opens, set it's `display` property to `block`, _then_ set transition `opacity` from `0` to `1`
- When the dropdown closes, transition `opacity` from `1` to `0`, _then_ set it's `display` property to `none`

We can't build this with CSS transitions alone, because there's no way to change the `display` value before or after the transition happened. I don't like JavaScript animations for these things in JavaScript either, because it couples your JavaScript to CSS and vice-versa.

## Best of both worlds

Inspired by [Vue](https://vuejs.org/v2/guide/transitions.html) and [Alpine](https://github.com/alpinejs/alpine#x-transition), we can get the best of both worlds.

We can use CSS to describe the animations across multiple steps, and use JavaScript to trigger those steps.

That means we have some generic "infrastructure" code in JavaScript, but the actual style changes are declared in CSS.

Here's how we'd declare a `fade` transition using Alpine's transition API:

```css
.fade-enter,
.fade-leave {
    transition: all 0.15s ease;
}

.fade-enter-start,
.fade-leave-end {
    opacity: 0;
}
```

With a few set class names, we can fully orchestrate various enter & leave transitions. From the [Alpine docs](https://github.com/alpinejs/alpine#x-transition):

- `*-enter`: Applied during the entire entering phase.
- `*-enter-start`: Added before element is inserted, removed one frame after element is inserted.
- `*-enter-end`: Added one frame after element is inserted (at the same time enter-start is removed), removed when transition/animation finishes.
- `*-leave`: Applied during the entire leaving phase.
- `*-leave-start`: Added immediately when a leaving transition is triggered, removed after one frame.
- `*-leave-end`: Added one frame after a leaving transition is triggered (at the same time  leave-start is removed), removed when the transition/animation finishes.

Want to slide instead of fade? Create a `slide` transition in CSS instead:

```css
.slide-enter,
.slide-leave {
    transition: all 0.15s ease;
}

.slide-enter-start,
.slide-leave-end {
    transform: translateX(-100px);
}
```

In our implementation, we're going to orchestrate these classes with two functions: `enter` to make an element appear, and `leave` to make it disappear.

```js
// Transition in
enter($('[data-dropdown-list]'), 'fade');

// Transition out
leave($('[data-dropdown-list]'), 'fade');
```

## Making elements appear with `enter`

Let's zoom in on the `enter` function first. Before we dive into code, lets review what it needs to do:

- Since the element isn't visible yet, remove `display: none` (we'll use a `hidden` class to control this)
- Add the `fade-enter` class
- Add the `fade-enter-start` class
- Remove the `fade-enter-start` class. Since we just added it, we need to ensure the previous changes have been rendered before we remove it, otherwise it's a no-op.
- Add the `fade-enter-end` class
- When the transition is finished, remove the `fade-enter-end` and `fade-enter` classes

In short, _we're gonna add and remove a bunch of classes_.

```js
function enter(element, transition) {
  element.classList.remove('hidden');

  element.classList.add(`${transition}-enter`);
  element.classList.add(`${transition}-enter-start`);

  // Wait until the above changes have been applied...

  element.classList.remove(`${transition}-enter-start`);
  element.classList.add(`${transition}-enter-end`);

  // Wait until the transition is over...

  element.classList.remove(`${transition}-enter-end`);
  element.classList.remove(`${transition}-enter`);
}
```

First we'll solve the `Wait until the above changes have been applied...` problem.

To ensure the `classList` changes are applied before moving on to removing the `*-start` class, we can use the browser's [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) function. When you wrap a function in `requestAnimationFrame`, that function will execute after the browser did it's next repaint, in our case after the element's `classList` has been visibly modified.

```js {hl_lines=["7","15"]}
function enter(element, transition) {
  element.classList.remove('hidden');

  element.classList.add(`${transition}-enter`);
  element.classList.add(`${transition}-enter-start`);

  requestAnimationFrame(() => {
    element.classList.remove(`${transition}-enter-start`);
    element.classList.add(`${transition}-enter-end`);

    // Wait until the transition is over...

    element.classList.remove(`${transition}-enter-end`);
    element.classList.remove(`${transition}-enter`);
  });
}
```

Because of a [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=675795), `requestAnimationFrame` sometimes incorrectly runs in the current frame _(derp)_. The known workaround is wrapping it in _another_ `requestAnimationFrame` call.

```js {hl_lines=["8","16"]}
function enter(element, transition) {
  element.classList.remove('hidden');

  element.classList.add(`${transition}-enter`);
  element.classList.add(`${transition}-enter-active`);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.classList.remove(`${transition}-enter-start`);
      element.classList.add(`${transition}-enter-end`);

      // Wait until the transition is over...

      element.classList.remove(`${transition}-enter-end`);
      element.classList.remove(`${transition}-enter`);
    });
  });
}
```

To keep our `enter` function clean, we'll extract the `requestAnimationFrame` logic to its own function that returns a promise, and turn `enter` into an `async` function.

```js {hl_lines=["1","7","16-22"]}
async function enter(element, transition) {
  element.classList.remove('hidden');

  element.classList.add(`${transition}-enter`);
  element.classList.add(`${transition}-enter-active`);

  await nextFrame();

  element.classList.remove(`${transition}-enter`);

  // Wait until the transition is over...

  element.classList.remove(`${transition}-enter-active`);
}

function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}
```

Now we need to find a way to wait until the transition is over. To do that, we need to know how long the transition takes. We can determine that by parsing the transition duration with `getComputedStyle`, which allows us to read the applied CSS values from JavaScript.

```js
const duration = Number(
  getComputedStyle(element)
    .transitionDuration
    .replace('s', '')
) * 1000;
```

We'll extract this to an helper function similar to the `nextFrame` function.

```js {hl_lines=["11","24-40"]}
async function enter(element, transition) {
  element.classList.remove('hidden');

  element.classList.add(`${transition}-enter`);
  element.classList.add(`${transition}-enter-active`);

  await nextFrame();

  element.classList.remove(`${transition}-enter`);

  await afterTransition(element);

  element.classList.remove(`${transition}-enter-active`);
}

function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

function afterTransition(element) {
  return new Promise(resolve => {
    const duration = Number(
      getComputedStyle(element)
        .transitionDuration
        .replace('s', '')
    ) * 1000;

    setTimeout(() => {
      resolve();
    }, duration);
  });
}
```

And now this should work!

```js
enter($('[data-dropdown-list]'), 'fade');
```

## Making elements disappear with `leave`

Now that we've learned how to make things appear, making them disappear shouldn't be too hard.

Once again, let's sketch out steps first:

- Add the `fade-leave` class
- Add the `fade-leave-start` class
- Remove the `fade-leave-start` class. Since we just added it, we need to ensure the previous changes have been rendered before we remove it, otherwise it's a no-op.
- Add the `fade-leave-end` class
- When the transition is finished, remove the `fade-leave-end` and `fade-leave` classes
- Finally, set the `display` property to `none` by adding a `hidden` class

In short, we're gonna add and remove a bunch of classes _again_.

```js
function leave(element, transition) {
  element.classList.add(`${transition}-leave`);
  element.classList.add(`${transition}-leave-start`);

  // Wait until the above changes have been applied...

  element.classList.remove(`${transition}-leave-start`);
  element.classList.add(`${transition}-leave-end`);

  // Wait until the transition is over...

  element.classList.remove(`${transition}-leave-end`);
  element.classList.remove(`${transition}-leave`);

  element.classList.add('hidden');
}
```

Nothing new here. We can fill in the gaps with the same utility functions as before.

```js {hl_lines=["1","7","11"]}
async function leave(element, transition) {
  element.classList.remove('hidden');

  element.classList.add(`${transition}-leave`);
  element.classList.add(`${transition}-leave-active`);

  await nextFrame();

  element.classList.remove(`${transition}-leave`);

  await afterTransition();

  element.classList.remove(`${transition}-leave-active`);
  element.classList.add('hidden');
}
```

## Applying the transitions to the dropdown

Now that we have our `enter` and `leave` functions in place, lets apply them to [last lesson's dropdown code](/javascript-framework-diet/dropdowns).

```js {hl_lines=["1","15","19"]}
import { listen, $, enter, leave } from '../util';

listen('click', '[data-dropdown-trigger]', openDropdown);

function openDropdown(event, dropdownTrigger) {
  const dropdownList = $(
    '[data-dropdown-list]',
    dropdownTrigger.closest('[data-dropdown]')
  );

  if (!dropdownList.classList.contains('hidden')) {
    return;
  }

  enter(dropdownList, 'fade');

  function handleClick(event) {
    if (!dropdownList.contains(event.target)) {
      leave(dropdownList, 'fade');

      window.removeEventListener('click', handleClick);
    }
  }

  window.requestAnimationFrame(() => {
    window.addEventListener('click', handleClick);
  });
}
```

And done! Our `enter` and `leave` functions will come in handy in the next lesson too, where we'll build a modal.
