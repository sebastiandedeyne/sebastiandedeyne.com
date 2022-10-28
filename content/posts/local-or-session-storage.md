---
title: "Local or session storage"
slug: local-or-session-storage
date: 2022-10-28
categories: ["articles"]
tags:
  - JavaScript
---

Local storage tends to be the obvious place to persist data locally in a web application. We tend to grab straight for `localStorage`, but it's not the only tool in our workbox. Another option is `sessionStorage`. Let's review their similarities and differences, and determine when to use which.

<!--more-->

---

`localStorage` and `sessionStorage` are part of the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) have the same key/value mechanism. We can write with `setItem`, and read with `getItem`.

```js
localStorage.setItem('scheme', 'dark');
const colorScheme = localStorage.getItem('scheme');
```

```js
sessionStorage.setItem('scheme', 'dark');
const colorScheme = sessionStorage.getItem('scheme');
```

They both store data as strings, but can store objects, arrays, and other primitive values as JSON with `JSON.stringify` and `JSON.parse`.

```js
localStorage.setItem(
  'preferences',
  JSON.stringify({ scheme: 'dark' })
);

const preferences = JSON.parse(
  localStorage.getItem('preferences') || '{}'
);
```

These are pretty naive snippets. When dealing with storage, `try/catch` is advices to avoid storage limits and other caveats. [This post](http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors) explains it better than I ever could.

So when to use `sessionStorage` over `localStorage`?

## window.localStorage

`localStorage` is long-living, and shared across all visits to the same domain. Unless the user explicitly clears their cache, data will remain persisted.

It's a good fit for things you want to remember forever. It's still a local cache, so forever means "as long as possible."

- **Critical application data,** like a JWT to authenticate a user
- **Long-lived application preferences,** like a dark mode toggle
- **Long-lived choices a user makes on a site,** like a country picker
- **Data in an app with offline support,** either as a cache for server data or as a queue for commands to sync with the server when it's back online

## window.sessionStorage

`sessionStorage` has a short lifetime, and is shared across all visits to the same URL in that tab. When the user closes their tab, stored data is discarded.

It's good fit for things you want persisted for a short time.

- **Page state,** like a datatable filter
- **Draft content,** like the contents of a textarea for a comment
- **Scroll positions** or dynamic elements on a page, so they're restored when the user hits the back button

## General guidelines

In my experience, `localStorage` vs `sessionStorage` generally boils down to:

- If you want to store something that applies to the entire site or app, use `localStorage`
- If you want to store something that applies to a specific page, use `sessionStorage`

This all highly subjective and depends on context. Datatable filters or draft content make more sense in `localStorage`. It depends on whether users expect to return to the page with a clean slate, or be able to pick up exactly where they left off.

---

*There are more ways to store data locally like [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [History.state](https://developer.mozilla.org/en-US/docs/Web/API/History/state), or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). They each have their own use, but none are as straightforward as the Web Storage API.*
