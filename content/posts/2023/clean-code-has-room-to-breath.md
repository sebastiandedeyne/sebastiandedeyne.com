---
title: "Clean code has room to breath"
slug: clean-code-has-room-to-breath
date: 2023-04-07T08:00:00+02:00
type: link
link: https://freek.dev/2206-code-that-breathes
tags:
  - Programming
---

Timeless advice from [Freek](https://twitter.com/freekmurze) & [Brent](https://twitter.com/brendt_gd).

> Just like reading text, grouping code in paragraphs can be helpful to improve its readability. We like to say we add some "breathing space" to our code.

```php
$page = $this->pages()->where('slug', $url)->first();
if (! $page) {
    throw new Exception();
}
```

```php
$page = $this->pages()->where('slug', $url)->first();

if (! $page) {
    throw new Exception();
}
```

Just one line of space can make the difference.
