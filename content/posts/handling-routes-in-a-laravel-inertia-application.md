---
title: "Handling routes in a Laravel and Inertia app"
slug: handling-routes-in-a-laravel-inertia-application
date: 2019-09-25
categories: ["articles"]
keywords:
    - Laravel
    - Inertia.js
---

If you're building an app with Laravel and Inertia, you don't have access to Laravel's helper methods because you're writing views in JavaScript. This means you lose the ability to generate URLs on the fly with Laravel's `route` and `action` helpers.

This short post outlines two ways to deal with routes in a Laravel and Inertia app.

<!--more-->

## Ziggy

The most popular way to solve this problem is with [Ziggy](https://github.com/tightenco/ziggy). Ziggy is a Laravel package that shares your application's routes with the frontend.

First [install Ziggy](https://github.com/tightenco/ziggy#installation), and add its `@routes` directive to your app template.

```txt
composer require tightenco/ziggy
```

```html
<!doctype html>
<html>
  <!-- … -->
  <body>
    @routes
    @inertia
  </body>
</html>
```

After setting up Ziggy with Vue (read up on that in [Ziggy's docs](https://github.com/tightenco/ziggy#using-with-vue-components)), you can access the `route` function in your components.

```html
<template>
  <InertiaLink :href="route('posts.index')">
    All posts
  </InertiaLink>
</template>
```

The `route` function also accepts parameters, just like Laravel's native `route` helper.

```html
<template>
  <InertiaLink :href="route('posts.show', { id: post.id })">
    {{ post.title }}
  </InertiaLink>
</template>
```

Ziggy depends on route names. If you rather not name all your routes and use the `action` helper, you'll need to resort to the next solution.

## In models or resources

Another way to share routes with your frontend is by passing them down as data in your models or Eloquent resources.

```php
<?php

namespace App;

use App\Http\Controllers\PostsController;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $appends = [
        'links',
    ];

    public function getLinksAttribute()
    {
        return [
            'show' => action(
                [PostsController::class, 'show'],
                $this->id
            ),
        ];
    }
}
```

A `links` property will be appended when the `Post` model gets serialized to JSON. You can then retrieve the URL from the post object in the frontend.

```html
<template>
  <InertiaLink :href="post.links.show">
    {{ post.title }}
  </InertiaLink>
</template>
```

Not all routes are tied to a model instance, for example an `index` view for all posts. Routes like this can be passed down globally with `Inertia::share`.

```php
<?php

namespace App\Providers;

use App\Http\Controllers\PostsController;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Inertia::share('links', function () {
            return [
                'posts' => [
                    'index' => action(
                        [PostsController::class, 'show'],
                        $this->id
                    ),
                ],
            ];
        });
    }
}
```

You can then access the global `links` object on the `$page` attribute.

```html
<template>
  <InertiaLink :href="$page.links.posts.index">
    All posts
  </InertiaLink>
</template>
```

If you don't want to clutter up your models, [Eloquent resources](https://laravel.com/docs/6.x/eloquent-resources) are a great place to declare links too.

```php
<?php

namespace App\Http\Resources;

use App\Http\Controllers\PostsController;
use Illuminate\Http\Resources\Json\JsonResource;

class Post extends JsonResource
{
    public function toArray($request)
    {
        return [
          //
          'links' => [
              'show' => action(
                  [PostsController::class, 'show'],
                  $this->id
              ),
          ],
        ]
    }
}
```

At [Spatie](https://spatie.be), we use resources for all data that gets passed down to views. We even created a [package](https://github.com/spatie/laravel-resource-links) to reduce boilerplate when declaring links on resources.
