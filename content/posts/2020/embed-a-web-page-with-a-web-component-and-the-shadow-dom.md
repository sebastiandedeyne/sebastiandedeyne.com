---
title: "Embed a web page with a web component and the shadow DOM"
slug: embed-a-web-page-with-a-web-component-and-the-shadow-dom
date: 2020-10-21T08:00:00+02:00
type: article
tags:
  - web components
  - JavaScript
  - vanilla JS
---

Today, my colleague [Freek](https://freek.dev) asked for help embedding the webview of an email campaign in an iframe. He needed it in an iframe because embedding the HTML directly caused layout issues because the website's CSS clashed with it.

After setting up the iframe, we needed to find a way to dynamically resize it based on its contents to avoid double scrollbars on the page. While possible, it required some icky scripting.

I took a step back. The problem at hand was that the CSS needed to be scoped somehow. While iframes were the only solution for a long time, these days we have the shadow DOM.

<!--more-->

If you need a basic explainer, I've written about web components [in the past](https://sebastiandedeyne.com/web-components). Part of the web component spec is the shadow DOM.

> The shadow DOM lets us define a "shadow root". Everything inside the shadow is not accessible from the outside document, and in turn won’t be affected by it either. This means global document behaviour, like CSS, won’t affect the custom element.

This is exactly what we need to embed external HTML with scoped styles. We're going to build an `embedded-webview` component with an `html` attribute that contains a full (escaped HTML) webpage.

```html
<embedded-webview
  html="&lt;html&lt;…&lt;/html&lt;"
></embedded-webview>
```

It turns out that the code that drives this component would fit in a single Tweet.

```js
class EmbeddedWebview extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.innerHTML = this.getAttribute('html');
  }
}

window.customElements.define(
  'embedded-webview',
  EmbeddedWebview
);
```

Lets pull this apart. First, we set up and define an `embedded-webview` element. A web component must always extend an implementation of the `HTMLElement` class.

Next, we implement `connectedCallback`. `connectedCallback` gets called whenever the element gets attached to the DOM.

Finally, we enable the shadow DOM with `attachShadow` and dump the HTML we want to embed in the shadow root.

For more shadow DOM shananigans, we could take this further and have it pull in an external HTML page with the `fetch` API.

```html
<embedded-webview src="https://…"></embedded-webview>
```

```js
class EmbeddedWebview extends HTMLElement {
  connectedCallback() {
    fetch(this.getAttribute('src'))
      .then(response => response.html())
      .then(html => {
        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.innerHTML = html;
      });
  }
}

window.customElements.define(
  'embedded-webview',
  EmbeddedWebview
);
```

While web components have their use cases, a lot of developers tend to have the notion that web components need to replace the entire framework ecosystem to be useful.

I still stand behind my conclusion from over a year ago that web components are not a replacement for tools like React and Vue. But every now and then I come across a case where a web component is the perfect fit. Today was one of those days.
