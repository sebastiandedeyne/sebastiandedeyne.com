---
date: 2020-02-06T10:38:00+01:00
title: JavaScript Framework Diet
slug: javascript-framework-diet
categories: ["articles"]
series: javascript-framework-diet
keywords:
  - JavaScript
  - Vanilla JS
summary: |
  JavaScript frameworks are great, but overused. Adding small bits of interactivity to an interface shouldn't mean installing kilobytes of dependencies or introducing complex build tools.

  It's time for a diet. I'm challenging you to build something without a framework, or follow along and learn something along the way.
---

Back in the early 2010s, skeuomorphic design was at its peak. Apple apps were the gold standard of visual design, and they all tried to mimic real-world objects and textures as realistically as possible.

![An iPad app during peak skeuomorphism](/media/apple-skeuomorphism.jpg)

This lead to designers using a plethora of textures and depth, turning every Photoshop doc into a complicated mess of *layer styles*.

![Photoshop's layer styles dialog](/media/photoshop-layer-styles.jpg)

Right before the skeuomorphic trend was about to start ebbing away, a designer named Visual Idiot came with the idea of a *Layer Style Diet*. The site doesn't exist anymore, but I was able to pull it up from the [Wayback Machine](https://web.archive.org/web/20121027120339/http://layerstylediet.com/).

![Screenshot of the layer style diet webpage](/media/layer-style-diet.jpg)

The CSS is broken, but the message remains:

> Your simplest work is your best. True aesthetics are being hidden behind unneccessary gradients, shadows, and patterns.
>
> Layer Style Diet presents a simple challenge: for one project only, be it a site, logo, icon set, or any other form of work, do not use any layer styles or effects.

What does all this have to do with JavaScript? In the spirit of the Layer Style Diet: a return to basics to burst your creative bubble.

I'm not advocating to stop using frameworks and don't want to impose any new solutions on you. JavaScript frameworks are great, but overused. Adding small bits of interactivity to an interface shouldn't mean installing kilobytes of dependencies or introducing complicated build tools, but we're wired to do so by default.

It's time to go on a diet. I challenge you to build something without a framework, or follow along and learn something along the way.

I'm going to write about everything I learned while [building Mailcoach without a framework](https://sebastiandedeyne.com/mailcoachs-lack-of-javascript-stack/), from setting up some basic utility functions to get up and running, to building components almost every app needs like modals and dropdowns.
