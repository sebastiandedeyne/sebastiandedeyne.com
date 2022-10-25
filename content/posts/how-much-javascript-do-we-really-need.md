---
title: "How much JavaScript do we really need?"
date: 2019-09-22
categories: ["articles"]
tags:
    - the web
    - JavaScript
---

How much should we invest in JavaScript as developers? I've asked myself that question over and over again. Around last year I came to a conclusion: I strongly believe JavaScript is a requirement for excellent user experiences. Not good experiences, _excellent_ experiences.

<!--more-->

A (multi)select component, a date picker, conditional form fields, a location picker, an AJAX request to lazy load data,… These are just a few examples of component's I'm building daily. They all require a non-trivial amount of JavaScript.

That said, poor JavaScript implementation leads to a significantly worse user experience. Slow load times, broken browser behavior, and other quirks. It's a dangerous tool in the wrong hands. The cost to implement a rich user experience with JavaScript is high. Especially high if you're in a backend-heavy or full stack team.

Over the years I've experimented with different strategies to build user interfaces. From sprinkling JavaScript over server side templates to full-blown SPAs. My conclusion up until now: we can do better.

## Server rendered + vanilla JS

Sprinkling JavaScript over server rendered HTML fragments has its virtues. You can write plain JavaScript without too much transpiling and building, and you're not tied to a specific framework.

A major downside is that your UI code gets shattered across two disconnected environments: Markup and styling on the server, interaction on the client.

Not being tied to a framework also means you're on your own, which requires time and discipline to get right.

## Frontend frameworks

The component system in modern JavaScript frameworks provides many benefits for composability and encapsulation. Separating concerns between markup, style, and interaction may work great for documents, but I'm talking about apps today. I've yet to see a backend tool that treats components as first-class citizens over traditional layouts, blocks, and partials.

If you use a frontend framework mixed with server rendered HTML, you'll have the same problems as with using vanilla JS.

You can delegate _all_ markup reponsibility to the frontend framework, but then your server application's view layer just becomes a passthrough for data, and you'll soon start yearning for a single page application.

## Single page applications

With a SPA, all markup, styling, and interaction get pulled to the client. The server only needs to provide an API, so the user interface code isn't shattered anymore.

In in the right hands, a SPA will provide an incredible user experience, but it's very difficult and expensive to pull off.

There are meant valid use cases for building a SPA: consuming an API that’s already built for a mobile app, scalability, offline support,… But in my reality, these are all niche features.

SPAs require an immense amount of additional complexity, from browser history management to maintaining a full-blown API. Unless you need one of the niche SPA features, the pros rarely outweigh the cons.

## The silver bullet

I never expected a silver bullet, but I'm disappointed that none of the above even comes close, at least for the type of project's I'm working on.

I don't care whether I need to write less or more JavaScript. It's an implementation detail, I care about optimizing the way we build user interfaces. That's why I’m so excited about a new generation of tools born out of similar frustrations.

[LiveView](https://github.com/phoenixframework/phoenix_live_view) for Phoenix and [Livewire](https://laravel-livewire.com) for Laravel enable you to build interactive components on the server, without writing a single line of JavaScript.

On the other hand, [Inertia.js](https://inertiajs.com) enables you to use a frontend framework as your server framework's view layer, without the added complexity of a full-blown SPA.

Some of these tools pull you towards writing more code on the server, others towards more JavaScript. What they have in common is that they're trying to drastically lower the cost of creating an excellent user experience.

It's important to remember that the value of a tool is relative to the team using it. A SPA could be a viable solution for a team with a lot of frontend resources, while something like LiveView probably wouldn't be a good fit.

Keep in mind that is all coming from someone in a team that consists of primarily backend developers.

How are you or your team building user interfaces? Are you happy with your current stack? Which parts of it do and don't you like? Talk to me on [Twitter](https://twitter.com/sebdedeyne/status/1176038615937404928)!
