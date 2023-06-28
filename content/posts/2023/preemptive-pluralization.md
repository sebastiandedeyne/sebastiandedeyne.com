---
title: "Preemptive pluralization"
slug: preemptive-pluralization
date: 2023-03-07
categories: ["links"]
tags:
  - Programming
link: https://www.swyx.io/preemptive-pluralization
---

This one's permanently stored in my Pinboard — a conversation I had this morning triggered a re-read.

*"A user is only part of one team".* Until we decide to add multi-team support, and the `$user->team` `BelongsTo` relation suddenly needs to be replaced in 50 places.

Golden advice from [swyx](https://www.swyx.io/preemptive-pluralization):

> It is a LOT easier to scale code from a cardinality of 2 to 3 than it is to refactor from a cardinality of 1 to 2.
