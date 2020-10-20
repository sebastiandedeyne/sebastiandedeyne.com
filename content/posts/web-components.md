---
date: 2019-04-28
title: Web components
categories: ["articles"]
keywords:
    - web components
    - JavaScript
    - the web
---

Every now and then, web components hype seems to resurface. Judging by my Twitter feed, it's a bull market period now. Seems like a good time to share some thoughts.

<!--more-->

<figure>
    <img
        src="/media/web-components-over-time.jpg"
        alt="Screenshot of Chris Coyier's tweet about web components"
        class="bordered centered"
        width="400"
    />
    <figcaption>
        Web components over time by <a href="https://twitter.com/chriscoyier/status/1115659445382475776">Chris Coyier</a>
    </figcaption>
</figure>

<aside>
This isn't a web components tutorial, but a high level overview of what web components are and how I believe they'll affect the way we build things for the web. If you want to get started with web components, I've added some links to various resources at the end of this post.
</aside>

## What are web components?

Before we continue, let's make sure we're all talking about the same thing. Here's what [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components) has to say:

> Web Components is a suite of different technologies allowing you to create reusable custom elements — with their functionality encapsulated away from the rest of your code — and utilize them in your web apps.

When we're talking about web components, we're mostly taking about one or more of the following technologies: **custom elements**, **the shadow DOM** and **HTML templates**.

### Custom elements

Custom elements are HTML elements, like `<p>`, `<a>`, `<div>`, but custom made for your application.

If you're a developer, you probably see custom elements in the wild on a daily basis. GitHub uses them for the relative timestamps on repository pages.

<figure>
    <img
        src="/media/github-web-components.jpg"
        alt="Screenshot from GitHub.com"
        class="bordered"
    />
    <figcaption>
        GitHub uses <a href="https://github.com/github/time-elements">web components</a> for the relative timestamps on repository pages.
    </figcaption>
</figure>

This is a great use case. GitHub doesn't format timestamps on the server so they can provide better page caching.

> This allows the server to cache HTML fragments containing dates and lets the browser choose how to localize the displayed time according to the user's preferences.

In use, web components look just like regular HTML elements.

```html
<local-time datetime="2014-04-01T16:30:00-08:00">
  April 1, 2014 4:30pm
</local-time>
```

Custom elements are great because they allow you to use your browser and its built in API's to add composable and reusable bits to your application.

The custom elements API allows you to observe element attributes and react to changes accordingly. For example, when the `datetime` value of the `local-time` component changes, the time string will update too.

Note that custom elements don't have anything to do with templating. In the `local-time` example, the component's contents is updated with the DOM's built in imperative API. Here's a simplified example of the component's internals:

```js
class LocalTimeElement extends HTMLElement {
  static get observedAttributes() {
    return ['datetime'];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'datetime') {
      this.textContent = this.getFormattedDate();
    }
  }

  getFormattedDate() {
      // ...
  }
```

### Shadow DOM

The shadow DOM is a very special part of web components because it enables us to do something completely new.

The shadow DOM lets us define a "shadow root". Everything inside the shadow is not accessible from the outside document, and in turn won't be affected by it either. This means global document behaviour, like CSS, won't affect the custom element.

If you inspect an element that uses the shadow DOM, you won't immediately see the element's internal HTML, just the outer tag.

Here's another real life example you've definitely interacted with, stolen from a [CSS-Tricks post](https://css-tricks.com/playing-shadow-dom/) about the shadow DOM:

<img
    src="/media/tweet-as-shadow-dom.jpg"
    alt="Embedded tweet Shadow DOM example"
    class="bordered"
/>

Twitter's embedded tweets use web components if the browser supports them. If not, they fall back to an `iframe` element.

Using the shadow DOM makes sense for Twitter, because they can define their own styles and stay confident that the tweet's look and feel won't be affected be the HTML page embedding it.

### HTML Templates

Earlier I noted that custom elements have nothing to do with templating. However, if you want some sort of native templating option, you've got the `<template>` and `<slot>` tags.

The `<template>` tag defines a template in your HTML document to be used later. You can use `<slot>` tags in that template to fill in parts later on. Here's an example that brings custom elements, the shadow DOM and HTML templates together.

```html
<!-- Define a custom element in the document -->
<template id="red-text-template">
  <style>
    :root {
      color: red;
    }
  </style>
  <!-- The slot will be filled in later -->
  <slot name="contents"></slot>
</template>
```

```js
// Create a custom element
class RedText extends HTMLElement {
  constructor() {
    super();

    // Find the template in the current document
    const template = document.getElementById('red-text-template');
    const templateContent = template.content;

    // Create a shadow root
    this.attachShadow({ mode: 'open' })
        .appendChild(templateContent.cloneNode(true));
  }
}

// Define the custom element
customElements.define('red-text', RedText);
```

Now we can use our first web component!

```html
<red-text>
  <span slot="contents">My first web component!</span>
</red-text>
```

## Why and where web components are cool

Web components are a great addition to the web for several reasons:

- They're native, they use the platform, there's no need for a build step (besides for legacy browser support)
- You can extend existing element, for example if you need a `money-input`, you can extend the `input` element and beef it up with your custom behaviour
- There's finally a proper way to have scoped CSS

Web components are composable and shareable — they don't have any framework dependencies. They're great candidate for shareable component libraries, like accordeons, slideshows, modals, etc.

## Why I use a framework

I build applications with React and Vue. These frameworks enable me to solve hard problems because they're data-driven and have declarative rendering.

Being data-driven, I always have a single source of truth, which makes it manageable to reason about application state. There's not need to look up state in the DOM, state is the starting point.

```js
function Greeter() {
  const [name, setName] = useState('');

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      Hello, {name}!
    </>
  );
}
```

Being declarative, I don't need to worry about modifying state either. I don't need to imperatively show and hide items, or check and uncheck items. I declare what my component looks like in all possible states.

```js
function Toggle() {
  const [checked, setChecked] = useState(false);

  return (
    <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
    />
  );
}
```

If you're building an app that renders HTML on the server with some JavaScript sprinkles, web components are going to be a blast! If you're using a client-side framework, I don't think much will change, besides maybe using web components for some micro-interactions.

If you've learned about web components and think they could replace your current framework, maybe you should reconsider using a framework in the first place.

Nevertheless, I'm looking forward to creative solutions powered by web components! Are you already using web components? What for? Do you agree or disagree with my conclusion? I'd love to talk abou this more on [Twitter](https://twitter.com/sebdedeyne)!

## Links

As promised, some more literature and resources about web components:

- The post that inspired me to write this article: Danny Moerkerke wrote an [in-depth introduction](https://www.dannymoerkerke.com/blog/web-components-will-replace-your-frontend-framework) to web components, even though I don't agree with the title ;)
- CSS-Tricks also has [a recent series on web components](https://css-tricks.com/an-introduction-to-web-components/)
- [This tweet](https://twitter.com/bdc/status/1034466556506333184) from Benjamin De Cock is an interesting exploration in managing global application state with web components
- If you're looking for a templating solution for your custom elements, [lit-html](https://github.com/Polymer/lit-html) has your back
