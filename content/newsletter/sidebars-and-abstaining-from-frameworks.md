---
title: "Sidebars and abstaining from frameworks"
date: 2019-11-26
---

Hi!

I love blog sidebars. Besides being a place for useful content, they make room for quirky, personal features.

I finally took the time to add one to my blog. On the useful side it has a short "about" paragraph (for new visitors), a link to what I'm up to now, and secondary navigation (the header was getting crowded). As some fun extras I added a small blogroll which will I'll expand gradually, and a colophon.

Besides the sidebar, I added an archive/search page and a ["now" page](https://sebastiandedeyne.com/now/) inspired by [Derek Sivers](https://nownownow.com/about).

## Building Mailcoach: a brave new frameworkless world

Mailcoach started out as a standalone project. Being happy Inertia/React/TypeScript users at Spatie, we decided to use that stack to embark on our mail app adventure.

The project took a life of its own, and eventually pivoted towards a package to install in an existing Laravel app. In this context, our frontend-heavy stack came with a few caveats.

First, the Mailcoach interface needs to be extendable. An extendable JavaScript app is easier said than done. For whatever thing a user wants to change, add, or remove, they'd need to start (re)building assets. We could make this easier by adding hooks all over the place, but that would mean a huge amount of overhead.

Blade on the other hand, is easily extendable. All a user needs to do is publish whatever vendor view they want to override, and do their thing.

Secondly, while Inertia/React/TypeScript work great for us, we don't want to force it upon others. Blade is common ground.

The Mailcoach interface actually doesn't have too many dynamic needs, so "downgrading" the frontend stack to Blade wasn't too hard. We then sprinkled in some vanilla JavaScript where necessary, and dropped in Turbolinks for extra snappiness.

Going back to vanilla JS feels like a breath of fresh air. Small, simple scripts without any complex build needs. Frameworks like React and Vue shine in many contexts, but seeing how simple things _can_ be otherwise will make me think twice in future projects.

## Full Stack Europe recap

The inaugural edition of Full Stack Europe was a blast! I saw a lot of great talks, talked to some really cool people, and went home with a newfound source of inspiration.

I wrote a [small recap](https://sebastiandedeyne.com/full-stack-europe-2019-recap/) of the conference reviewing my favorite talks, but the post will only really get interesting when the videos are up.

I also gave two lightning talks at the conference, and poured them both into blogposts after.

- [Writing open source software, and staying sane while at it](https://sebastiandedeyne.com/writing-open-source-software-and-staying-sane-while-at-it/)
- [Prioritization systems](https://sebastiandedeyne.com/prioritization-systems/)

## More from the blog

Besides the Full Stack Europe related posts, I wrote about the tradeoffs of elegant code for the sake of it, and another Inertia post.

- [Shop-built jigs](https://sebastiandedeyne.com/shop-built-jigs/)
- [Handling authorization in a Laravel and Inertia application](https://sebastiandedeyne.com/handling-authorization-in-a-laravel-and-inertia-application/)

## On the horizon

A few things I'm planning to work on the coming weeks;

More writing! My vanilla JavaScript work on Mailcoach has inspired me to write about building utilities and components without a framework. I might make a series about it, or maybe just a few standalone posts, we'll see.

I also have a blog post ready about the JAMstack, and one in the making about strawberry jam and how it relates to programming (it doesn't relate to the JAMstack, having these in the same sentence is pure coincidence).

I generally try to send my newsletter around the last week of the month. With the holiday season coming up I'm not sure how it'll pan out. Either I'll send an early or delayed short edition, or skip next month altogether. It all depends on how much I have to say really.

Until the next issue,

Seb
