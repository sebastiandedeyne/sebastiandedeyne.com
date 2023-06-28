---
title: "Eager load relations in Laravel using withWhereHas"
slug: eager-load-relations-in-laravel-using-with-where-has
date: 2023-04-05T08:00:00+02:00
tags:
  - Laravel
---

When using `whereHas` in Laravel, it's not uncommon to also eager load the relation using `with`.

```php
$posts = Post::query()
    ->with('author')
    ->whereHas('author', function (Builder $query) {
        $query->where('name', 'Seb');
    })
    ->get();
```

Laravel also has a more succinct method that combines the two: `withWhereHas`.

```php
$posts = Post::query()
    ->withWhereHas('author', function (Builder $query) {
        $query->where('name', 'Seb');
    })
    ->get();
```
