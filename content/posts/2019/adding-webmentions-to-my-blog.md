---
title: "Adding webmentions to my blog"
date: 2019-06-27T22:39:56+02:00
type: article
tags:
    - the web
    - static sites
    - webmentions
    - this website
---

I first noticed webmentions in the wild on [Hidde de Vries' blog](https://hiddedevries.nl/en/blog/) about two years ago. Last week it finally happened, I added webmention support to my blog too! Well, partial support at least. I'm now receiving and displaying webmentions. Sending them out is a project for another day.

<!--more-->

## Whatmentions?

Webmentions.

> Webmention is a web standard for mentions and conversations across the web, a powerful building block that is used for a growing federated network of comments, likes, reposts, and other rich interactions across the decentralized social web.
>
> <cite><a href="https://indieweb.org/Webmention">indieweb.org</a></cite>

Webmentions are a protocol for websites to communicate across each other. What makes the webmention standard interesting is that it's not tied to a single service — it's a protocol. Webmentions can be aggregated from a range of different services from Twitter, to other blogs or even direct comments.

I highly recommend [Chris Aldrich's article](https://alistapart.com/article/webmentions-enabling-better-communication-on-the-internet/) on A List Apart if you want to dive deeper in the theory about the standards recommendation.

## Receiving webmentions

I'm mostly interested in receiving webmentions from Twitter since that's my main source of traffic.

Twitter doesn't send any webmentions themselves. Fortunately there's a service that solves this problem: [Bridgy](https://brid.gy/). Whenever a link to my blog is posted on Twitter, Bridgy polls for replies, retweets, and likes to send them as webmentions.

That's just half of the story: the mentions need to be received too. When a webmention is sent, the sender will scan for a specific `link` tag on the mentioned page.

```html
<link rel="webmention" href="...">
```

If it finds one, it will post the mention to the configured URL.

I set up my to receive webmentions on another third party service: [Webmention.io](https://webmention.io).

```html
<link rel="webmention" href="https://webmention.io/sebastiandedeyne.com/webmention" />
```

Webmention.io stores webmentions on their servers, so I can retrieve them to display on my blog. It also acts as a spam filter. Fake mentions from bots will be filtered out so they won't appear under my posts.

To summarize the flow:

- Someone tweets a link to one of my posts, or interacts with a tweet that contains a links to one of my posts
- Bridgy polls Twitter, and discovers the interaction
- Bridgy posts a webmention to my website
- The webmention is routed to Webmention.io and stored

## Displaying webmentions on post pages

Webmentions stored on Webmention.io can be retrieved with a simple API call. For example, to receive mentions for this post:

```txt
https://webmention.io/api/mentions.jf2?target=https://sebastiandedeyne.com/adding-webmentions-to-my-blog
```

I'm using the [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to grab the webmentions JSON, have a [rudimentary script](https://github.com/sebastiandedeyne/sebastiandedeyne.com/blob/f9c19f78e7a7b57562059a62154f0c9d9641267b/assets/js/webmentions.js) to render them beneath every post.

That's all there is to it! Most of the mentions I'm receiving are from Twitter, but anyone can add comments with a service like [comment parade](https://commentpara.de/) too. Try it out by mentioning this post!
