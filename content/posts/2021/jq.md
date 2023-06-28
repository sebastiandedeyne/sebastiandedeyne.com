---
title: "jq"
slug: jq
date: 2021-01-04
categories: ["articles"]
tags:
  - CLI
  - Unix
---

I rediscovered jq the other day, a little command line tool to format, read, and transform JSON from the command line.

Jq falls into one of my favorite categories of tools: the "simple and do one thing good" category—the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) at its finest.

<!--more-->

Pipe any JSON to `jq`. The first thing you'll notice is the added syntax highlighting.

![A curl request to the GitHub API](/media/jq-before.jpg)

![A curl request to the GitHub API piped through jq](/media/jq-highlight.jpg)

Then, you can use a path syntax to query the JSON object.

![Filtering a JSON object with jq's path syntax](/media/jq-path.jpg)

The path syntax supports arrays and deeply nested objects, and can even map data with a pipe operator.

![Transforming a JSON object with jq's path syntax](/media/jq-pipe.jpg)

Installing jq on a Mac is as easy as `brew install jq`. Read the [docs](https://stedolan.github.io/jq/) for further instructions and a detailed explanation of the path syntax.
