---
title: "Leading slashes in .gitignore"
slug: leading-slashes-in-gitignore
date: 2022-11-21
categories: ["articles"]
tags:
  - Git
---

This is a friendly reminder to keep leading slashes in mind in `.gitignore` files.

The other day, I pulled down a project and couldn't get the CSS to build because files were missing. It turned out another developer created a new `resources/css/vendor` directory to override styles for third-party components. A fine name, but `vendor` was ignored so they were quietly missing from the repository. We updated `.gitignore` to use `/vendor` instead and all was well.

``` {.short}
# Ignores all vendor files
vendor

# Only ignores vendor at the project root
/vendor
```
