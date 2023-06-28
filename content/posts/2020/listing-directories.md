---
date: 2020-03-18
title: Listing directories
tags:
  - CLI
  - Unix things I always forget
---

A listing of my favorite `ls` features.

<!--more-->

To know wich directory you're in now, use the `pwd` command. `pwd` stands for "print working directory".

```txt {hl_lines=["1"]}
> pwd
/Users/sebastiandedeyne/Sites/test
```

List the current directory, use the `ls` command. `ls` is short for "list".

```txt {hl_lines=["1"]}
> ls
README.md  assets     index.html
```

Include hidden files with `-a`.

```txt {hl_lines=["1"]}
> ls -a
.          ..         .git       README.md  assets     index.html
```

List everything in a single column with `-1`. This is useful when you want to copy/paste a directory.

```txt {hl_lines=["1"]}
> ls -1
README.md
assets
index.html
```

Add a trailing slash to directories with `-F`. Also can be useful for copy/pasting purposes.

```txt {hl_lines=["1"]}
> ls -1F
README.md
assets/
index.html
```
