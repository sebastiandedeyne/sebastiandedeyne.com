---
title: "CSS states with attribute selectors"
slug: css-states-with-attribute-selectors
date: 2022-10-27
type: link
link: https://elisehe.in/2022/10/16/attribute-selectors
tags:
  - CSS
---

Elise Hein compiled a few arguments in favor of using CSS attribute selectors more often. Two examples stood our for me.

**Consider existing attributes.** Whenever we add state we should take a step back and consider if we can leverage a standard. I often add an `.is-active` class to links in navbars. However, there's an ARIA attribute for that. In addition to using a standard, our site becomes more accessible.

```css
a[aria-current="page"] { }
```

**Make invalid states impossible with data attributes.** In HTML, we could accidentally end up with a card that `.is-small.is-large`. Using a data attribute enforces a single value for the attribute.

```css
.card.is-small { }
.card.is-large { }

// vs

.card[data-size="small"] { }
.card[data-size="large"] { }
```

Read the full post on [Elise Hein's blog](https://elisehe.in/2022/10/16/attribute-selectors).
