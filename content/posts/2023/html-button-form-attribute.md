---
title: "HTML button form attribute"
slug: html-button-form-attribute
date: 2023-06-09T10:55:00+02:00
tags:
  - Html
---

Thanks to my colleague [Sam](https://www.sams.land) I recently learned about the `form` attribute on the `<button>` element.

By setting a `form` attribute, the button becomes a submit button for a form on the page with that ID, without having to nest the button on the page.

This could be useful for a logout link, used on different places.

```html {.short}
<nav>
  <!-- … -->
  <button type="submit" form="logout">
    Log out
  </button>
</nav>

<footer>
  <!-- … -->
  <button type="submit" form="logout">
    Log out
  </button>
</footer>

<form id="logout" method="POST" action="/logout">
</form>
```
