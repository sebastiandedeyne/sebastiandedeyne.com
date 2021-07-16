---
title: "Adding Backlinks to a GitHub wiki"
slug: adding-backlinks-to-a-github-wiki
date: 2021-07-16
categories: ["articles"]
keywords:
  - GitHub
  - Documentation
---

Backlinks, or bi-directional liks, are becoming table-stakes for productivity apps since they've been popularized by [Roam](https://roamresearch.com). It's a simple concept: when you create a link from page A to page B, page B will also reference page A. With traditional hyperlinks, page B wouldn't know about page A unless you explicitly link it back.

Backlinks allow a graph of knowledge to grow organically. When you create a doc for Orders, and mention Products, a Products page will be created or updated with a backlink. Even when not actively documenting Products, readers can get a high level idea of what they entail because of the linked references.

<!--more-->

For example, Orders might reference Products.

```md
Orders contain one or more [[Products]].
```

A system that supports backlinks would add a reference to the Products page.

```md
## Backlinks
- [[Orders]]
    - Orders contain one or more [[Products]].
```

Sometimes we use GitHub wiki for documentation. Documenting a large system can be difficult because there are a lot of interdependencies, and it's not always obvious where something belongs. This is a challange for the writer _(where does this go?)_ and for the reader _(where can I find this?)_.  Backlinks help out because they ensure something is mentioned in multiple places where relevant.

GitHub wikis are based on Markdown files. They're also a plain git repository that supports GitHub Actions, so you can automate tasks. [Andy Matuschak](https://andymatuschak.org) created [note-link-janitor](https://github.com/andymatuschak/note-link-janitor), a script that crawls files and adds backlinks to your Markdown notes. A [fork](https://github.com/sander/note-link-janitor) of the script is also available as a GitHub Action, which you can configure to run whenever your wiki is updated.

Note-link-janitor indexes all your wiki style links, and creates a References section on the bottom of each page with backlinks.

To enable note-link-janitor, create a workflow file.

```yml
# .github/workflows/note-link-janitor.yml

name: Note Link Janitor

on:
  gollum:
  workflow_dispatch:

jobs:
  update:
    runs-on: self-hosted

    steps:
      - uses: actions/checkout@v2
        with:
          repository: ${{github.repository}}.wiki
      - uses: sander/note-link-janitor@v5
```

This workflow will run whenever the wiki is updated (the `gollum` event), or when triggered manually (`workflow_dispatch`). Whenever you use wiki-style links in your documentation, the Action will push a commit with newly generated backlinks.
