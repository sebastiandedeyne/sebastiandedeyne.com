---
title: "Composable seeders in Laravel with callOnce"
slug: composable-laravel-seeders-with-callonce
date: 2022-02-22
categories: ["articles"]
keywords:
  - Laravel
---

Laravel 9 is fresh out the door, and it contains a small [contribution](https://github.com/laravel/framework/pull/39812) of mine: a new `callOnce` method for database seeders.

<!--more-->

It solves a problem with seeders I've had for a long time, and thanks to [@brendt_gd](http://twitter.com/brendt_gd) and [@rubenvanassche](https://twitter.com/rubenvanassche)'s input I was able to propose a lightweight solution. Here's a quick overview of the problems it solves, and how it's used.

Say you're working on a CMS-like project. There are users (than can log in and publish posts), posts, pages, and categories.

![](/media/seeders-call-once-1.png)

Your seeder would be ordered based on the relationships. Specifically, users and categories need to be seeded before pages and posts.

```php
class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            PageSeeder::class,
            PostSeeder::class,
        ]);
    }
}
```

In bigger projects with tens, or hundreds of models, a single `DatabaseSeeder` can get quite slow. And in any project: if you're planning to work on a new feature for posts, there's no reason to wait for pages to seed. But since `PostSeeder` expects users als categories to already exist, you can't run in on its own.

You could have `PostSeeder` seed its own users and categories, but then `DatabaseSeeder` is seeding a bunch of unnecessary data.

Enter `callOnce`, a new seeder method in Laravel 9. `callOnce` works similar to PHP's own `require_once`. It will only run a seeder the first time its called.

With `callOnce`, you specify depending data in the seeders you need them.

```php
class PostSeeder extends Seeder
{
    public function run()
    {
        $this->callOnce([
            UserSeeder::class,
            CategorySeeder::class,
        ]);
    }
}
```

```php
class PageSeeder extends Seeder
{
    public function run()
    {
        $this->callOnce([
            CategorySeeder::class,
        ]);
    }
}
```

Despite `PostSeeder` and `PageSeeder` both calling `CategorySeeder`, categories will only be seeded once. This allows you to declare all relationship dependencies inside the seeders, without worrying about seeding data multiple times.

I'm looking forward to be able to run seeders specifically for the feature I'm working on, especially in large projects.
