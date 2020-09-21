---
title: "A Tale of Client Side Framework Performance"
slug: a-tale-of-client-side-framework-performance
date: 2020-09-20
keywords:
  - JavaScript
  - performance
---

Jeremy Wagner measured some performance differences between React and vanilla JavaScript. While I'm not surprised that running your code on bare metal code is faster than a framework, it's interesting to see some exact numbers.

> React and ReactDOM total about 120 KiB of minified JavaScript, which definitely contributes to slow startup time. When client-side rendering in React is relied upon entirely, it churns. Even if you render components on the server and hydrate them on the client, it still churns because component hydration is computationally expensive.
>
> If it sounds like I have a grudge against React, then I must confess that I really like its componentization model. It makes organizing code easier. I think JSX is great. Server rendering is also cool—even if that’s just how we say “send HTML over the network” these days.

Even with server-side rendering, React and other virtual DOM frameworks add loading time because they need to load more code and hydrate the page before it's interactive.

A vanilla `addEventListener` callback performs about 40 times faster (!) than an event handled in a React component. React's overhead worth when you have a lot of complex state, not "simple state" like menu toggles.

Read the full article on [CSS-Tricks](https://css-tricks.com/radeventlistener-a-tale-of-client-side-framework-performance/).
