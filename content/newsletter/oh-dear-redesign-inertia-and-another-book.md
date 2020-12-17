---
title: "Oh Dear redesign, Inertia & another book"
date: 2020-12-17
---

Hi!

This month I've got updates on Oh Dear's redesigned dashboard, new Inertia features, our second book at Spatie, and some more tidbits.

## Oh Dear's new dashboard

I redesigned the main [Oh Dear](http://ohdear.app) dashboard. It had remained pretty much unchanged since Oh Dear was first released almost three years ago–time flies!

Here's the before…

![Screenshot of the Oh Dear dashboard before the redesign](/media/ohdear-dashboard-before.jpg)

…and the after!

![Screenshot of the redesigned Oh Dear dashboard](/media/ohdear-dashboard-after.jpg)

I wanted to make it calmer. The old version screams at you when everything is fine, and screams even louder when something is on fire. Too. Much. Screaming.

The new dashboard increases the contrast between fine and fire with colored dots instead of badges. Problems are still highlighted making to make them stand out.

I used CSS grid to make all the check columns have the same size while allowing the site name column to grow. Consistent column sizes for all checks makes the new design look a lot more tranquil.

## Inertia updates

We added a [lazy props](https://github.com/inertiajs/inertia-laravel/pull/175) feature to Inertia last month. Lazy props allow you to load a page without including all data. For example, if you need to populate a dropdown, you can defer loading the options until the user is going need it.

There are a lot of interesting issues open in the repository to turn Inertia into a more powerful tool to build SPA-like experiences with instant load times. My favorites are [local visits](https://github.com/inertiajs/inertia/issues/261) and  [inline visits](https://github.com/inertiajs/inertia/pull/315). Fun things ahead!

## Designing a second book

After [Laravel Beyond CRUD](https://sebastiandedeyne.com/newsletter/book-design-the-return-of-the-stack/#i-made-a-book), I designed another book: [Front Line PHP](https://front-line-php.com). This time I used InDesign instead of Affinity Publisher. After I lost a _lot_ of time in the last round when Publisher corrupted my file, I reconsidered InDesign. InDesign has more advanced features like better footnote management, and the possibility to export an EPUB file.

I shared [a short Twitter thread](https://twitter.com/sebdedeyne/status/1329766615324499968) with some design details.

PS: Use [this link](http://front-line-php.com?referrer=sebastiandedeyne) for a 20% discount on the book!

## 2020: The death of podcast listening

Overdramatic header, but true for me. Since I've been working from home, I haven't been making time to listen to podcasts. I used to keep up during my commute, but I haven't been able to fit them in my home schedule.

I miss Caleb and Daniel's banter on [No Plans to Merge](https://noplanstomerge.simplecast.com/). I haven't even had the chance to listen to [Full Stack Radio](https://fullstackradio.com)'s new format with Jack. And there are so many others to catch up on…

## 2021: The calm before the newsletter storm

If I were to bet one thing for 2021, it'd be that paid newsletters are going to go big. [Substack](https://substack.com) is becoming more popular by the day. Others including Ghost, Gumroad, and more are following suit with paid subscription features.

I'm seeing more and more quality, in-depth content land in my inbox instead of discovering everything through Twitter and RSS. I haven't come this in my "Laravel filter bubble" yet, but I wouldn't be surprised if newsletter-first starts getting traction there soon.

## More on the blog

Not much apparently! Since the last newsletter, I only published two posts and a link.

- [Masonry layouts with CSS grid](https://sebastiandedeyne.com/masonry-layout/)
- [When to add types and when to infer in TypeScript](https://sebastiandedeyne.com/when-to-add-types-and-when-to-infer-in-typescript/)
- [Local-first software](https://sebastiandedeyne.com/local-first-software/)

## Smalltalk

Being at home more often means more board games! I was looking for some fun games for lower player counts (2—3 players) so I [asked Twitter](https://twitter.com/sebdedeyne/status/1326807422959280129).

Guided by the responses I ended up buying [7 Wonders: Duel](https://boardgamegeek.com/boardgame/173346/7-wonders-duel), and [Wingspan](https://boardgamegeek.com/boardgame/266192/wingspan) (what a beautiful game!) Other games I've been enjoying are [Terra Mystica](https://boardgamegeek.com/boardgame/120677/terra-mystica), [Carcassonne](https://boardgamegeek.com/boardgame/822/carcassonne), [Kingdomino](https://boardgamegeek.com/boardgame/204583/kingdomino), and (as always) [Catan](https://boardgamegeek.com/boardgame/13/catan).

## On the horizon

What's next? Tough question. I'm really into things like [knowledge management](https://twitter.com/sebdedeyne/status/1339270210164051974), effective communication, and product management these days. I want to start sharing more about that, but haven't decided how or where yet. We'll see.

Until the next issue,

Seb
