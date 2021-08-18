---
title: "Migrating my site to Hugo"
date: 2019-06-19T18:17:47+02:00
categories: ["articles"]
keywords:
    - static sites
    - this website
---

This blog was a custom Laravel application for the past few years. While I was happy with the Laravel solution, I'm slowly trying to move away from maintaining my own servers. I'm also drawn to the simplicity and stability of serving plain html, so I decided to look into static site generators.

I quickly discovered that Hugo was what I was looking for. Hugo is a very fast and very popular static site generator.

<!--more-->

Hugo is written in Go. This was a main selling point for me because there's no need to install a whole set of `node_modules` or similar dependencies to run it. It's a single binary.

Hugo packs everything I need for a blog and website: post types, markdown support, custom pages and RSS are all available out of the box. It also has a large community backing and is very, _very_, fast — although that alone wouldn't be enough to win me over it's definitely nice to have.

On the downside, templates can be very hard to reason about, and the documentation isn't always as clear as it should be. Although the project is still under active development so I'm sure there will be improvements in the future.

I moved my hosting over to Netlify, which provides a generous free tier. Continuous deployment is available out of the box, so I don't have to worry about a deployment script anymore either.

As usual, I've open sourced this website. It's available on [GitHub](https://github.com/sebastiandedeyne/sebastiandedeyne.com), and is a lot leaner that the [previous Laravel iteration](https://github.com/sebastiandedeyne/v1.sebastiandedeyne.com).

Shoutout to [Sara Soueidan](https://www.sarasoueidan.com) for her in-depth [introduction to Hugo](https://www.sarasoueidan.com/blog/jekyll-ghpages-to-hugo-netlify/), which was a huge help in getting started!
