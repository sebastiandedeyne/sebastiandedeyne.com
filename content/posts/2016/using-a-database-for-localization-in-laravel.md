---
date: 2016-05-31
title: Using a database for localization in Laravel
subtitle: Written for Laravel ^5.2
tags:
    - Laravel
    - PHP
    - localization
---

When building a website for a client that wants to be able to manage content, Laravel's language files aren't ideal since you can't edit them without diving into a bundle of text files. We recently decided to drop all the lang files in our custom CMS in favor of persisting translations in the database, which allows us to build a custom interface for managing them.

This post is a quick overview on overwriting Laravel's default translation loader, which means you can keep using the `lang` method while fetching the translations from a database. Writing a custom loader is easier than it sounds. First we'll set up our translation models, then we'll write our loader, and finally register it in our application.

<!--more-->

## The translation model

<aside>
There are a few good packages that handle translatable models, I'll be using our home grown <a href="https://github.com/spatie/laravel-translatable"><code>`spatie/laravel-translatable`</code></a> in this post.
</aside>

First off, we need to create a model that represents a fragment of text in our application. Let's call it `Fragment`. It'll need a migration and a model that implements `Spatie\Translatable\HasTranslations`. Our required fields are a `key`, which we'll use to identify the translation, and `text`, which will store the translations.

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFragmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fragments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('key');
            $table->text('text');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('fragments');
    }
}
```

In the model, we'll declare the `text` attribute as a translatable property.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Fragment extends Model
{
    use HasTranslations;

    protected $translatable = ['text'];
}
```

We're all set, time to add our first translation to the database:

```php
<?php

$fragment = new App\Models\Fragment();
$fragment->key = 'home.greeting';
$fragment->setTranslation('text', 'en', 'Hello world!');
$fragment->save();
```

## Writing our own translation loader

We're not going to write a loader from scratch, but instead extend Laravel's `FileLoader`. This will ensure we're maintaining compatibility with namespaced translations provided by packages.

First we'll check if there's a namespace in the `load` call, and if not we'll fall back to our `Fragment`. Laravel loads translations by group, which means if you'd call `trans('foo.bar.baz')`, the `foo` group would be loaded and `bar.baz` key would be fetched and returned.

In our case, that means we'd have to return a group of fragments in a certain locale. Let's hide that process in a `getGroup` method for now, and revisit it later. Lastly, let's cache the result since translations aren't that prone to change.

```php
<?php

namespace App\Services\Locale;

use App\Models\Fragment;
use Cache;
use Illuminate\Translation\FileLoader;

class TranslationLoader extends FileLoader
{
    /**
     * Load the messages for the given locale.
     *
     * @param string $locale
     * @param string $group
     * @param string $namespace
     *
     * @return array
     */
    public function load($locale, $group, $namespace = null)
    {
        if ($namespace !== null && $namespace !== '*') {
            return $this->loadNamespaced($locale, $group, $namespace);
        }

        return Cache::remember("locale.fragments.{$locale}.{$group}", 60,
            function () use ($group, $locale) {
                return Fragment::getGroup($group, $locale);
            });
    }
}
```

A translation group is an associative array with a `key => text` format. To create this group, we'll need to retrieve all relevant fragments with `like`, and extract their keys and texts. The key will have it's group in it too, we'll need to strip that with a regular expression.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\Translatable;

class Fragment extends Model
{
    use Translatable;

    protected $translatable = ['text'];

    public static function getGroup(string $group, string $locale): array
    {
        return static::query()->where('key', 'LIKE', "{$group}.%")->get()
            ->map(function (Fragment $fragment) use ($locale, $group) {

                $key = preg_replace("/{$group}\\./", '', $fragment->key, 1);
                $text = $fragment->translate('text', $locale);

                return compact('key', 'text');

            })
            ->pluck('text', 'key')
            ->toArray();
    }
}
```

<aside>
Alternatively you could store the <code>group</code> and <code>key</code> separately in the database for a simpler query.
</aside>

## Registering our custom loader

To change the source of our translated strings, we don't need to reimplement the entire translator, just the translation loader. In the base `TranslationServiceProvider` the loader registration happens in it's own method, so we can just extend that class and overwrite it. The method will look exactly the same as the one in the base provider, but the `TranslationLoader` is loaded from a different namespace.

```php
<?php

namespace App\Services\Locale;

use Illuminate\Translation\TranslationServiceProvider as ServiceProvider;

class TranslationServiceProvider extends ServiceProvider
{
    protected function registerLoader()
    {
        $this->app->singleton('translation.loader', function ($app) {
            return new TranslationLoader($app['files'], $app['path.lang']);
        });
    }
}
```

Lastly, we'll need to register the provider. In `config/app.php`, remove the original provider, and add our custom implementation to the `providers` array.

```php
<?php

return [
    // ...

    'providers' => [
        // ...

        // --Illuminate\Translation\TranslationServiceProvider::class,

        App\Services\Locale\TranslationServiceProvider::class,
    ],

    // ...
];
```

## Give it a spin!

That's it! We're now loading our translations from the database. Let's verify with a dummy route:

```php
<?php

Route::get('/', function () {
    return trans('home.greeting');
});

// => Hello world!
```

By storing translations in the database, we've built a foundation for a CRUD interface that allows clients to edit the application's content to their heart's content.
