---
date: 2019-05-05
title: Understand React hooks internals with a 28-line React clone
link: https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/
categories: ["links"]
tags:
    - javascript
    - react
---

Shawn Wang ([@swyx](https://twitter.com/swyx)) wrote about how React hooks work internally. The article is a deep dive into JavaScript closures, and builds up to a 28-line React clone with support for the `useEffect` and `useState` hooks.

> In this article, we reintroduce closures by building a tiny clone of React Hooks. This will serve two purposes – to demonstrate the effective use of closures, and to show how you can build a Hooks clone in just 29 lines of readable JS. Finally, we arrive at how Custom Hooks naturally arise.

Understanding how React deals with hooks internally isn't a required to use them, but it's interesting material nonetheless!

You can read the full article on the [Netlify blog](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/).
