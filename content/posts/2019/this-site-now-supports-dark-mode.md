---
title: "This site now supports dark mode"
date: 2019-10-09
tags:
    - this website
---

I prefer to use light interfaces, so I rarely use dark mode in macOS or iOS. I often see people add dark mode to their sites, but never really knew whether visitors actually care. I started a [Twitter poll](https://twitter.com/sebdedeyne/status/1181936841869713409):

> Do you consider dark mode on websites / blogs (not apps) useful?

The poll is still open. At the time of writing, 225 people responded, and 47% answered "Yes". Enough to convince me to add a dark mode to my blog.

<!--more-->

This site is built with [Tailwind](https://tailwindcss.com), and I wanted to be able to write classes like `bg-white dark:bg-black` based on the `prefers-color-scheme` [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme). I came a across a post by Stefan Zweifel with an elegant solution to register it as a "screen" in Tailwind.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' }
      }
    }
  }
};
```

[Here's the commit](https://github.com/sebastiandedeyne/sebastiandedeyne.com/commit/44079c3be7d1971ad287267597d89dfeb9dea350) that added dark mode support to this website. Since my design is quite minimalistic, it didn't require too many changes.

Check out [Stefan's post](https://stefanzweifel.dev/posts/2018/10/30/support-mojave-dark-mode-with-tailwind-css) for an in-depth explanation on the Tailwind configuration, and enjoy reading this website in the dark from here on!
