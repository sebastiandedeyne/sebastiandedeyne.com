---
date: 2020-02-19
title: File structure
slug: javascript-framework-diet-file-structure
type: article
tags:
  - JavaScript
  - Vanilla JS
  - JavaScript Framework Diet
---

In the previous posts, we've gone through our first few utility functions. We now have enough in our toolbox to move on to our first component. However, where do all these functions belong?

<!--more-->

Let's get straight to the point. Here's what the structure of my vanilla JS projects looks like:

```txt
components/
    datePicker.js
    dropdown.js
util/
    index.js
    listen.js
    query.js
app.js
```

On the top level, we have one file and two folders. `app.js` is the script that will eventually end up in our users' browsers.

```html
<script src="/js/app.js" defer></script>
```

99% of the time, I include scripts in the `head` of the document with a `defer` tag. This means the script is loads and parses while the rest of the document is still loading. The script only gets executed after the document is ready.

The `util` folder contains utility functions; these aren't tied to DOM elements but are everyday helper functions that we'll use to build components. We've already reviewed a few utilities in the previous posts: `$`, `$$`, and `listen`.

The utility functions are split across multiple files to keep them manageable, although in smaller projects, you can start with a single `util.js` file and extract where necessary.

```js
// util/query.js

export function $(selector, scope = document) {
    return scope.querySelector(selector);
}

export function $$(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}
```

`util/index.js` acts as the entry point for all utility functions.

```js
// util/index.js

export * from './listen.js';
export * from './query.js';
```

In component scripts, we can then easily access all utility functions with a single import, without worrying where they belong on the file system.

```js
// components/dropdown.js

import { $, listen } from '../util';
```

Don't worry about the rest of the contents of a component script yet, that's for the next post in this series.

Components are then imported in `app.js`.

```js
// app.js

import './components/datePicker';
import './components/dropdown';
```

Components with large dependencies can be code split with Webpack to keep the initial bundle size smaller.

```js
// app.js

import { $ } from './util';
import './components/dropdown';

if (document.querySelector('[data-date-picker]')) {
  import('./components/datePicker');
}
```

<aside>Code splitting is a topic on its own; I might cover it in detail in a future post.</aside>

As a project grows, this structure might get unwieldy over time. In that case, you could split the `components` folder into subfolders.

We now have enough knowledge to build our first component: a dropdown list!
