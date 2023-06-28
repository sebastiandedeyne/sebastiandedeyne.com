---
title: "BlurHash"
slug: blurhash
date: 2020-10-19T06:00:00
link: https://github.com/woltapp/blurhash
tags:
  - design
  - images
  - libraries
---

Last week, Unsplash [added "blurhashes" to their API](https://twitter.com/lukechesser/status/1316767692620267520). Blurhashes are 20-30 character strings that represent a blurred placeholder of an image.

Blurred image placeholders aren't new, but I was completely stomped to see what kind of gradient maps are generated with only 30 characters.

> In short, BlurHash takes an image, and gives you a short string (only 20-30 characters!) that represents the placeholder for this image. You do this on the backend of your service, and store the string along with the image. When you send data to your client, you send both the URL to the image, and the BlurHash string. Your client then takes the string, and decodes it into an image that it shows while the real image is loading over the network. The string is short enough that it comfortably fits into whatever data format you use. For instance, it can easily be added as a field in a JSON object.

Unsplash uses the BlurHash algorithm to generate the placeholders. BlurHash is not a library but an algorithm, and they have 5 first party implementations including [TypeScript](https://github.com/woltapp/blurhash/tree/master/TypeScript). There's also a third party package for [PHP](https://github.com/kornrunner/php-blurhash).

> The algorithm is very simple - less than two hundred lines of code - and can easily be ported to your platform of choice.

Read more about BlurHash [on GitHub](https://github.com/woltapp/blurhash).
