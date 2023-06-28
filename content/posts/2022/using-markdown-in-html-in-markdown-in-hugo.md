---
title: "Using markdown in HTML (in markdown) in Hugo"
slug: using-markdown-in-html-in-markdown-in-hugo
date: 2022-07-25
type: article
tags:
  - Hugo
summary: How to write HTML in Hugo without losing markdown capabilities.
---

The markdown specification allows you to inline HTML in a markdown document.

```md
This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.
```

But once you're in HTML, you can't write markdown anymore. If you'd want to italicize *Foo*, this won't work:

```md
<table>
    <tr>
        <td>*Foo*</td>
    </tr>
</table>
```

On my blog, I sometimes want to wrap a whole chunk of markdown in an HTML, like a `div` with a class name.

```md
<div class="highlight">
This is [markdown](https://daringfireball.net/projects/markdown/syntax#html).
</div>
```

The solution is a custom [shortcode](https://gohugo.io/content-management/shortcodes/), located in `layouts/shortcodes/markdown.html`.

```
{{ .Inner }}
```

The shortcode does nothing more than parse the inner contents as markdown. So I can happily switch back to markdown from HTML.

```md
<div class="highlight">
{{%/* markdown */%}}
This is [markdown](https://daringfireball.net/projects/markdown/syntax#html).
{{%/* /markdown */%}}
</div>
```

There might be a more idiomatic way to do this but I haven't come across any clues. If there is I'd love to know about it, but for now this works like a charm.
