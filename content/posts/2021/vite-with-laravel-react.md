---
date: 2021-03-25T06:00:00+01:00
title: "Vite with Laravel: Using React"
slug: vite-with-laravel-react
tags:
  - Laravel
  - Vite with Laravel
  - Frontend
  - Build tools
  - React
summary: |
  How to set up React in Vite with Laravel.
---

Vite supports JSX out of the box (you might have to rename `.js` files to `.jsx`), so there are no additional steps to get started with React. However, you'll probably want to enable React Refresh for a better development experience.

React Refresh lets you edit components without losing the current state of your running application. For example, if you're working on modal that appears after clicking a button, you'd need to reopen that modal every time the page refreshes. With React Refresh, the modal will stay open after the code reloaded, because it's able to remember the previous state.

To enable React Refresh, install the `@vitejs/plugin-react-refresh` package.

```diff
  {
      "private": true,
      "scripts": {
          "dev": "vite",
          "production": "vite build"
      },
      "devDependencies": {
+         "@vitejs/plugin-react-refresh": "^1.3.1",
          "axios": "^0.21",
          "lodash": "^4.17.19",
          "vite": "^2.1.0",
      }
  }
```

Next, add it to your `vite.config.js`.

```js {hl_lines=["1, 14"]}
import reactRefresh from '@vitejs/plugin-react-refresh';

// vite.config.js
export default ({ command }) => ({
    base: command === 'serve' ? '' : '/build/',
    outDir: 'public/build',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    build: {
        manifest: true,
        rollupOptions: {
            input: 'resources/js/app.js',
        },
    },
    plugins: [reactRefresh()],
});
```

Finally, you'll need to add an extra script in your development snippet.

{{< aside >}}Check out [the first post in this series](https://sebastiandedeyne.com/vite-with-laravel/) for the full context.{{< /aside >}}

```php {hl_lines=["1-7"]}
<script type="module">
    import RefreshRuntime from "http://localhost:3000/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="http://localhost:3000/@vite/client"></script>
<script type="module" src="http://localhost:3000/resources/js/app.js"></script>
```

Happy hot reloading!

---

## Vite with Laravel

- [Up and running](/vite-with-laravel)
- [Auto-refresh Blade views](/vite-with-laravel-blade)
- [Using Tailwind CSS](/vite-with-laravel-tailwind)
- [Using Vue.js](/vite-with-laravel-vue)
- Using React
- [Using TypeScript](/vite-with-laravel-typescript)
- [Using Inertia.js](/vite-with-laravel-inertia)
