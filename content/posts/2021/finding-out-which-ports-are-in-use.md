---
title: Finding out which ports are in use
date: 2021-07-09
type: article
tags:
  - CLI
  - Unix things I always forget
---

Sometimes you want to spin up a process, but the port it wants to bind to is already in use. Or a port isn't listening to a process as you expected. `lsof` is a debugging life saver in these situations.

<!--more-->

```txt
lsof -i -P -n | grep LISTEN
```

This will list all processes listening to a port.

```txt
nginx      514 sebastiandedeyne    7u  IPv4 0x2718856ef232ee5b      0t0  TCP 127.0.0.1:80 (LISTEN)
nginx      514 sebastiandedeyne    8u  IPv4 0x2718856ef233026b      0t0  TCP 127.0.0.1:443 (LISTEN)
nginx      514 sebastiandedeyne    9u  IPv4 0x2718856ef2330c73      0t0  TCP 127.0.0.1:60 (LISTEN)
```

If you want to find a process on a specific port, you can chain another `grep`.

```txt
lsof -i -P -n | grep LISTEN | grep 80
```

```txt
nginx      514 sebastiandedeyne    7u  IPv4 0x2718856ef232ee5b      0t0  TCP 127.0.0.1:80 (LISTEN)
```
