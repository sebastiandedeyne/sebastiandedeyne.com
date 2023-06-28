---
title: "Resolving a new instance of a singleton in Laravel"
slug: new-instance-of-singleton-in-laravel
date: 2023-03-07
type: article
tags:
  - Laravel
---

In Laravel, you can register a class as a [singleton](https://laravel.com/docs/10.x/container#binding-a-singleton) to always resolve the same object.

However, you might want to build another instance of the class. You could manually construct the class without Laravel's container, but if it has a bunch of dependencies it can be tedious.

With the `build` method, Laravel won't resolve a registered instance of the class, but build a new one with the container.

```php
// AppServiceProvider::register()
$this->app->singleton(MastodonClient::class);
```

```php
// Resolve the singleton instance from the container
$mastodon = resolve(MastodonClient::class);

// Build a new instance
$anotherMastodon = app()->build(MastodonClient::class);
```

This can be useful when a Laravel package registers a class as a singleton but you need another instance.
