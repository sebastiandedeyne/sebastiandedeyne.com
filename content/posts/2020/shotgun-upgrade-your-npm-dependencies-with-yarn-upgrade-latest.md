---
title: "Shotgun upgrade your npm dependencies with yarn upgrade --latest"
slug: shotgun-upgrade-your-npm-dependencies-with-yarn-upgrade-latest
date: 2020-04-27
type: article
tags:
  - npm
  - JavaScript
---

Every now and then I do a quick checkup of a project's npm dependencies. I like to keep them up to date by often doing small upgrades. It's a lot less painful than doing large upgrades once a year.

One annoying part of this process is ensuring every dependency is on the latest major version. For example, if a project requires `lint-staged@^8.0.0`, `yarn upgrade` won't upgrade it to `lint-staged@^9.0.0` (luckily of course, it's the behaviour I want during everyday development).

Today I learned about `yarn upgrade --latest`, which will upgrade all dependencies to the highest available version, despite the version constraints in your `package.json` file. `lint-staged@^8.0.0` would happily upgrade to `lint-staged@^9.0.0`, even if it breaks semver boundaries.

<!--more-->

This means yarn modifies your `package.json` file.

```diff
  {
    "devDependencies": {
-     "lint-staged": "^8.0.0"
+     "lint-staged": "^9.0.0"
    }
  }
```

Breaking changes will occur, so double check _everything_ before committing these changes!

You can also use `yarn upgrade-interactive --latest`, which provides an overview and lets you cherry pick available upgrades.

```text
? Choose which packages to update.
 dependencies
   name                         range   from      to     url
❯◉ @fullhuman/postcss-purgecss  latest  1.3.0  ❯  2.1.2  https://github.com/FullHuman/purgecss#readme
 ◯ tailwindcss                  latest  1.2.0  ❯  1.3.5  https://tailwindcss.com
 ```
