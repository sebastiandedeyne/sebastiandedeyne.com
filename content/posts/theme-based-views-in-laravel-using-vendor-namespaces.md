---
date: 2017-08-24
title: Theme-based views in Laravel using vendor namespaces
subtitle: Written for Laravel ^5.4
categories: ["articles"]
tags:
  - laravel
  - php
  - blade
---

I'm building a multi-tenant Laravel application. One of the requirements of the project is that every client can have their own theme based on their corporate guidelines. By default a few css adjustments will suffice, but some clients request a completely different template.

Conditionally loading a different stylesheet per client is pretty trivial, but in order to use a completely different view per theme you quickly end up typing the same thing over and over across various parts of your application.

<!--more-->

```php
namespace App\Http\Controllers;

use App\Client;

class HomeController
{
    public function __invoke(Client $client)
    {
        return view("themes.{$client->theme->name}.home", [
            'client' => $client,
        ]);
    }
}
```

<aside>
We're assuming the current "client" object gets resolved from the IoC container. It doesn't really matter where it comes from in the context of this article.
</aside>

Lets say we're dealing with a theme named `spatie`. Here's what our view looks like:

```html
@extends('themes.spatie.layouts.app') @section('main')
<p>Welcome to {{ $client->name }}'s site!</p>

@include('themes.spatie.partials.introduction') @endsection
```

A few things I don't like here. First off, passing `$client->theme->name` to every view name starts to get tedious very fast. In the views we can hard code the theme name since we're already in the theme, but it's too easy to introduce silent errors by requiring a different theme's view when copy-pasting across themes (which _will_ happen). Finally, all of this could become annoying to refactor if we decide to change our strategy regarding themes.

There aren't any _huge_ issues here, but alltogether it feels like we should be able to do better. There are a few strategies to clean this up, but I just want to talk about vendor namespaces today.

Laravel allows you register a view vendor namespace which points to a specific directory containing Blade files. This feature is intended for [package development](https://laravel.com/docs/master/packages#views), but it's a perfect solution to our problem.

By registering a namespace with the current theme's location, we can drop all the dynamic parts of our view names when we're calling them.

```php
class HomeController
{
    public function __invoke(Client $client)
    {
        return view('theme::home', [
            'client' => $client,
        ]);
    }
}
```

```html
@extends('theme::layouts.app') @section('main')
<p>Welcome to {{ $client->name }}'s site!</p>

@include('theme::partials.introduction') @endsection
```

Registering a vendor namespace is pretty straightforward. Create a service provider, and call the `loadViewsFrom` in the `boot` method. We'll need to pass a directory containing the views, and a name for our "vendor".

```php
namespace App\Providers;

use App\Client;

class ThemeServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot(Client $client)
    {
        $views = resource_path("views/themes/{$client->theme->name}");

        $this->loadViewsFrom($views, 'theme');
    }
}
```

Additionally, you could register a fallback path for the namespace, if you have a default theme for clients.

```php
$views = [
    resource_path("views/themes/{$client->theme->name}"),
    resource_path("views/themes/default"),
];

$this->loadViewsFrom($views, 'theme');
```

That's all we need to use our little `theme::` shortcut, with the added benefit that our the views don't need to worry about any implementation details of our theme setup!
