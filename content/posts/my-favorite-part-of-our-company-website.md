---
title: "My favorite part of our company website"
date: 2019-06-17T15:23:19+02:00
categories: ["articles"]
keywords:
    - the web
    - Spatie
---

Some time last year, we released the latest iteration of the [Spatie.be](https://spatie.be) website.

![Our company homepage, screenshot taken on 2019-06-17](/media/spatie-be-latest-insights.jpg)

There's a succinct description of what we're about, followed by a peculiar little block, dubbed "Latest insights from the team".

Unlike other agencies, we don't have a company blog. We encourage everyone to write on their own blog and put their latest articles in the spotlight.

Everyone keeps ownership of their content.

There's nothing fancy backing this feature, blog entries are synced via RSS. If you're interested in implementing something similar in PHP, our source code is available on [GitHub](https://github.com/spatie/spatie.be/blob/0b4f40e0121c064be057f04b2c30a263f33f0c6d/app/Console/Commands/ImportInsights.php).
