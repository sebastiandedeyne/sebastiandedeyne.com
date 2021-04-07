---
date: 2021-03-22T06:03:00+01:00
title: "Vite with Laravel: Using Vue.js"
slug: vite-with-laravel/vue
categories: ["articles"]
series: vite-with-laravel
large_code_blocks: true
keywords:
  - Laravel
  - Vite
  - Frontend
  - Build tools
  - Vue
summary: |
  How to set up Vue.js in Vite with Laravel.
---

To transpile Vue single-file components, install [`@vitejs/plugin-vue`](https://github.com/vitejs/vite/tree/main/packages/plugin-vue) and its peer dependency [`@vue/compiler-sfc`](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc). If you are using Vue 2, install [`vite-plugin-vue2`](https://github.com/underfin/vite-plugin-vue2) instead.

```diff
  {
      "private": true,
      "scripts": {
          "dev": "vite",
          "production": "vite build"
      },
      "devDependencies": {
+         "@vue/compiler-sfc": "^3.0.6"
+         "@vitejs/plugin-vue": "^1.1.5",
          "axios": "^0.21",
          "lodash": "^4.17.19",
          "vite": "^2.1.0",
          "vue": "^3.0.7"
      }
  }
```

Next, we'll register the plugin in our Vite config.

```js {hl_lines=["2", "14"]}
// vite.config.js
import vue from '@vitejs/plugin-vue';

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
    plugins: [vue()],
});
```

Ready for takeoff!
