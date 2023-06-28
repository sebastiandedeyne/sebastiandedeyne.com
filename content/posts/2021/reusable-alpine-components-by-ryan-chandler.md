---
title: "Reusable Alpine Components by Ryan Chandler"
slug: reusable-alpine-components-by-ryan-chandler
date: 2021-04-07
type: link
link: https://ryangjchandler.co.uk/articles/writing-reusable-alpine-components
tags:
  - Alpine
  - JavaScript
---

I've been using Alpine often lately. Ryan has written a lot of [good stuff](https://ryangjchandler.co.uk/posts?category=alpinejs) on Alpine, but his reusable components post is what really got me kickstarted.

> You should be careful to not abstract too early. If you are finding it difficult to manage your Alpine component from the `x-data` attribute, this one is definitely for you.

The way this article builds up was very helpful: only use the level of abstraction you need:

1. No abstractions
2. Extract to a component function
3. Use `x-spread`
4. Mix in other data
