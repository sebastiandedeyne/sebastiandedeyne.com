---
date: 2021-03-22T06:00:00+01:00
title: Vite with Laravel
tags:
  - Laravel
  - Vite with Laravel
  - Frontend
  - Build tools
---

I've had an eye on Vite for a while. With a stable release out the door (2.0, as 1.0 never left the release candidate stage) it seemed like a good time to give it a shot.

Vite is a frontend build tool like webpack. Instead of bundling development assets, Vite serves native ES modules transpiled with [esbuild](https://esbuild.github.io) from the dev server. This means there's a lot less bundling to do, and results in a *very* fast developer experience. For production builds, Vite uses [Rollup](https://rollupjs.org/guide/en/) to bundle the assets.

<!--more-->

*If you want to delve deeper into Vite's background, check out [Why Vite](https://vitejs.dev/guide/why.html) in their docs. Now, let's dive into Laravel.*

After adding Vite to a JavaScript-heavy Laravel project we're working on, we saw:

- **Faster dev server startup** — `npm run hot` went from 15s to <1s
- **Faster production builds** — `npm run production` went from from 18s to 15s
- **A lot less config & dependencies** — Coming from Webpack (without Laravel Mix) the PR for Vite counts `+577 −3,367` lines
- **Additional develop experience improvements** — Auto-refresh when Blade files change

This post dives into a basic Vite setup for Laravel. There are also follow-up posts for Blade, Tailwind, Vue, React, TypeScript, and Inertia.

*Before getting started, consider not configuring this yourself. [innocenzi/laravel-vite](https://laravel-vite.netlify.app) is an off the shelf solution to add Vite to your Laravel application. If you prefer full ownership over your build tools (like me), or want to learn more about the inner workings, do carry on.*

## Installation

First, clean up Laravel's default `package.json` by getting rid of all Laravel Mix dependencies.

```diff
  {
      "private": true,
      "scripts": {
-         "dev": "npm run development",
-         "development": "mix",
-         "watch": "mix watch",
-         "watch-poll": "mix watch -- --watch-options-poll=1000",
-         "hot": "mix watch --hot",
-         "prod": "npm run production",
-         "production": "mix --production"
      },
      "devDependencies": {
          "axios": "^0.21",
-         "laravel-mix": "^6.0.6",
          "lodash": "^4.17.19",
-         "postcss": "^8.1.14"
      }
  }
```

Next, install Vite.

```bash
npm i vite --dev
```

Back in `package.json`, add the necessary scripts.

{{< aside >}}
Use `vite --https` instead of `vite` in the `dev` script if you're serving your local app over HTTPS.
{{< /aside >}}

```diff
  {
      "private": true,
      "scripts": {
+         "dev": "vite",
+         "production": "vite build"
      },
      "devDependencies": {
          "axios": "^0.21",
          "lodash": "^4.17.19",
          "vite": "^2.1.0"
      }
  }
```

## Vite configuration

Create a `vite.config.js` file in the project root. Here's the basic configuration for a Laravel app.

```js
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
});
```

`build.rollupOptions.input` should point to the main input of our app. **Important!** This should only be a script. Stylesheets should be imported from the script, otherwise they won't appear in `manifest.json`.

`build.manifest` generates a `manifest.json` file our Laravel app will read to discover the asset file names.

`build.outDir` determines where the final build will end up. In a Laravel app, this must be in the `public` directory. I recommend a subdirectory like `public/build` to make it easier to `.gitignore`.

Because we modified the `outDir`, we need to configure `base`. This ensures all of the path references in the files Vite generates will also point to `/build/`. On the development server (`command === 'serve'`), assets are served from `http://localhost:3000`. Because `outDir` isn't used on the development server, we shouldn't override `base`.

All files in `publicDir` get copied over to the `outDir` on build. This is how Vite [deals with static assets](https://vitejs.dev/guide/assets.html#the-public-directory) in a SPA. Since we already have Laravel's `public` directory, this isn't relevant to us. Unfortunately there's no way to disable this, so we'll provide a fake path so nothing gets copied.

Before moving on to the Laravel configuration, we need to make some changes to the default `app.js` file.

- As mentioned, CSS should be imported from JavaScript
- Replace all `require` statements with `import`, as Vite requires us to use ES modules
- Import Vite's dynamic import polyfill

```js
// resources/js/app.js
import 'vite/dynamic-import-polyfill';

import '../css/app.css';

import './bootstrap';
```

The `bootstrap.js` file also has some `requires` that need to be reworked.

```diff
+ import _ from 'lodash';
+ import axios from 'axios';
+
- window._ = require('lodash');
+ window._ = _;

  /**
   * We'll load the axios HTTP library which allows us to easily issue requests
   * to our Laravel back-end. This library automatically handles sending the
   * CSRF token as a header based on the value of the "XSRF" token cookie.
   */

- window.axios = require('axios');
+ window.axios = axios;

  window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  /**
   * Echo exposes an expressive API for subscribing to channels and listening
   * for events that are broadcast by Laravel. Echo and event broadcasting
   * allows your team to easily build robust real-time web applications.
   */

  // import Echo from 'laravel-echo';
+ // import Pusher from 'pusher-js';

- // window.Pusher = require('pusher-js');
+ // window.Pusher = Pusher;

  // window.Echo = new Echo({
  //     broadcaster: 'pusher',
  //     key: process.env.MIX_PUSHER_APP_KEY,
  //     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
  //     forceTLS: true
  // });
```

All configured!

If we run `npm run dev`, the dev server should start at `http://localhost:3000`. If we run `npm run production` a bundle should generate in `public/build`.

## Laravel configuration

With the build pipeline up and running, it's time to load the assets in the application.

First the dev server. When we run `npm run dev`, Vite spins up a dev server with hot module replacement enabled on `localhost:3000`.

To load our app, load Vite's runtime, then create a `module` `script` tag that points to our entry filename on `localhost:3000`.

{{< aside >}}
If you used the `--https` option in the previous steps, these scripts will be served from `https://localhost:3000/` instead.
{{< /aside >}}

```html
<script type="module" src="http://localhost:3000/@vite/client"></script>
<script type="module" src="http://localhost:3000/resources/js/app.js"></script>
```

When we run `npm run production` we need to find the exact asset path in the manifest, generated at `public/build/manifest.json`.

```json
{
  "resources/js/app.js": {
    "file": "assets/app.e8ed53e0.js",
    "src": "resources/js/app.js",
    "isEntry": true,
    "imports": [
      "_vendor.0c0b30aa.js"
    ],
    "css": [
      "assets/app.1ce589ef.css"
    ]
  },
  "_vendor.0c0b30aa.js": {
    "file": "assets/vendor.0c0b30aa.js"
  }
}
```

This requires a few more steps:

- Read the `manifest.json` file
- Extract the script location and render a `script` element
- Extract the stylesheet location and render a `link` element

```html
@php
    $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
@endphp
<script type="module" src="/build/{$manifest['resources/js/app.js']['file']}"></script>
<link rel="stylesheet" href="/build/{$manifest['resources/js/app.js']['css'][0]}">
```

Don't forget to prefix the path with the base path!

To ensure the right assets are loaded in every environment, combine the previous snippets with a `@production` directive.

```html
@production
    @php
        $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
    @endphp
    <script type="module" src="/build/{$manifest['resources/js/app.js']['file']}"></script>
    <link rel="stylesheet" href="/build/{$manifest['resources/js/app.js']['css'][0]}">
@else
    <script type="module" src="http://localhost:3000/@vite/client"></script>
    <script type="module" src="http://localhost:3000/resources/js/app.js"></script>
@endproduction
```

## Better DX for non-frontend developers

The above setup forces you to run `npm run dev` and watch on local. However, often backend developers working on the application don't need to watch the assets for changes.

Devs can run `npm run production` to generate assets once, but the application will still try to load assets from `locahost:3000`. The `production` check we have in place isn't enough.

To work around this, we can ping `localhost:3000`. If it connects, we know the dev server is running and we can render the hot scripts.

{{< aside >}}
This could go in a `helpers.php` file, learn how to set one up [here](https://laravel-news.com/creating-helpers).
{{< /aside >}}

First, let's extract the code we had written in our Blade template to a helper function. Next, we'll use Laravel `Http` facade to ping `localhost:3000`. If it connects, we know the dev server is running.

```php
<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\HtmlString;

function vite_assets(): HtmlString
{
    $devServerIsRunning = false;

    if (app()->environment('local')) {
        try {
            Http::get("http://localhost:3000");
            $devServerIsRunning = true;
        } catch (Exception) {
        }
    }

    if ($devServerIsRunning) {
        return new HtmlString(<<<HTML
            <script type="module" src="http://localhost:3000/@vite/client"></script>
            <script type="module" src="http://localhost:3000/resources/js/app.js"></script>
        HTML);
    }

    $manifest = json_decode(file_get_contents(
        public_path('build/manifest.json')
    ), true);

    return new HtmlString(<<<HTML
        <script type="module" src="/build/{$manifest['resources/js/app.js']['file']}"></script>
        <link rel="stylesheet" href="/build/{$manifest['resources/js/app.js']['css'][0]}">
    HTML);
}
```

Finally, echo the assets in our application's layout template.

```html
{{ vite_assets() }}
```

Ready to go! Vite is set up in our Laravel application. The next step is to add additional configuration based on the tooling we'll use.

---

## Vite with Laravel

- Up and running
- [Auto-refresh Blade views](/vite-with-laravel-blade)
- [Using Tailwind CSS](/vite-with-laravel-tailwind)
- [Using Vue.js](/vite-with-laravel-vue)
- [Using React](/vite-with-laravel-react)
- [Using TypeScript](/vite-with-laravel-typescript)
- [Using Inertia.js](/vite-with-laravel-inertia)
