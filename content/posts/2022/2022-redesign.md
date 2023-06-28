---
date: 2022-10-24
title: 2022 redesign
type: article
tags:
    - css
    - meta
---

This blog's design has remained roughly the same the past two years. I tweaked the style a lot, but changes were incremental and stay true to the neutral black and white style. Codebases rot over time, and small changes slowly but surely introduce technical debt. I started cleaning house, and before I knew it I was embarked in a full redesign.

<!--more-->

## Desk research & design inspiration

Before I design a website, I like to set up a primary goal to fall back to. For my blog, I went with *"minimal enough to not get bored of it, but with enough personality"*.

I've had designs with exotic typography or a bunch of flair. But after a few weeks, I tend to get bored of them and fall back to a minimal design. This time I wanted more than a neutral style. I wanted some elements that add personality to the site without overdoing it, without getting tired of them after a few weeks.

First I went through my bookmarks to dig up some inspiration. Here are some that stood out the most.

- [Elise Hein](https://elisehe.in/) — Love the typography here. I really like how some elements are pulled out of the single column layout. This turned out to be a big source of inspiration for this site's grid.
- [Rasmus](https://rsms.me/) — Great content structure, great typography, lovely colors. Completely different style than what I ended up with, but I love this design.
- [Robin Rendle](https://www.robinrendle.com/) — Interesting home page, and I like the split between "notes" and "essays". I didn't end up splitting mine up, but I might in the future.
- [Paco Coursey](https://paco.me/) — Perfect example of a minimal design. Clean, good typography, and a few elements to keep it interesting. However, a bit too minimal for my redesign goal.
- [Daring Fireball](https://daringfireball.net/) — I always liked the simplicity of Daring Fireball's content structure. Just one big stream of content, some links, some posts.
- [Dries Depoorter](https://driesdepoorter.be/) — Dries Depoorter is a digital artist. I recently saw him speak at Full Stack Europe, and he reignited a spark to be more creative in digital projects.

Now, on to design and implementation.

## Still Hugo

This site is built on Hugo, and I have no reason to change that. I adore Hugo. I'm still at awe of how fast it is, the entire site builds from source in 300ms. That includes parsing 100 markdown files to generate over 350 pages and concatenating and minifying the CSS. Hugo doesn't offer a lot of configuration and has no plugin system, which keeps me in check from overengineering things.

## New typography

Since text is the most important aspect of a blog, I started shopping for fonts. My final choices were Karla and Berkeley Mono.

- [Karla](https://www.typewolf.com/karla) — I've used Karla here in the past, it strikes a great balance between readability and character.
- [Berkeley Mono](https://berkeleygraphics.com/typefaces/berkeley-mono/) — A new discovery for me. What a lovely mono font! Works for both code snippets and a display font for titles.

## The chaotic neutral grid

On first sight, it's a typical sidebar + content layout. But there are few items that break out and make things interesting. [Code blocks](https://sebastiandedeyne.com/granular-interfaces/) expand from the start of the sidebar to the end of the page. [Blockquotes](https://sebastiandedeyne.com/leaner-feature-branches/) remain in line with the content, but run until the end of the page. [Images](https://sebastiandedeyne.com/uses/) take in as much space as possible.

This is all possible thanks to some fun with CSS grid. Named tracks make it easy to assign elements to columns.

```css
.grid {
  display: grid;
  grid-template-columns:
    [left-edge] minmax(calc(var(--spacing) * 2), 1fr)
    [sidebar-start] auto
    [sidebar-end content-start] minmax(20rem, 32rem)
    [content-end] minmax(calc(var(--spacing) * 2), 1fr)
    [right-edge];
  column-gap: calc(var(--spacing) * 3);
}

.grid > .sidebar {
  grid-column: sidebar-start / sidebar-end;
  grid-row: 1 / 999;
}
```

Posts and page content are wrapped in an `<article>` tag, so adding `display: contents` allows me to specify which grid tracks the underlying content should snap to.

```css
.grid > article {
  display: contents;
}

.grid > *,
.grid > article > * {
  grid-column: content-start / content-end;
}

.grid > article > pre {
  grid-column: sidebar-start / right-edge;
}

.grid > article > blockquote {
  grid-column: content-start / right-edge;
}

.grid > article > p:has(img) {
  grid-column: left-edge / right-edge;
}

.grid > .footer {
  grid-column: left-edge / right-edge;
}
```

I like the way the grid creates organized chaos with odd islands of whitespace like [here](https://sebastiandedeyne.com/self-deprecating-comments/).

The divider between the sidebar and the content also adds a randomness factor to the page. It stops running when it comes across a piece of breakout content. Sometimes it stops [after the sidebar](https://sebastiandedeyne.com/using-markdown-in-html-in-markdown-in-hugo/), sometimes it nearly reaches the [end of the page](https://sebastiandedeyne.com/the-monetization-trap/).

This is achieved with a large end value for `grid-row`. The day I have a post with more than 999 blocks, the line will stop. I could increase the number, but why fight its quirkiness?

```css
.grid > .sidebar {
  grid-column: sidebar-start / sidebar-end;
  grid-row: 1 / 999;
}
```

## 145 colors to my disposal

Limiting options is the best way to induce creativity. I challenged my self to only use named CSS colors. Browsers support 145 named colors, that's a complementary bag of 145  variables. My final color pallet consists of `blue`, `magenta`, `cyan`, `gray`, `gainsboro`, `black`, and `white`.

I also dug up the old `a:visited` selector which makes the site more colorful for some.

There's no dark mode support for now, but I'll most likely set that up later.

## Better syntax highlighting

I ditched Hugo's native highlighting engine in favor of [Torchlight](https://torchlight.dev/docs/clients/cli). I'll write a post on setting up Torchlight with a static site generator in the coming days.

The biggest tradeoff is build speed. Hugo is inhumanly fast (300ms, remember?). Adding a tool that relies on network request is going to slow things  down a lot. A full build takes about 16 seconds now, but the improved syntax highlighting is worth it. I only run Torchlight in production, so it doesn't slow down the writing and dev experience.

Besides highlighting, Torchlight has fun features like code collapsing. And I don't need to start every PHP snippet with a `<?php` tag anymore!

```php
class User
{ // [tl! collapse:start]
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
    ) {
    } // [tl! collapse:end]
}
```

---

Knowing myself, I'll be tweaking the design every know and then the coming months. I still want to restore dark mode, and maybe reintroduce webmentions (I used to have them, but got rid of them in my crusade for minimalism in the previous design). I hope the new design will be a good baseline for the next few months or years, only time will tell. But for now, time to get writing again.
