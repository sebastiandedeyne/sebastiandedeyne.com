---
date: 2020-06-02
title: Zipping
type: article
tags:
  - CLI
  - Unix things I always forget
---

Zipping is easy. Remembering `zip`'s arguments is hard.

<!--more-->

Create a zip archive from multiple files:

```txt
zip package.zip README.md LICENSE index.js
```

Create a zip archive from a directory:

```txt
zip website.zip -r sebastiandedeyne-com
```

Unzip contents to a specified directory.

```txt
unzip website.zip -d sebastiandedeyne-com
```
