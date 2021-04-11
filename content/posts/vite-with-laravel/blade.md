---
date: 2021-03-22T06:01:00+01:00
title: "Vite with Laravel: Auto-refresh Blade views"
slug: vite-with-laravel/blade
categories: ["articles"]
series: vite-with-laravel
keywords:
  - Laravel
  - Vite
  - Frontend
  - Build tools
  - Blade
summary: |
  How to set up Tailwind CSS in Vite with Laravel.
---

We're up and running, but there's another Laravel-specific quality of life improvement we can make: auto-refreshing when a Blade file changes.

To do this, we'll write a simple Blade plugin right inside the Vite configuration.

*I didn't write this plugin myself, this is an except from [innocenzi/laravel-vite](https://github.com/innocenzi/laravel-vite/blob/72f7bbbc9ba9697205d9204bdee24f8e988ab9c7/npm/src/index.ts#L18-L33).*

The plugin listens to changes in `.blade.php` files, and does a full reload when they change.

```js {hl_lines=["12-24"]}
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
    plugins: [
        {
            name: 'blade',
            handleHotUpdate({ file, server }) {
                if (file.endsWith('.blade.php')) {
                    server.ws.send({
                        type: 'full-reload',
                        path: '*',
                    });
                }
            },
        }
    ],
});
```
