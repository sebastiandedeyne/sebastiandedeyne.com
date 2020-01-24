---
title: "Thoughts (and doubts) after messing around with the JAMstack"
slug: thoughts-after-messing-around-with-the-jamstack
date: 2019-11-27
categories: ["articles"]
keywords:
  - the web
  - JAMstack
---

I very much enjoy building sites with static site generators like Hugo or Next.js. Static site generators provide a great developer experience, perform great out of the box, and simplifying DevOps makes me a happy camper.

In my experience, the [JAMstack](https://jamstack.org/) (JavaScript, APIs, and Markup) is great until is isn't. When the day comes that I need to add something dynamic–and that day always comes–I start scratching my head.

<!--more-->

If I want to store comments on my blog, where should I persist them? If a client wants to manage their content from a CMS, how do I even start setting up a static site? I suppose I need a fancy deployment pipeline?

Answers to this questions are probably obvious to JAMstack citizens. To someone used to building [majestic monoliths](https://m.signalvnoise.com/the-majestic-monolith/), the JAMstack is some sort of parallel universe.

There seem to be a new generation of API-first services like [StaticKit](https://statickit.com/), [CartQL](https://cartql.com/), and lower level ones like [Firebase](https://firebase.google.com/) and  [Fauna](https://fauna.com/) to accommodate these issues. Call me oldskool, but I often prefer to have some sort of ownership of the technology I'm using.

I could build my own backend to solve my dynamic dilemmas, but then why bother with a static site generator in the first place?

Andy Bell wrote a [love letter to the JAMstack](https://css-tricks.com/the-future-is-bright-because-the-future-is-static/) on CSS-Tricks which got me thinking.

> I love JAMstack because it empowers people like me, who aren’t very strong with back-end stuff, and the aspect of JAMstack that I like the most—and which I think is the best part—is static site generators (SSGs).
>
> […]
>
> The biggest reason that I like SSGs like Eleventy is that I can have a completely flexible, component-driven codebase that at build-time, compiles down to nothing but lovely, static HTML. You still get the power of JavaScript too, but instead of forcing it down the pipe, you run it at compile-time. This has enabled me to do some pretty darn complex stuff.

A value proposition I underestimated in the past is how JAMstack sites completely separate the front- and backend.

Building a WordPress site? The frontend team doesn't need any WordPress theming anymore. They can build the website of their dreams with their weapon of choice, and plug in an API.

Serverless, the JAMstack and single page applications are all interesting technologies that seem to be taking the world by storm. From my point of view, as a monolithic app developer, current solutions look so convoluted.

On the other hand I'm seeing developers being productive, and more importantly, happy with aforementioned technologies. Maybe I'm the one overthinking things?

One thing is sure: the more experienced I get, the harder it becomes to keep an objective point of view.
