---
title: "React's versioning policy"
date: 2019-10-08
link: https://reactjs.org/docs/faq-versioning.html
keywords:
    - React
    - JavaScript
    - OSS
---

React follows semantic versioning, but with a twist. From their [versioning policy](https://reactjs.org/docs/faq-versioning.html):

> When releasing **critical bug fixes**, we make a **patch release** by changing the z number (ex: 15.6.2 to 15.6.3).
>
> When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the y number (ex: 15.6.2 to 15.7.0).
>
> When releasing **breaking changes**, we make a **major release** by changing the x number (ex: 15.6.2 to 16.0.0).

The twist is subtle: non-critical bugfixes are released as minor releases.

I've often wondered whether three digits really is necessary for versioning. As a package maintainer, deciding between minor and patch is often a gray area.

Two digits would suffice: breaking changes and non-breaking changes. Feature or bugfix doesn't really matter from a technical point of view: upgrading can either break things, or can't.

React reserves the patch number for critical bugfixes, which I believe is a necessary escape hatch in a two digit system. But I like I how they default to simply bumping minor versions.
