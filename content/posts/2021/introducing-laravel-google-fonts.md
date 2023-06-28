---
title: "Introducing Laravel Google Fonts"
slug: introducing-laravel-google-fonts
date: 2021-06-23
type: article
tags:
  - Laravel
  - Web fonts
  - Performance
  - Privacy
---

Today, we're launching a new Spatie package: Laravel Google Fonts. I've [written about Google Fonts](https://sebastiandedeyne.com/self-hosting-google-fonts/) before. It's a great font catalog, but the service has it's downsides. First, fonts are hosted on a different domain than your app, so the browser needs to do an additional DNS lookup. Second, it's Google. Privacy-minded visitors might not appreciate the trip to Silicon Valley.

<!--more-->

Self-hosting fonts from Google Fonts isn't a new idea, but it's a tedious process. You need to download them, set up CSS, and keep them up to date over time. To make this process as smooth as possible, we created this package.

First, choose your fonts on [fonts.google.com](https://fonts.google.com) and grab the CSS URL.

```txt
https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Recursive:wght@400;700&display=swap
```

Next, install the package and publish the config file. Paste the CSS URL in the `default` font set.

```txt
composer require spatie/laravel-google-fonts
```

```php
// config/google-fonts.php

return [
    'fonts' => [
        'default' => 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;1,400;1,700&display=swap',
    ],
];
```

Finally, use the `@googlefonts` Blade directive in your layout file to load them.

```html
<!-- resources/views/layouts/app.blade.php -->

<head>
    @googlefonts
</head>
```

When someone visits the site, your app will fetch the font files from Google's servers, store them on a local disk, and serve them to the visitor. Once they're cached, they'll always be served from the local disk.

If you want to ensure the fonts are fetched before anyone visits your app, you can add this Artisan command to your deploy script:

```txt
php artisan google-fonts:fetch
```

For more examples and configuration options, head to the [GitHub repository](https://github.com/spatie/laravel-google-fonts).

This is the first package I've written in a looooong time, and I had a lot of fun working on it! Thanks to [Freek](https://freek.dev) for helping out with the final touches and getting everything prepped for release.
