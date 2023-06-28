---
title: "Moment.js, thank you for your service"
slug: moment-js-thank-you-for-your-service
date: 2020-09-15
categories: ["articles"]
tags:
  - JavaScript
  - OSS
---

If you've dealt with dates in the browser, chances are you've used [Moment.js](https://momentjs.com). Moment has been _the_ date library for JavaScript in the past years. In a humble prelude of the documentation, the Moment maintainers talk about the (near) deprecated status of the project.

<!--more-->

> Moment was built for the previous era of the JavaScript ecosystem. The modern web looks much different these days. Moment has evolved somewhat over the years, but it has essentially the same design as it did when it was created in 2011. Given how many projects depend on it, we choose to prioritize stability over new features. […]
>
> Creating a "Moment v3" […] would be a tremendous undertaking and would make Moment a different library entirely. […]
>
> We now generally consider Moment to be a legacy project in maintenance mode. It is not dead, but it is indeed done.

Letting things go instead of creating a new major version is the right choice. Moment's usage is so widespread that it's impossible to deprecate the current version over time.

I like this document because it mentions the major issues Moment, it mentions why they're not worth solving, and it suggests a list of alternatives moving forward.

> - We will not be adding new features or capabilities.
> - We will not be changing Moment's API to be immutable.
> - We will not be addressing tree shaking or bundle size issues.
> - We will not be making any major changes (no version 3).
> - We may choose to not fix bugs or behavioral quirks, especially if they are long-standing known issues.

Moment.js, thank you for your service.
