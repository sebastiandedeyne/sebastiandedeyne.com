---
date: 2018-11-30
title: Highlighting code blocks with league/commonmark
categories: ["articles"]
tags:
  - php
---

Since the first iteration of my blog—some time around 2016—I've used [highlight.js](https://highlightjs.org/) to highlight code blocks. With highlight.js being so popular, I never really second guessed the idea. It was a given to use JavaScript.

A few weeks ago, [TJ Miller](https://twitter.com/SIXLIV3) introduced me to [highlight.php](https://github.com/scrivo/highlight.php) by writing a [Parsedown extension](https://github.com/sixlive/parsedown-highlight) for it. Highlight.php does the exact same thing as highlight.js: they both add tags and classes to your `code` blocks, which enables them to be highlighted with CSS. The difference is, highlight.php does this on the server.

<!--more-->

There are two benefits of highlighting code blocks on the server:

- The highlight.js script weighs about 19KB min+gzip. This number fluctuates if you want to support more or less languages. Either way, it's significant enough to affect your website's load time.
- With JavaScript, code blocks are only highlighted after the entire page is loaded. This causes a flash of unstyled code blocks.

Whenever I need to convert markdown to HTML in PHP, I pull in [league/commonmark](https://github.com/thephpleague/commonmark). It parses markdown to an AST before rendering it to HTML which makes it easy to extend, and I did exactly that.

I created a [spatie/commonmark-highlighter](https://github.com/spatie/commonmark-highlighter) package that supports higlighting with CommonMark. After you [register two custom renderers](https://github.com/spatie/commonmark-highlighter#usage), all code blocks will receive a set of tags and classes, so they're already prepped to be highlighted by CSS when your content arrives in the browser.

```html
<!DOCTYPE html> <title>I'm highlighted!</title>
```

View the above snippet's source in your browser, and you'll see the highlighting has already been done!
