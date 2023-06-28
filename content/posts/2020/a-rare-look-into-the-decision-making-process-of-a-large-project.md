---
title: "A rare look into the decision making process of a large project"
slug: a-rare-look-into-the-decision-making-process-of-a-large-project
date: 2020-09-28T08:00:00+02:00
tags:
  - cms
  - strategy
  - the web
---

Last week, the W3C decided they were [not going to use WordPress](https://w3c.studio24.net/updates/on-not-choosing-wordpress/) for their next website.

The decision making process behind this is happening in the open, on [w3c.studio24.net](https://w3c.studio24.net). Accessibility was the driving force for the final choice between three contending CMS's (WordPress, Craft, and Statamic), but they did a lot of research before.

<!--more-->

While digging through their notes, I came across a "CMS strategy and requirements" document. This document lists tradeoffs they need to take into account when building the new w3.org. It mentions requirements for CMS choice, accessibility, open source vs. commercial software, performance, and much more.

> It is clearly challenging to recommend a CMS platform that will definitely be around in 10 years. W3C has a “bias towards popular software systems with large user communities (e.g. WordPress, Drupal, Mediawiki) as opposed to smaller projects with only a handful of users.”
>
> The only truly stable format on the web is HTML, so one option would be to use a CMS that can output static HTML to be used on the W3C site. Static site generators tend to be newer software.
>
> Another option is to use a Headless CMS approach to decouple the CMS from the front-end and lower the impact of any possible CMS change in the future (this is covered in more detail later on).

On open source vs. commercial software:

> Platforms that have an open-source license to use freely, without commercial charge for the use of the software itself. Such platforms attract large, productive, and helpful communities and often have a reputation for proactive and effective security teams.
>
> Contrary to this, large open-source projects that have existed for many years can suffer from older architectures which are difficult to update or can slow down community development. Arguably, the same can be said of commercial software, it’s just less obvious since they don’t work in the open.
> Platforms with a charged license fee, either one-off, recurring or a combination of the two. Commercial CMS platforms range from large, expensive, enterprise CMS platforms to smaller, more agile commercial software.
>
> Commercial software rewards developers for building software which they can invest back in the software, whereas open-source software has to rely on commercial sponsors or the efforts of the community.
>
> Commercial software is also closed software, so it has less community and external peer-review. The common argument that open-source is inherently less secure is not valid, since community experts can peer review open-source code, something that is not possible with closed source code.

You can read the full document on [w3c.studio24.net](https://w3c.studio24.net/docs/cms-strategy-and-requirements/). I haven't dug through all notes yet, but have already come across other interesting articles including [Front end standards](https://w3c.studio24.net/docs/front-end-standards) and [Technical systems audit](https://w3c.studio24.net/docs/technical-systems-audit) too.
