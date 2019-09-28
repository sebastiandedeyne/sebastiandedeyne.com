---
date: 2017-02-21
title: Non-breaking, SEO friendly urls in Laravel
subtitle: Written for Laravel ^5.4
categories: ["articles"]
keywords:
  - Laravel
  - PHP
  - seo
---

When admins create or update a news item—or any other entity—in [our homegrown CMS](https://github.com/spatie/blender), a url slug is generated based on it's title. The downside here is that when the title changes, the old url would break. If we wouldn't regenerate the url on updates, edited titles would still have an old slug in the url, which isn't an ideal situation either.

Our solution: add a unique identifier to the url that will never change, while keeping the slug intact. This creates links that are both readable and unbreakable.

<!--more-->

Stack Overflow does this with it's question pages. Let's inspect the url structure:

```
http://stackoverflow.com/questions/<id>/<slug>
```

Note that when we visit `/questions/79923/foo-bar-baz`, we'd get redirected to `/questions/79923/what-and-where-are-the-stack-and-heap`.

Our gameplan:

- Determine our identifier
- Retrieve models via their identifier—ignoring the slug
- Redirect invariant urls

## Determining the Identifier

Assuming we're using a relational database like MySQL, the simplest form of an identifier is something we already have: the model's ID.

```md
https://thelaraveltimes.com/articles/24/laravel-5-4-new-features
```

An incrementing ID can expose a lot though. It makes it easy for someone or something to crawl through an entire dataset, and it provides an indication of it's size.

This doesn't matter for public data like blog posts, but we probably don't want any malicious crawlers scraping our user profiles. Phil Sturgeon has a nice writeup about the importance of obfuscated ID's [on his blog](https://phil.tech/http/2015/09/03/auto-incrementing-to-destruction/).

```md
https://laravelbuddies.com/user/12dj4om7/sebastiandedeyne
```

We'll use the model's ID for this article. If we'd want to obfuscate our ID's, we could either use a library to hash the existing ID like [Jens Segers' Optimus](https://github.com/jenssegers/optimus), or we could generate a random string when the model's created (in that case, don't forget to make ensure it's unique!).

We'll be working with a simple `Article` model, which has an `id` and `title` field. The article's slug will be a sluggified version of it's `title`, which we'll generate via an accessor.

Since the concept of an article maps to a single url, we'll also add a computed `url` attribute which returns an url to the article's detail page.

```php
<?php

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    public function getSlugAttribute(): string
    {
        return str_slug($this->title);
    }
}
```

## Setting up the Router and the Controller

So here's the url structure we want:

```
https://thelaraveltimes.com/articles/<id>/<slug>
```

As a Laravel route, that would translate to:

```php
<?php

Route::get('/article/{id}/{slug}', 'ArticleController@detail')
```

In our controller, we need the ID to retrieve the article item, the slug only exists to make the url human-readable (and in turn, SEO-friendlier).

```php
<?php

use App\Models\Article;

class ArticleController
{
    public function detail($id)
    {
        return view('article.detail')
            ->withArticle(Article::findOrFail($id));
    }
}
```

When generating a url, we **do** care about the slug though:

```php
<?php

action('ArticleController@detail', [$article->id, str_slug($article->title)]);
```

Since an article maps to a single url in this context, let's create a computed `url` attribute which returns an url to the article's detail page so we don't have to repeat the `action` call throughout the application.

```php
<?php

class Article extends Model
{
    // ...

    public function getUrlAttribute(): string
    {
        return action('ArticleController@detail', [$this->id, $this->slug]);
    }
}
```

Neat! Now we can link to our article using `$article->url`.

One more thing, since we don't care about the slug, we might as well make it optional.

```php
<?php

// routes/web.php

Route::get('/article/{id}/{slug?}', 'ArticleController@detail')
```

## Avoiding Duplicate Content

Links to your old pages won't break anymore, but having multiple urls pointing to the same piece of content isn't a good idea either since that creates duplicate content. To prevent this, old links should respond with a redirect to the correct url.

Let's revisit our controller's `detail` method. This time, we'll need to pull in the slug to find out if it represent's the latest revision of the article's title.

Since we're going to compare the request slug with the article slug, we'll need to inject the route segment in our controller. The slug segment is optional so we'll assign an empty string by default.

```php
<?php

use App\Models\Article;

class ArticleController
{
    public function detail($id, $slug = '')
    {
        $article = Article::findOrFail($id);

        // Magic slug validation stuff...

        return view('article.detail')
            ->withArticle($article);
    }
}
```

Validating the slug should be easy, all we need to do is a simple string comparison! If the article slug doesn't match the request slug, we'll redirect the visitor to the correct url.

```php
<?php

use App\Models\Article;

class ArticleController
{
    public function detail($id, $slug = '')
    {
        $article = Article::findOrFail($id);

        if ($slug !== $article->slug) {
            return redirect()->to($article->url);
        }

        return view('article.detail')
            ->withArticle($article);
    }
}
```

## An Alternative to Redirects: Canonical Links

If we wouldn't want an actual redirect—or if we don't want that pesky conditional logic in our controller—we could use a canonical `link` tag insteaddd.

Let's add a `link` tag in our layout file if we've explicitly provided one.

```html
<html>
  <head>
    {{-- ... --}} @if(isset($canonical))
    <link rel="canonical" href="{{ $canonical }}" />
    @endif
  </head>
  <body>
    @yield('content'))
  </body>
</html>
```

Then we don't have to handle redirects in our controller anymore, but we need to share the canonical link (which is the article's url) with the view.

```php
<?php

use App\Models\Article;

class ArticleController
{
    public function detail($id, $slug = '')
    {
        $article = Article::findOrFail($id);

        return view('article.detail')
            ->withArticle($article)
            ->withCanonical($article->url);
    }
}
```

## That's it!

We've achieved our two goals!

We can change the article's title without worrying about breaking old links and the urls have a human readable slug.

With different ways to achieve a similar setup, like storing slugs in the database, it's up to you to decide on the best fit for your application.
