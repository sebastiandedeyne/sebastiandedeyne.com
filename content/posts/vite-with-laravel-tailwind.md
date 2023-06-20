---
date: 2021-03-22T06:02:00+01:00
title: "Vite with Laravel: Using Tailwind CSS"
slug: vite-with-laravel-tailwind
categories: ["articles"]
tags:
  - Laravel
  - Vite with Laravel
  - Frontend
  - Build tools
  - Tailwind
summary: |
  How to set up Tailwind CSS in Vite with Laravel.
---

Vite includes PostCSS support, so adding Tailwind doesn't require too much configuration.

First, install Tailwind and its peer dependencies `postcss` and `autoprefixer`.

```diff
  {
      "private": true,
      "scripts": {
          "dev": "vite",
          "production": "vite build"
      },
      "devDependencies": {
+         "autoprefixer": "^10.0.2",
          "axios": "^0.21",
          "lodash": "^4.17.19",
+         "postcss": "^8.1.10",
+         "tailwindcss": "^2.0.1",
          "vite": "^2.1.0",
          "vue": "^3.0.7"
      }
  }
```

Next, all you need is are `tailwind.config.js` and `postcss.config.js` files.

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

---

## Vite with Laravel

- [Up and running](/vite-with-laravel)
- [Auto-refresh Blade views](/vite-with-laravel-blade)
- Using Tailwind CSS
- [Using Vue.js](/vite-with-laravel-vue)
- [Using React](/vite-with-laravel-react)
- [Using TypeScript](/vite-with-laravel-typescript)
- [Using Inertia.js](/vite-with-laravel-inertia)
