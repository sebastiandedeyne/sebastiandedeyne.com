---
title: "Shop-built jigs"
date: 2019-11-21
categories: ["articles"]
tags:
  - programming
---

Back in the summer we were working on a new version of our [package documentation site](https://docs.spatie.be/) at Spatie.

Back then, all docs for all packages were stored as markdown files in a single `docs.spatie.be` repository. This made the website easy to maintain, but separating the docs from their code added unnecessary friction for contributors to also contribute to our docs when sending a PR.

We wanted to change things up and move the markdown files to their respective package repositories. This meant we had to come up with a way to aggregate files from multiple git repositories and serve them from a single website.

We ended up with an unsexy, procedural, 38 line [node script](https://github.com/spatie/docs.spatie.be/blob/3f533aead2e31ea0f8eb12f4c0a62e43bab1243f/fetch-content.js) to fetch all markdown files and copy them to a local folder. Then a simple static site generator does its thing and turn those markdown files into the website they were meant to become.

We could have built a custom web app, and the code would've been cleaner and have a pure architecture. Instead, we ended up with a script that fits on a 13" screen and a zero-config static site generator.

Don't be afraid to choose a crude, simple, shop-built jig over a complex solution just for the sake of purity.
