---
date: 2021-03-29
title: "Vite with Laravel: Using Inertia.js"
slug: vite-with-laravel/inertia
categories: ["articles"]
series: vite-with-laravel
keywords:
  - Laravel
  - Vite
  - Frontend
  - Build tools
  - Inertia.js
summary: |
  How to set up Inertia.js in Vite with Laravel.
---

Time for the last—and my favorite—post in the Vite series: using [Inertia.js](https://inertiajs.com).

Inertia suggests two ways to resolve views in the docs: with `require` or with `import`. 

- `require` bundles all your pages in a single file, it's a Webpack-specific implementation 
- `import` code splits your pages to multiple chunks, and is part of ECMAScript

Because `import` is a standard, it's supported our of the box. One little catch compared to usign it with Webpack: with Vite, you _must_ specify the extension in the `import` template literal.

```js
resolveComponent: async (name) => {
    return (await import(`./Pages/${name}.vue`)).default;
},
```

This setup will code split and emit a JavaScript file per page in the final build.

## Without code splitting

If you'd rather bundle your pages in a single file (similar to using `require` with Webpack) you can use `import.meta.globEager` instead.

```js
resolveComponent: (name) => {
    const pages = import.meta.globEager(`./Pages/${name}.vue`);
    
    return pages[`./Pages/${name}.vue`].default;
},
```

## Advanced imports

`import.meta.globEager` and its sibling `import.meta.glob` are also useful for advanced import patterns, similar to Webpack `require.context`.

In one of our projects, we use the following structure:

```txt
resources/
  js/
    app/
      posts/
        components/
        views/
          Edit.vue
          Index.vue
          Show.vue
      profile/
        components/
        views/
          Edit.vue
          Show.vue
    app.js
```

In this case, we only want to bundle components in `views` folders as pages. Files in `components` aren't meant to be rendered by Inertia.

A setup like this can be bundled with a glob:

```js
resolveComponent: async (name) => {
    const pages = import.meta.glob('./app/**/views/*.vue');
    
    return (await pages[`${name}.vue`]()).default;
},
```

That concludes the Vite with Laravel series! If you have questions or requests for more posts, talk to me on [Twitter](https://twitter.com/sebdedeyne).

## Path aliases

