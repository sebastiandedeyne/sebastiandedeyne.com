---
title: "Comparing two database columns in Laravel"
slug: comparing-two-database-columns-in-laravel
date: 2023-04-19T08:00:00+02:00
type: article
tags:
  - Laravel
---

When you want to compare two database columns in Laravel, you can't use `where` because it treats the argument you're comparing to as a value.

Instead, Laravel has a `whereColumn` method you can use to compare a value to another column's value.

```php {.short}
// Retrieve posts that were updated after
// they were published.

Post::query()
    ->whereColumn('updated_at', '>', 'published_at')
    ->get();
```
