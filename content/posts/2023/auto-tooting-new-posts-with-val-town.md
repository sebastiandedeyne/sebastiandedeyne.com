---
title: "Auto-tooting new posts with val town"
slug: auto-tooting-new-posts-with-val-town
date: 2023-04-03T08:00:00+02:00
tags:
  - Mastodon
  - val town
---

Since this blog is a static site, I don't have a server running to do something dynamic when I publish a new post. I was about to set up Zapier or IFTTT to auto-toot blog posts to Mastodon, until I realized I finally had a use case to give [val.town](https://val.town) a shot.

With val town you can write lambda-ish functions in a GitHub gist-ish interface. Single functions are called "vals". The fun part is you can reference your own and other people's vals, which creates a network of atomic actions you can stack like Lego blocks. Vals can be scheduled so you can use them as background services.

First I created a generic [`postToMastodon`](https://www.val.town/sebdd.postToMastodon) val to toot a status on Mastodon. Then I created a [`tootLatestPosts`](https://www.val.town/sebdd.tootLatestPosts) val that combines it with an existing `@stevekrouse.newRssItems` val, which fetches RSS items from a feed.

Finally, I scheduled `tootLatestPosts` to run every hour. Now posts from this blog automatically appear on my [Mastodon profile](https://mastodon.social/@sebdd)!
