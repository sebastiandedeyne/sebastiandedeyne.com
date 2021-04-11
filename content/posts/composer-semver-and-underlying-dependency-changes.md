---
title: "Composer, semver, and underlying dependency changes"
slug: composer-semver-and-underlying-dependency-changes
date: 2020-03-17
categories: ["articles"]
---

Every now and then I need to bump a dependency in a package, or require a higher PHP version.

```diff
  {
      "name": "my/package",
      "require": {
-         "php": ">=7.2.0",
+         "php": ">=7.4.0",
-         "league/commonmark": "^0.19",
+         "league/commonmark": "^1.0",
      }
  }
```

When updating an underlying dependency, I don't always tag a new major version. Some people consider this to be a breaking change, but it isn't. Here's how to deal with dependency and language updates from a package maintainer's perspective.

<!--more-->

## Do I need to increment my package's version when I require a new major version of one its dependencies?

No.

`my/package:1.0.0` required `league/commonmark:^0.19`, which got bumped to `league/commonmark:^1.0`. You may bump your package version to `my/package:1.0.1`.

If your package is installed in a project that requires `league/commonmark:^0.19`, composer will keep requiring `my/package:1.0.0` until `my/package:1.0.1` is compatible with your project. Nothing breaks, but the project won't receive new updates.

As long as the dependency update **doesn't affect your package's public API**, no major version bump is required.

From [semver.org](https://semver.org/#what-should-i-do-if-i-update-my-own-dependencies-without-changing-the-public-api):

> **What should I do if I update my own dependencies without changing the public API?**
>
> That would be considered compatible since it does not affect the public API. Software that explicitly depends on the same dependencies as your package should have their own dependency specifications and the author will notice any conflicts.

## Do I need to increment my package's major version when I update the language requirement?

No.

Your package, `my/package:1.0.0`, required `php:^7.2`, which got bumped to `php:^7.4`. You may bump your package version to `my/package:1.0.1`.

When you run `composer update` from a `php:^7.2` environment, it won't pull in packages that require `php:^7.4`. Composer will keep requiring `my/package:1.0.0` until `my/package:1.0.1` is compatible with your project. Nothing's broken, you just won't be receiving any new updates.

<aside>If your local PHP version differs from the version you're running in production, don't forget to <a href="https://andy-carter.com/blog/composer-php-platform" target="_blank" rel="nofollow noreferer">configure the <code>platform</code> setting</a>.</aside>

## Package version etiquette

Strictly speaking, a patch version bump like `1.0.0 -> 1.0.1` is enough when updating an underlying package or language dependency. However, it does mean users will be stuck on the older version. If an important bugfix comes along, those users will be stuck on an unpatched version.

For that reason, I prefer minor version bumps like `1.0.0 -> 1.1.0` instead. Increasing the minor version instead of the patch version doesn't do any harm, and if a critical patch comes along you can still backport it to `1.0.1` *and* `1.1.0` to serve more package users.
