---
title: "File watching with chokidar"
slug: file-watching-with-chokidar
date: 2021-04-16
categories: ["articles"]
tags:
  - Tools
---

File watchers are powerful tools. We take them for granted because they're often baked in, like Webpack rebuilding when you save a file.

Sometimes I'm in an environment without auto-reloading to my disposal. Yesterday, I was working on a CLI tool. The workflow was modify code, save changes, switch to terminal, run the tool, and look at the output. It's not _that_ bad, but I'd prefer a shorter feedback loop.

<!--more-->

This is where a file watcher gives you superpowers. I went with [chokidar](https://github.com/paulmillr/chokidar) because it has the friendliest API.

First, install `chokidar-cli`:

```txt
npm i chokidar-cli -g
```

Then you can watch the files you're working on, and run a command when they change.

```txt
chokidar "src/**/*.php" -c "php ./build.php"
```

When a PHP file changes in `src`, the build command will run. If I keep iTerm (and [Ray](https://myray.app)) open alongside my editor, I'll have immediate feedback for my changes. This is also a great way to automatically run tests for immediate feedback.

```txt
chokidar \
  "src/**/*.php" "tests/**/*.php" \
  -c "phpunit --filter test_i_am_working_on"
```

I like having a file watcher handy, it's one of those Swiss Army knife developer tools that came come in useful in many scenarios.
