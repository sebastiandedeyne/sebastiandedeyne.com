---
title: "JavaScript, Livewire, and fresh designs"
date: 2019-09-24
---

Hi!

Here's what I've been up to the past few weeks featuring banter about JavaScript, using Livewire for the first time, and fresh designs for Oh Dear and Freek.dev.

## How much JavaScript do we really need?

I published a new post to gather my thoughts on the current state of JavaScript. Specifically, implementing JavaScript when you're using a more traditional server side framework.

In short: there's still no good solution to build interfaces without going full SPA; building a SPA is really hard; everything sucks. Luckily there are some cool outside-of-the-box-thinking tools coming up like LiveView, Livewire and Inertia to hopefully save the (my) day.

Read the full (and more eloquent) version [on my blog](https://sebastiandedeyne.com/how-much-javascript-do-we-really-need/).

## Livewire is awesome!

I finally had an excuse to play with [Livewire](https://livewire-framework.com)! Our Spatie site has an [open source section](https://spatie.be/open-source/packages) with a sortable and filterable overview of all our packages. This was the only part of the site that used Vue, so I decided to swap it with a Livewire component.

Livewire works great, although the first hour was a bit rough. It takes some mental gymnastics to get used to the idea of stateful components on the server, but once I got over that I was coasting.

The [PR for the change](https://github.com/spatie/spatie.be/pull/42) is publicly available on GitHub (more lines deleted than added, hooray)! Check out [our open source page](https://spatie.be/open-source/packages) to see the Livewire component in the wild!

## Playing with Elm and slaying with TypeScript + React

I woke up with the crazy idea to build an [Inertia](https://github.com/inertiajs/inertia) adapter for [Elm](https://elm-lang.org). Elm is a functional compiles-to-JavaScript language to build user interfaces. What really makes it interesting is that they guarantee zero runtime errors. Elm is generally used for SPAs, so I though it'd be a cool idea to open up a new road for Elm apps.

I can kind of read Elm, and I kind of understand it's architecture, but I didn't have any hands-on experience with it yet. All was going pretty well until I got to a point where the architecture really differs from what I'm used to in React or any other framework: state management. It started to go out of scope for a little weekend experiment, so I'm letting it rest for now.

Speaking of zero runtime errors, the TypeScript + React combo just keeps on impressing me. I needed to refactor a fairly large React component that was getting out of hand. I dove in, broke everything, started to plough through type errors, and surfaced to air five hours later. I reopened my browser and guess what? It was just how I left it! TypeScript make major refactors a joy. It's so good that it really makes me doubt whether Elm's worth it, unless you're looking for a pure functional language.

## Status pages for Oh Dear!

I designed and implemented the frontend for Oh Dear!’s new [status pages feature](https://ohdear.app/blog/introducing-status-pages-for-all-our-users). I was aiming for a clean and neutral design, and I'm pretty happy with the result. Check out a live one on [status.flareapp.io](https://status.flareapp.io).

I also wrote a [short post](https://sebastiandedeyne.com/live-updating-oh-dear-status-pages/) on how I implemented their live updates. I wanted to keep things simple by server side rendering with Blade, so I wrote a 20 LOC vanilla script to fetch fresh data every 30 seconds.

## Freek.dev newsletter

I gave Freek's blog a [fresh coat of paint](https://freek.dev/1367-a-new-coat-of-paint-for-freekdev) back in June. I promised him I'd style his newsletter too, but since coding HTML emails doesn't really fit my definition of fun, I knew it was gonna take a loooong time for me to beat procrastination.

Three months later, beat it I did! Freek's next issue will have a fresh style matching his blog. I used [Maizzle](https://maizzle.com) to build a static HTML file, which I sent over to Freek to make dynamic. I chose Maizzle because it allows me to use [Tailwind](https://tailwindcss.com), but unfortunately I still had to nest a gazillion tables to get the job done.

## On the horizon

A few things I'm planning to work on the coming few weeks;

I'm working on a post that does a high-level comparison between Inertia and Livewire. I've seen people struggling between deciding which would be a better fit, so I hope my post can help out with that decision. I also have a lot of practical Inertia post ideas, like dealing with routing and authorisation. Besides posts, I have a few quality of life improvement feature ideas for Inertia that I hope to experiment with soon.

On the Spatie front, I have two packages that are close to a 1.0 release: [laravel-mix-preload](https://github.com/spatie/laravel-mix-preload) and [laravel-export](https://github.com/spatie/laravel-export). I want to push out a stable release so I can finally scratch those from my todo list.

Until the next issue,

Seb
