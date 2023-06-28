---
title: "My first experiment with Svelte: Shorthex"
slug: my-first-experiment-with-svelte-shorthex
date: 2023-03-21
type: article
tags:
  - Svelte
---

For the past few months, I've been experimenting with [Svelte](https://svelte.dev) & [SvelteKit](https://kit.svelte.dev). Svelte peaked my interest because it's a tool molded by the web. A lot of Svelte APIs piggyback on existing web affordances like plain HTML and CSS variables.

[Shorthex](https://shorthex.netlify.app) is a small app to transform 6-digit hex color codes to 3-digit codes. Here's a quick overview of the features of Svelte I enjoyed using.

<!--more-->

![A screenshot of Shorthex](/media/shorthex.png)

## HTML-first

Svelte is a breath of fresh air coming from a few years of digging deep in React, which puts JavaScript first. Svelte feels like a web-native citizen because a component starts with HTML. You can paste a blob of HTML and you have a working component. Need reactivity? Add a `<script>` tag. Need scoped CSS? Add a `<style>` tag.

A quick demo:

```svelte
<!-- Greeter.svelte -->

<script>
  // A prop
  export let name = '';

  // A reactive statement
  $: lowerCaseName = name.toLowerCase();
</script>

<!-- No need to wrap the template, plain HTML -->
<h1>hello {lowerCaseName}</h1>

<style>
  /* Scoped to the component */
  h1 {
    color: var(--color, black);
    font-family: 'Berkeley Mono';
  }
</style>
```

```svelte
<!-- Rendering a component,
     CSS variables can be passed down like props -->

<Greeter
  name="Sebastian"
  --color="red"
/>
```

## SvelteKit & progressive enhancement

SvelteKit is Svelte's full-stack framework similar to Next.js and Nuxt.js. It uses file-based routing and has server side rendering baked in. SvelteKit also has [great TypeScript support](https://svelte.dev/blog/zero-config-type-safety).

Thanks to SvelteKit's SSR capabilities, I was able to build Shorthex with progressive enhancement. Despite being built with a JavaScript framework, it doesn't require any JavaScript to run!

The main input is wrapped in a `<form>` tag, which when submitted does a `GET` request to reload the page with the selected color. When JavaScript is enabled, it prevents the `submit` event and rerendered with Svelte.

## First-party animation helpers

Svelte provides first-party animation helpers in `svelte/motion` and `svelte/easing`. These allow you to interpolate values and bind them to HTML. In Shorthex, I used them to tween values of an SVG path to add motion. Animating the SVG color blobs was also an interesting dive into bezier curves.

---

The code for Shorthex is public on [GitHub](https://github.com/sebastiandedeyne/shorthex), take a look!

Svelte left a great first impression, and I'm looking forward to more experiments.
