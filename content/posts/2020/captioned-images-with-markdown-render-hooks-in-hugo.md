---
title: "Caption images with markdown render hooks in Hugo"
slug: captioned-images-with-markdown-render-hooks-in-hugo
date: 2020-06-08
tags:
  - Hugo
---

I've been looking for a way to add captions to markdown images without falling back to raw HTML. It turns out Hugo supports this with render hooks.

<!--more-->

After writing markdown for the past five years, I've only recently learned that the spec has a way to specify a `title` attribute for images.

```markdown
![Alt text here](/images/image.jpg "Title here")
```

Which renders:

```html
<img src="..." alt="..." title="...">
```

Using the `alt` text would work too, but I prefer to keep the `alt` text objective, and use the `title` attribute for additional flavor.

For example, the alt text of the image below is "A picture of my dog sleeping with a ray of sun shining on his face", an objective description of the image. The caption adds more context.

![A picture of my dog sleeping with a ray of sun shining on his face](/media/dog-nap.jpg "My dog always looks for a ray of sun on the floor for his morning nap. Yes, morning naps are a thing if you sleep 20 hours a day.")

Hugo has a lesser-known feature called [markdown render hooks](https://gohugo.io/getting-started/configuration-markup#markdown-render-hooks). They're only available if you're using the Goldmark renderer, Goldmark has been the default for a while that's the default, so chances are you already are.

Markdown render hooks allow you to take full control of how an image, link or heading is rendered. We're only going to look into images now.

To override the generic image output, you can create a new template for your site's images. Hugo will look for an image template in `layouts/_default/_markup/render-image.html`.

The default template looks something like this:

```html
<img src="{{ .Destination | safeURL }}" alt="{{ .Text }}" {{ with .Title }} title="{{ . }}" {{ end }} />
```

It always includes `src` and `alt` attributes, and adds a `title` if one was specified.

For our captions, we'll extract the title, and wrap everything inside a `figure` tag.

```html
<figure>
  <img src="{{ .Destination | safeURL }}" alt="{{ .Text }}">
  <figcaption>{{ .Title }}</figcaption>
</figure>
```

The title tag will now be used as the `figcaption` instead.

If the image doesn't have a title, it doesn't really make sense to wrap it in a `figure` tag, so we'll add a check first.

```html
{{ if .Title }}
  <figure>
    <img src="{{ .Destination | safeURL }}" alt="{{ .Text }}">
    <figcaption>{{ .Title }}</figcaption>
  </figure>
{{ else }}
  <img src="{{ .Destination | safeURL }}" alt="{{ .Text }}">
{{ end }}
```

Our site now supports image captions!

Markdown render hooks are a powerful idea, you could also use them to ensure all images are wrapped in `p` tags, or to add an additional `class` to images, links or headings. I'll leave the possibilities to your imagination!
