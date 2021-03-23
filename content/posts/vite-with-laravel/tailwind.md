---
date: 2021-03-22T06:02:00+01:00
title: "Vite with Laravel: Using Tailwind CSS"
slug: vite-with-laravel/tailwind
categories: ["articles"]
series: vite-with-laravel
large_code_blocks: true
keywords:
  - Laravel
  - Vite
  - Frontend
  - Build tools
  - Tailwind
summary: |
  How to set up Tailwind CSS in Vite with Laravel.
---

Vite includes PostCSS by default, so all you need to do is have a `tailwind.config.js` file, and reference the Tailwind plugin in `postcss.config.js`.

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

If you'd rather not have a separate configuration file, you can inline the PostCSS configuration in `vite.config.js`.

```js {hl_lines=["12-19"]}
// vite.config.js
export default ({ command }) => ({
    base: command === 'serve' ? '' : '/build/',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    build: {
        manifest: true,
        outDir: 'public/build',
        rollupOptions: {
            input: 'resources/js/app.js',
        },
    },
    css: {
            postCss: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                  },
            },
    },
  });
```
