---
title: "Setting up a global .gitignore file"
slug: setting-up-a-global-gitignore-file
date: 2020-03-12
type: article
tags:
  - git
  - OSS
---

Reviewing pull requests, I often see contributors sneakily adding editor configuration to the repository's `.gitignore` file.

```diff
  composer.lock
  package.lock
+ .vscode
```

If everyone would commit their environment-specific `.gitignore` rules, we'd have a long list to maintain! My repository doesn't care about your editor configuration.

There's a better solution to this: a personal, global `.gitignore` file for all your repositories. Here's how you can set one up.

<!--more-->

## Global `.gitignore` 101

First, create a `.gitignore` file for your global rules. Most people keep this in their home directory.

```bash
touch ~/.gitignore
```

Next, open it with your text editor of choice and add whatever files and folders you *always* want to ignore. Here's what my global configuration looks like:

```bash
.DS_Store
.vscode
```

You'll probably have at least two entries in your global `.gitignore`: one for operating system-specific files, and one for editor-specific files.

I'm a Mac user, so I need to ignore `.DS_Store` files created by macOS. I use Visual Studio Code, so I need to ignore `.vscode` folders.

If I were a Windows user with PHPStorm as my primary editor, my `.gitignore` file would probably look like this:

```bash
Thumbs.db
.idea
```

Finally, configure `git` to use our newly created `~/.gitignore` file.

```bash
git config --global core.excludesfile ~/.gitignore
```

If you're a Windows user, you'll need to format the path differently.

```bash
git config --global core.excludesfile %USERPROFILE%\.gitignore
```

That's it, no more pesky editor configuration in your commits!
