---
date: 2021-03-25T06:01:00+01:00
title: "Vite with Laravel: Using TypeScript"
slug: vite-with-laravel-typescript
categories: ["articles"]
tags:
  - Laravel
  - Vite with Laravel
  - Frontend
  - Build tools
  - TypeScript
summary: |
  How to set up TypeScript in Vite with Laravel.
---

Vite transpiles TypeScript out of the box.

> Vite only performs transpilation on `.ts` files and does **NOT** perform type checking. It assumes type checking is taken care of by your IDE and build process.

If you like to see type errors in your terminal (like me), you'll need to add extra tooling. I solved this by running a parallel type check process with [concurrently](https://www.npmjs.com/package/concurrently).

First, add `concurrently` to your dependencies. Then update your `dev` script to run a TypeScript watcher in parallel with Vite.

```diff
  {
      "private": true,
      "scripts": {
+         "dev": "concurrently \"npm run vite --clearScreen false\" \"npm run tsc -w --preserveWatchOutput\"",
          "production": "vite build"
      },
      "devDependencies": {
          "axios": "^0.21",
+         "concurrently": "^6.0.0",
          "lodash": "^4.17.19",
          "vite": "^2.1.0",
      }
  }
```

Vite's `--clearScreen` and TypeScript's `--preserveWatchOutput` flags ensure that they don't both try to reset the terminal while watching, otherwise you'd only see one of the two's output at a time.

If you want to make the difference between the two processes more clear, `concurrently` supports naming and color-coding.

```txt
concurrently
    -n "vite,typescript"
    -c "white,green"
    "npm run vite --clearScreen false"
    "npm run tsc -w --preserveWatchOutput"
```

With these settings, your output will look like this:

![Screenshot of my terminal running Vite and TypeScript in parallel](/media/vite-typescript.png)

---

## Vite with Laravel

- [Up and running](/vite-with-laravel)
- [Auto-refresh Blade views](/vite-with-laravel-blade)
- [Using Tailwind CSS](/vite-with-laravel-tailwind)
- [Using Vue.js](/vite-with-laravel-vue)
- [Using React](/vite-with-laravel-react)
- Using TypeScript
- [Using Inertia.js](/vite-with-laravel-inertia)
