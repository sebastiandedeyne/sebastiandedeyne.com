---
title: "Refactoring callbacks to async/await"
slug: refactoring-callbacks-to-async-await
date: 2020-05-08
---

Web browsers have a few functions that accept callback parameters. `setTimeout` and `requestAnimationFrame` are the first that come to mind.

If you need to do multiple calls to these functions in a row, you quickly end up in callback hell. Here's a quick tip to flatten your code with async/await.

<!--more-->

This is extracted from an actual piece of code I was working on last week:

```js
function callbackHell() {
  // A

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // B

      setTimeout(() => {
        // C
      }, 1000);
    });
  });
}
```

Before you know it, your code is nested 3 or more levels deep.

One thing these functions with callback parameters have in common, is that they use the callback to _"run something after waiting for something else"_. Sounds like a great case for async/await!

First we need to make `callbackHell` `async` to enable the `await` keyword inside the function.

```js {hl_lines=["1"]}
async function callbackHell() {
  // A

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // B

      setTimeout(() => {
        // C
      }, 1000);
    });
  });
}
```

Next, we'll create a wrapper function around `requestAnimationFrame` to make it awaitable. Any function that returns a promise is awaitable.

```js
function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}
```

This can be shortened to a (kind of) oneliner:

```js {hl_lines=["2"]}
function nextFrame() {
  return new Promise(requestAnimationFrame);
}
```

Now that `nextFrame` returns a promise, we can `await` it.

```js {hl_lines=["4", "5"]}
async function callbackHell() {
  // A

  await nextFrame();
  await nextFrame();

  // B

  setTimeout(() => {
    // C
  }, 1000);
}
```

Let's do the same with `setTimeout`.

```js
function timeout(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}
```

Once again, a bit shorter:

```js {hl_lines=["2"]}
function timeout(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
```

And our final `callbackHell` function:

```js {hl_lines=["9"]}
async function callbackHell() {
  // A

  await nextFrame();
  await nextFrame();

  // B

  await timeout(1000);

  // C
}
```

No more callback hell, just one straight line!

## Caveats

Refactoring to async/await only works if you don't care about the return value of these functions.

For example, `setTimeout` returns an ID that can be used to cancel the timeout.

```js
const timeout = setTimeout(() => {}, 1000);

clearTimeout(timeout);
```

This piece of code can't be refactored to async/await, since `await` only returns a value _after_ the timeout has completed.
