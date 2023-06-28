---
date: 2019-11-06
title: "The rule of least power"
type: link
link: https://www.w3.org/2001/tag/doc/leastPower.html
tags:
    - programming
    - the web
---

During his lightning talk at Full Stack EU, [Bram Van Damme](https://twitter.com/bramus) mentioned the rule of least power.

The rule of least power was described in an essay by Tim Berners-Lee back in 2006.

> When designing computer systems, one is often faced with a choice between using a more or less powerful language for publishing information, for expressing constraints, or for solving some problem. This finding explores tradeoffs relating the choice of language to reusability of information. The "Rule of Least Power" suggests choosing the least powerful language suitable for a given purpose.

This is a useful principle to follow for the web because less powerful languages fail better.

Forgot a closing tag in HTML? There's a fair chance the browser will just fix it for you.

Did you write an invalid or unsupported CSS rule? The browser will ignore the statement and parse the rest as intended.

Got a syntax error in your JavaScript app? Prepare to watch the world burn.

Read the full essay on [w3.org](https://www.w3.org/2001/tag/doc/leastPower.html).
