---
title: "Upgrading Node.js on a Laravel Forge Provisioned Server"
slug: upgrading-node-js-on-a-laravel-forge-provisioned-server
date: 2020-03-10
categories: ["articles"]
tags:
  - Laravel Forge
  - devops
---

I just upgraded Node.js on a Laravel Forge provisioned Ubuntu server for the umptieth time. I can never remember how to upgrade to a higher major Node.js version, so I'm documenting the process for future me.

<!--more-->

Node.js is installed through a debian repository on Forge. Upgrading with `apt-get` will upgrade to the latest minor or patch version, but won't upgrade to a higher major version.

```bash
sudo apt-get update && sudo apt-get upgrade
```

I wanted to upgrade from Node 6 to Node 8. To jump to a new major version, I modified a `nodesource.list` file.

```bash
sudo vi /etc/apt/sources.list.d/nodesource.list
```

The `nodesource.list` file looks like this:

```bash
deb https://deb.nodesource.com/node_6.x xenial main
deb-src https://deb.nodesource.com/node_6.x xenial main
```

To upgrade to a higher Node version, like version 12.x, modified the numbers to the following:

```bash
deb https://deb.nodesource.com/node_12.x xenial main
deb-src https://deb.nodesource.com/node_12.x xenial main
```

Next, run the usual `apt-get` upgrade commands:

```bash
sudo apt-get update && sudo apt-get upgrade
```

And done! You can run `node -v` to ensure you're on the latest version of Node.
