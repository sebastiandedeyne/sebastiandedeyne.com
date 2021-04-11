---
title: "Things you didn't know you could diff in GitHub"
slug: things-you-didnt-know-you-could-diff-in-github
date: 2020-08-20
categories: ["articles"]
keywords:
  - Git
  - GitHub
---

If GitHub is your daily driver or you've contributed to open source at some point, you've probably seen the comparison screen before.

![Screenshot of GitHub's compare screen](/media/github-compare.jpg)

_"Compare and review just about anything"_

They're not lying. You can compare a _lot_ in there, but most of it isn't available in the UI. Here are a few tricks you probably didn't know about.

<!--more-->

## Comparing with a previous commit

```txt
https://github.com/spatie/laravel-medialibrary/compare/<hash>...master
```

<p><a href="https://github.com/spatie/laravel-medialibrary/compare/091a1c3...master" target="_blank" rel="noreferrer nofollow">Live example</a></p>

If you compare the current version of `master` with a previous commit, use the commit hash separated by three dots.

## Comparing commits

```txt
https://github.com/spatie/laravel-medialibrary/compare/<hash>..<hash>
```

<p><a href="https://github.com/spatie/laravel-medialibrary/compare/091a1c3..8447399" target="_blank" rel="noreferrer nofollow">Live example</a></p>

If you want to compare two arbitrary commits, use the commit hashes separated by _two_ dots.

## Time-based comparison

```txt
https://github.com/spatie/laravel-medialibrary/compare/master@{<date>}...master
```

<p><a href="https://github.com/spatie/laravel-medialibrary/compare/master@%7B2020-08-01%7D...master" target="_blank" rel="noreferrer nofollow">Live example</a></p>

You can also compare a branch to a specific point in time. The date can either be absolute (`master@{2020-08-01}...master`) or relative (`master@{10day}...master`).
