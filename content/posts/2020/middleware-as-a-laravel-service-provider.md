---
title: "Middleware as a Laravel service provider"
slug: middleware-as-a-laravel-service-provider
date: 2020-06-03
type: article
tags:
  - Laravel
description: How to clean up service providers in large Laravel apps with middleware
---

When you need to set up a service in a Laravel app, service providers are generally the place to be. But, there's one problem with service providers: they're global. This usually doesn't matter, but in multi-section apps this can be problematic.

<!--more-->

Consider the following: you want the default date format for your site to be `d/m/Y`, but the admin panel should display dates as `Y-m-d`. Chances are you'd write this in your `AppServiceProvider`:

```php
<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(Request $request)
    {
        if ($request->segment(1) === 'admin') {
            Carbon::setToStringFormat('Y-m-d');
        } else {
            Carbon::setToStringFormat('d/m/Y');
        }
    }
}
```

It's fine. It works. But something about that URL check feels icky to me. In essence, we're _doing something for a certain group of routes_. Sound familiar? We've got middleware for that!

Instead of dumping everything in providers, create two pieces of middleware. Where you store them or what you call them doesn't matter. To demonstrate, I created `App\Http\Middleware\BootstrapAdmin` and `App\Http\Middleware\BootstrapWeb`.

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Carbon;

class BootstrapAdmin
{
    public function handle($request, Closure $next)
    {
        Carbon::setToStringFormat('Y-m-d');
    }
}
```

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Carbon;

class BootstrapWeb
{
    public function handle($request, Closure $next)
    {
        Carbon::setToStringFormat('d/m/Y');
    }
}
```

You might prefer more granular `BootstrapCarbonForAdmin` and `BootstrapCarbonForWeb` classes. It's up to you how granular you want to organize your app.

Now we can apply these middleware classes to our routes.

```php
<?php

use App\Http\Middleware\BootstrapAdmin;
use App\Http\Middleware\BootstrapWeb;

Route::middleware(BootstrapWeb::class)
    ->group(function () {
        //
    });

Route::prefix('admin')
    ->middleware(BootstrapAdmin::class)
    ->group(function () {
        //
    });
```

I've been happily using this pattern in large projects. Other examples include registering [breadcrumbs and menus](https://github.com/spatie/laravel-navigation), or bootstrapping [Inertia](https://inertiajs.com/server-side-setup).
