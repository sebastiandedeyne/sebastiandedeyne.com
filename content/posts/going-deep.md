---
title: "Going deep"
slug: going-deep
date: 2020-10-20T06:00:00
categories: ["articles"]
tags:
  - everything
  - software
  - performance
---

I recently stumbled across an over 5 year old [comment](https://news.ycombinator.com/item?id=8902739) on Hacker News about performance.

> Lots of people make the mistake of thinking there's only two vectors you can go to improve performance, high or wide.
>
> - High - throw hardware at the problem, on a single machine
> - Wide - Add more machines
>
> There's a third direction you can go, I call it "going deep". Today's programs run on software stacks so high and so abstract that we're just now getting around to redeveloping (again for like the 3rd or 4th time) software that performs about as well as software we had around in the 1990s and early 2000s
>
> Going deep means stripping away this nonsense and getting down closer to the metal, using smart algorithms, planning and working through a problem and seeing if you can size the solution to running on one machine as-is.

The author talks about "high" and "wide" hardware changes, but this can apply to software too. It's easier to throw a cache at a slow piece of code than going deep and fixing it.

No need to look far, Electron is built on this principle. We're adding heavy runtimes to support multiple platforms instead of staying close to the metal, and we pay the price in performance.

<!--more-->

In general, it's easier to add than subtract.

Which leads me to Derek Siver's thoughts on [subtraction](https://sive.rs/subtract).

> Life can be improved by adding, or by subtracting. The world pushes us to add, because that benefits them. But the secret is to focus on subtracting.
>
> The adding mindset is deeply ingrained. It’s easy to think I need something else. It’s hard to look instead at what to remove.

Adding is often a short-term solution. This isn't necessarily a bad thing: time and budget restrictions are real problems. Adding often accrues more debt than subtracting, that's the price we pay. Adding doesn't save time, it lends time.
