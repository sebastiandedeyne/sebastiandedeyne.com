---
date: 2017-08-29
title: Diving into requestAnimationFrame with Benjamin De Cock
type: link
link: https://medium.com/@bdc/gain-motion-superpowers-with-requestanimationframe-ecc6d5b0d9a4
tags:
  - JavaScript
  - animations
  - performance
---

I love this post! `requestAnimationFrame` is a primitive browser API that doesn’t sound too interesting at first, but once you've grasped some basic concepts, it becomes an extremely powerful tool for dealing with animations in JavaScript.

> At its core, `requestAnimationFrame` doesn’t do much: it’s basically just a method that executes a callback. In fact, there are very few differences between doing `requestAnimationFrame(doSomething)` and `doSomething()`. So, what’s so special about it? I’m glad you asked! In short:
>
> - `requestAnimationFrame` schedules the callback call on the next repaint
> - `requestAnimationFrame` passes the callback the current time
>
> There are a few other distinctions, but these are the main benefits. Now, `requestAnimationFrame` doesn’t create an animation on its own, it’s the sequence of successive callbacks that will make things move on the screen.

My favorite part: since a large part of animating with `requestAnimationFrame` consists of composing small mathematical expressions, you can apply all sorts of functional programming tricks to your code.

Learn all about it on [Benjamin De Cock’s blog](https://medium.com/@bdc/gain-motion-superpowers-with-requestanimationframe-ecc6d5b0d9a4).
