---
title: "Self-hosting Google Fonts"
slug: self-hosting-google-fonts
date: 2021-04-15T08:26:07+02:00
categories: ["articles"]
keywords:
  - CSS
  - Web fonts
  - Performance
  - Privacy
---

I haven't used Google Fonts in production for a long time. I use the service for development, and strip out all references to Google before going live. I do this for performance, and my visitors' privacy.

<!--more-->

The current performance recommendation is to self-host web fonts to reduce DNS lookups. When self-hosting, you can also add `preload` links to make sure critical fonts are loaded as soon as possible. For more about this, read Simon Hearne's excellent essay on [avoiding layout shifts caused by web fonts](https://simonhearne.com/2021/layout-shifts-webfonts/#deliver-your-fonts-fast).

Google has a [vague privacy statement](https://complianz.io/google-fonts-and-gdpr-does-it-work/) surrounding Google Fonts. When it comes to collecting data, I'm rather safe than sorry with Google. More importantly, I don't want to impose this on my site's visitors.

To self-host, you need to download the fonts and write the appropriate `@font-face` CSS rules. Instead of doing this myself, I came across an excellent tool to streamline this process: [google-fonts-helper](https://google-webfonts-helper.herokuapp.com/fonts). It holds the entire Google Fonts catalog. You can find your font, choose your styles, and generate a CSS snippet and font files to add to your site.
