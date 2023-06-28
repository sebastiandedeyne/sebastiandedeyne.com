---
title: "How to do a case sensitive file rename in git on macOS"
slug: how-to-do-a-case-sensitive-file-rename-in-git-on-macos
date: 2021-03-11
tags:
  - Git
---

Mac is case insensitive, Linux isn't. This has caused me trouble in the past after deploying my code to an Ubuntu server.

If you rename a file on Mac, git won't pick up any changes if you only change the case.

<!--more-->

```bash
mv app.js App.js
```

macOS displays the newly-cased filename, but git doesn't see any changes.

In the past I've worked around this by doing two commits: one to change it to a different filename entirely, and then another to what it should be. `app.js` → `appp.js` → `App.js` 🤦‍♂️

Turns out there's an easier way: `git mv`. If you use the `git mv` command to rename the file, git picks it up correctly.

```bash
git mv app.js App.js
```

That's it. Happy committing!
