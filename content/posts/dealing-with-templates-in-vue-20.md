---
date: 2016-12-21
title: Dealing with templates in Vue.js 2.0
subtitle: Written for Vue ^2.0
categories: ["articles"]
tags:
  - Vue.js
  - JavaScript
---

Vue 2.0 introduced it's own virtual DOM implementation. At first sight, this doesn't seem to have a large effect on the way you write templates.

<!--more-->

From the docs:

> Under the hood, Vue compiles the templates into Virtual DOM render functions. Combined with the reactivity system, Vue is able to intelligently figure out the minimal amount of components to re-render and apply the minimal amount of DOM manipulations when the app state changes.

The virtual DOM makes room for a pretty big piece of optimization: you can now precompile your templates to pure JavaScript, so Vue can skip this step in the browser.

Without precompiling templates in your build pipeline, Vue needs to translate the template string to a JavaScript render function at runtime. This means it takes longer for the initial render to appear on screen for two reasons: your script bundle needs to include Vue's compiler (longer load time), and the template needs to be compiled before it can be used (longer execution time).

This article isn't about Vue's template syntax, but about where and how to define your templates. I wrote this because at the time of writing there aren't really resources that consolidate all the different manners to manage your templates.

I've divided the different ways to define templates in three different categories, each with their own drawbacks:

- Writing templates that get compiled in the browser (lesser performance)
- Using single file `.vue` components (requires a build step)
- Manually writing `render` functions (pure JavaScript, no html-like template syntax)

## Using uncompiled templates

Vue templates don't necessarily need to be precompiled. If you're [using the standalone version of Vue.js](https://vuejs.org/v2/guide/installation.html#Standalone-vs-Runtime-only-Build), templates can be compiled in the browser. This solution offers simplicity—no special build steps or file formats—while sacrificing performance. The first render of a component will take longer because the template needs to be compiled to JavaScript first.

### Defining templates in a component

The simplest way to define a component's template is by defining it in the `template` option.

```js
// greeter.js

Vue.component("greeter", {
  template: "<div> Hello, {{ name }}!</div>",

  props: ["name"]
});
```

In JavaScript, strings aren't allowed to span over multiple lines. If you want to give your template some room to breath, you can use template literals.

```js
// greeter.js

Vue.component("greeter", {
  template: `
        <div>
            Hello, {{ name }}!
        </div>
    `,

  props: ["name"]
});
```

You could also define the template in a separate file if you're using a bundler like webpack or browserify. The template option can then be `require`'d in.

```js
// greeter.js

Vue.component("greeter", {
  template: require("./greeter.html"),

  props: ["name"]
});
```

```js
// greeter.html.js

module.exports = `
    <div>Hello, {{ name }}!</div>
`;
```

### Defining templates in an `x-template` script tag

An `x-template` is a script tag in your html that contains your template and gets referenced by the component.

```js
// greeter.js

Vue.component("greeter", {
  template: "#greeter",

  props: ["name"]
});
```

```html
<!-- index.html -->

<script type="text/x-template" id="greeter">
  <div>Hello, {{ name }}!</div>
</script>
```

This isn't really an interesting solution since it creates a pretty large gap between your templates and your components without providing any real benefit. (even the docs discourage you from using `x-template`)

[Docs &#8594;](https://vuejs.org/v2/guide/components.html#X-Templates)

### Using the `inline-template` attribute

With the special `inline-template` attribute, the template can be specified in the inner content of a component.

```js
// index.js

Vue.component("greeter", {
  props: ["name"]
});

new Vue({
  el: "#app"
});
```

```html
<!-- index.html -->

<div id="#app"><greeter inline-template> Hello, {{ name }}! </greeter></div>
```

This can be useful when you want to have your html immediately visible when it comes from the server, however, using inline templates is generally discouraged since it makes it harder to reason about your component's scope.

[Docs &#8594;](https://vuejs.org/v2/guide/components.html#Inline-Templates)

## Using single file components (`.vue` files)

Single file components already existed in Vue 1.0. In version 2, they provide a way larger benefit: the templates will be precompiled to pure JavaScript.

Vue files allow you to define your template and script in a single file that gets compiled to JavaScript via a webpack or browserify plugin.

```html
<!-- Greeter.vue -->

<template>
  <div>Hello, {{ name }}!</div>
</template>

<script>
  export default {
    props: ["name"]
  };
</script>
```

Single file components also open the door for more cool features like preprocessed html—which means you can write your templates in a language like Pug (formarly Jade)—or preprocessed scoped css.

```html
<!-- Greeter.vue -->

<template lang="pug">
div Hello, {{ name }}!
</template>

<script>
  export default {
    props: ["name"]
  };
</script>

<style lang="sass" scoped>
  div {
    text-decoration: blink;
  }
</style>
```

Note that since you're using a special file type, it becomes harder to add other tools to your project. For example, if you want to write tests or lint your components they'll need to be compiled first, and editors might have issues dealing with `.vue` files.

[Docs &#8594;](https://vuejs.org/v2/guide/single-file-components.html)

## Using render functions

### Writing raw render functions

Writing render functions is the bare metal programming of Vue templates. When using a different templating strategy (compilation in the browser or single-file components), string templates are compiled to render functions under the hood.

Writing your own render functions give you maximum performance without build step, the drawback being that they don't look like html making them harder to reason about.

```jsx
// greeter.jsx

Vue.component("greeter", {
  render(h) {
    return h("div", `Hello, ${this.name}!`);
  },

  props: ["name"]
});
```

[Docs &#8594;](https://vuejs.org/v2/guide/render-function.html)

### Writing render functions with JSX

Render functions can also be written in JSX using a Babel plugin, allowing a more html-like syntax.

```jsx
// greeter.jsx

Vue.component("greeter", {
  render(h) {
    return <div>Hello, {{ name }}!</div>;
  },

  props: ["name"]
});
```

Note that most built-in Vue directives aren't available using JSX, but they generally have their own programmatic equivalents. (for example, you'd replace `v-if` with an `if` or ternary statemnt in JavaScript)

[Docs &#8594;](https://vuejs.org/v2/guide/render-function.html#JSX)

## Conclusion

If you're building a larger, performance-critical application (generally SPA's) or are interested in features scoped css, Vue single-file components seem to be the way to go.

If you don't mind the initial performance penalty and are willing to use the standalone build (cases that simply enhance pages), I'd recommend using JavaScript template literals in the component's `template` option. This doesn't introduce any foreign concepts in your build pipeline, and keeps your template together with the component.
