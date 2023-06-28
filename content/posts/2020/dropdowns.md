---
date: 2020-03-05
title: Dropdowns
slug: javascript-framework-diet-dropdowns
tags:
  - JavaScript
  - Vanilla JS
  - JavaScript Framework Diet
---

On to our first component: a dropdown list. I'm going to walk through the implementation I landed on in a recent project. There are many ways to build dropdowns, and you might want to shape the API your way, so use this post as a source of inspiration.

<!--more-->

Before we dive into the script, let's take a look at our HTML.

```html
<div data-dropdown>
  <button data-dropdown-trigger>
    Hello, Sebastian
  </button>
  <ul data-dropdown-list class="hidden">
    <li><a href="#">Profile</a></li>
    <li><a href="#">Settings</a></li>
    <li><a href="#">Log out</a></li>
  </ul>
</div>
```

For our dropdown, we need to register three "hooks" in our HTML. `data-dropdown-trigger` will receive a click listener that opens the dropdown. The dropdown itself gets a `data-dropdown-list` attribute. The `data-dropdown` attribute creates a "scope" to connect the trigger and list.

<aside>I like using HTML data attributes to hook into the DOM from JavaScript, but if you prefer CSS classes go for it!</aside>

The list initially has a `hidden` class. `hidden` is a small CSS class that sets the `display` property to `none`.

```css
.hidden {
  display: none !important;
}
```

Our code needs to do two things to manage a dropdown:

- When the dropdown is *closed* and the user clicks on the dropdown trigger, the dropdown list appears.
- When the dropdown is *open* and the user clicks anywhere on the page outside of the dropdown list, the dropdown list disappears.

For the first rule, we need to listen to clicks on the dropdown trigger.

```js
import { listen } from '../util';

listen('click', '[data-dropdown-trigger]', openDropdown);

function openDropdown(event, dropdownTrigger) {
  // Open dropdown
}
```

With our `listen` utility function, we can register an event listener for all `data-dropdown-trigger` clicks.

To open the dropdown, we need to remove the `hidden` class from the dropdown list. Before we can do that, we need to find the list element. As we've seen in the HTML, the list is enclosed in the same `data-dropdown` parent.

```js {hl_lines=["6-11"]}
import { listen, $ } from '../util';

listen('click', '[data-dropdown-trigger]', openDropdown);

function openDropdown(event, dropdownTrigger) {
  const dropdownList = $(
    '[data-dropdown-list]',
    dropdownTrigger.closest('[data-dropdown]')
  );

  dropdownList.classList.remove('hidden');
}
```

By removing the `hidden` class, the dropdown becomes visible.

Next, we need to hide the dropdown when the user clicks anywhere on the page outside of the dropdown list.

```js {hl_lines=["13-17"]}
import { listen, $ } from '../util';

listen('click', '[data-dropdown-trigger]', openDropdown);

function openDropdown(event, dropdownTrigger) {
  const dropdownList = $(
    '[data-dropdown-list]',
    dropdownTrigger.closest('[data-dropdown]')
  );

  dropdownList.classList.remove('hidden');

  function handleClick(event) {
    if (!dropdownList.contains(event.target)) {
      dropdownList.classList.add('hidden');
    }
  }
}
```

We declared a new `handleClick` function. When the click happens *outside* of the dropdown list, we reapply the `hidden` class.

`handleClick` needs to be registered as an event listener. We need to listen to all click events on `window`, and remove the event listener after the dropdown is hidden (there's no point in hiding it twice!).

```js {hl_lines=["17", "21"]}
import { listen, $ } from '../util';

listen('click', '[data-dropdown-trigger]', openDropdown);

function openDropdown(event, dropdownTrigger) {
  const dropdownList = $(
    '[data-dropdown-list]',
    dropdownTrigger.closest('[data-dropdown]')
  );

  dropdownList.classList.remove('hidden');

  function handleClick(event) {
    if (!dropdownList.contains(event.target)) {
      dropdownList.classList.add('hidden');

      window.removeEventListener('click', handleClick);
    }
  }

  window.addEventListener('click', handleClick);
}
```

There's one more subtle bug in the code. The `handleClick` listener is registered during the click event on the dropdown trigger. This click event will *also* trigger `handleClick` which causes the dropdown to close immediately.

To work around this issue, we need to wrap the event listener registration in a `requestAnimationFrame` call so it will be registered in the browser's next event loop, after the current event is handled.

```js {hl_lines=["21", "23"]}
import { listen, $ } from '../util';

listen('click', '[data-dropdown-trigger]', openDropdown);

function openDropdown(event, dropdownTrigger) {
  const dropdownList = $(
    '[data-dropdown-list]',
    dropdownTrigger.closest('[data-dropdown]')
  );

  dropdownList.classList.remove('hidden');

  function handleClick(event) {
    if (!dropdownList.contains(event.target)) {
      dropdownList.classList.add('hidden');

      window.removeEventListener('click', handleClick);
    }
  }

  window.requestAnimationFrame(() => {
    window.addEventListener('click', handleClick);
  });
}
```

<aside>The event loop is a topic that deserve a post on its own. Watch Jake Archibald's excellent <a href="https://www.youtube.com/watch?v=cCOL7MC4Pl0">In The Loop</a> talk if you're keen to learn more.</aside>

Lastly, when the dropdown is already open, and the user clicks the dropdown trigger, we don't want to rerun the entire event registration. We'll add an early return for that. Here's the final version of our script:

```js {hl_lines=["11-13"]}
import { listen, $ } from '../util';

listen('click', '[data-dropdown-trigger]', openDropdown);

function openDropdown(event, dropdownTrigger) {
  const dropdownList = $(
    '[data-dropdown-list]',
    dropdownTrigger.closest('[data-dropdown]')
  );

  if (!dropdownList.classList.contains('hidden')) {
    return;
  }

  dropdownList.classList.remove('hidden');

  function handleClick(event) {
    if (!dropdownList.contains(event.target)) {
      dropdownList.classList.add('hidden');

      window.removeEventListener('click', handleClick);
    }
  }

  window.requestAnimationFrame(() => {
    window.addEventListener('click', handleClick);
  });
}
```

And there we have it, our first component! I created [a CodePen](https://codepen.io/sebdd/pen/ExjvzJP?editors=1010) with the final version if you want to play around.

In the next post, we'll look into transitions and apply a fancy fade & scale effect to the dropdown when it appears and hides.
