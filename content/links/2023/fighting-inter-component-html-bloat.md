---
title: "Elise Hein: 'Fighting inter-component HTML bloat'"
slug: fighting-inter-component-html-bloat
date: 2023-04-06T08:00:00+02:00
link: https://elisehe.in/2023/03/27/minimal-html-in-design-systems
tags:
  - HTML
  - Frontend
---

As I'm refactoring an existing design system, this article by [Elise Hein](https://twitter.com/elisehein) came quit timely.

We consider HTML to be cheap, but wrapping `div`s in `div`s in `div`s comes with a cost that slowly creeps up.

> Why avoid extra wrapper elements?
>
> 1. Bloated html hurts performance
> 2. Redundant elements can create problems with accessibility
> 3. Redundant elements can break styling
> 4. Deeply nested dom trees are annoying to work with
