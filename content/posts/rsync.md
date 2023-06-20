---
date: 2020-07-15
title: Rsync
categories: ["articles"]
tags:
  - CLI
  - Unix things I always forget
---

Rsync is a command line tool to copy files between different hosts.

<!--more-->

```txt
rsync -a <source> <destination>
```

The `-a` flag ensures everything's copied recursively, ensures permissions are copied correctly, an other things.

Copy a directory from a remote server to your machine:

```txt
rsync -av forge@spatie.be:spatie.be/current/public/media/ public/media
```

By suffixing the source directory with `/`, its contets are placed inside the destination directory. Otherwhise you'd end up with `public/media/media`.
