---
title: "Deterministic bliss in static methods"
slug: deterministic-bliss-in-static-methods
date: 2022-12-08
link: https://verraes.net/2014/06/when-to-use-static-methods-in-php/
tags:
  - PHP
---

Static methods tend to have a bad reputation in PHP, but I believe (stateless) static methods are underused. In static functions, there's no internal state to take into account. `Calculator::sum(1, 2)` only depends on its input, and will always return `3`.

While researching for another post, I came across an article from [Mathias Verraes](https://verraes.net/2014/06/when-to-use-static-methods-in-php/) that already says everything I wanted to say.

> It is stateless, it is free of side effects, and as such, it is entirely predictable. You can call the exact same function with the exact same argument as often as you like, and you will always get the exact same result back.
