---
title: "PHP wishlist: The pipe operator"
slug: php-wishlist-pipe-operator
date: 2023-02-16
categories: ["articles"]
tags:
  - PHP
  - PHP Wishlist
---

Is it weird to have a favorite operator? Well, the pipe operator `|>` is mine. Not only does it look cool, it opens a world of possibilities for better code.

Unfortunately, it's not available in any of the languages I use on a daily basis. There are proposals to add it to PHP and JavaScript, but we're not there yet. I'd like to expand on why I think the pipe operator would be a valuable addition to the language from a PHP developer's perspective.

<!--more-->

---

The pipe operator takes a value from the left side, and passes it as the input for a function on the right side.

```php
// This is the same as `sum(1, 2)`
1 |> sum(2);
```

Adding the pipe operator to PHP isn't a new idea. Sister language [Hack](https://docs.hhvm.com/hack/expressions-and-operators/pipe) has always had the pipe operator.

Hack's pipe operator is more verbose as it requires a `$$` token to indicate which parameter the output should be passed to.

```php
'Hello, world!'
|> strtolower($$)
|> substr($$, 0, -1)
|> str_replace(',', '', $$)

// 'hello world'
```

PHP's standard library wasn't built with the pipe operator in mind. Functions like `str_replace($find, $replace, $subject)` or `array_map($callback, $subject)` aren't a good match because the subject isn't the first argument. Hack uses a token to have them play well with the pipe operator.

I prefer a more succinct approach without the token. With short closures in PHP 8, I don't think the token isn't as needed anymore as we can wrap functions with an incompatible signature.

```php
'Hello, world!'
|> strtolower(...)
|> substr(0, -1)
|> fn ($greeting) => str_replace(',', '', $greeting)

// 'hello world'
```

## No more wrappers

I love Laravel collections, but I prefer the pipe operator. Take this chain of operations using a collection:

```php
$users = Users::all()
    ->map(fn (User $user) => …)
    ->filter(fn (User $user) => …)
    ->take(5)
    ->toArray();
```

With the pipe operator, `User:all()` could return an array and work with a set of array functions.

```php
// (This doesn't exist, just an example)
use Illuminate\Support\Collection\{map, filter, take};

$users = Users::all()
|> map(fn (User $user) => …)
|> filter(fn (User $user) => …)
|> take(5);
```

The chain starts with an array and ends with an array. No need to start with a collection object, and cast it back to an array after. We can keep using the primitive, more portable datatype.

Another benefit is we don't need macros anymore.

```php
Collection::macro('foo', fn (Collection $collection) => …);
```

We can mix and match third party methods with our own.

```php
use App\Support\Collection\{foo}
use Illuminate\Support\Collection\{map, take};

$users = Users::all()
|> map(…)
|> foo(…)
|> take(…);
```

This is true for any class that wraps or extends a primitive object. Laravel recently added a `Str` class similar to `Collection`. With the pipe operator, we don't need an additional class to do fluent operations on strings. Many projects also use a custom `DateTime` implementation like `Carbon` or `Chronos`. All would be moot if we can define our own functions that we can pipe a `DateTime` object into.

```php
Carbon::now()->isFuture();

// vs.

DateTime::now()
|> isFuture();
```

With the pipe operator, we get the ergonomics of boxed objects, without the overhead of wrapping & unwrapping them.

## The deeper effect on your codebase

While the above examples illustrate the ergonomics of the pipe operator, it also has a deeper effect on your codebase. It promotes decoupling data from processes.

For example, we're building a webshop that sells paper. We've got a `Paper` model, and a custom collection class to filter down a collection of `Paper`.

We want a unique array of colors available for letter-sized paper that costs between €5 and €10.

```php
$paperCollection
    ->withPriceBetween(5_00, 10_00)
    ->withSize(PaperSize::Letter))
    ->colors()
    ->toArray();
```

The collection class:

```php
class PaperCollection extends Collection
{
    public function withSize(PaperSize $size): self
    {
        return $this
            ->filter(fn (Paper $paper) => $paper->size === $size);
    }

    public function withPriceBetween(int $min, int $max): self
    {
        return $this
            ->filter(fn (Paper $paper) => $paper->price >= $min && $paper->price < $max);
    }

    public function colors(): Collection
    {
        return $this
            ->map(fn (Paper $paper) => $paper->color)
            ->uniq();
    }
}
```

But the webshop doesn't only sell paper, it also sells pens. Now we want a unique array of colors available for ballpoint pens cost between €5 and €10. We'll create a `Pen` and `PenCollection`.

```php
$penCollection
    ->withPriceBetween(5_00, 10_00)
    ->withType(PenType::Ballpoint))
    ->colors()
    ->toArray();
```

```php
class PenCollection extends Collection
{
    public function withType(PenType $size): self
    {
        return $this
            ->filter(fn (Pen $pen) => $pen->type === $type);
    }

    public function withPriceBetween(int $min, int $max): self
    {
        return $this
            ->filter(fn (Pen $pen) => $pen->price >= $min && $pen->price < $max);
    }

    public function colors(): Collection
    {
      return $this
          ->map(fn (Pen $pen) => $pen->color)
          ->uniq();
    }
}
```

We're entering duplication territory. Twice is fine, but once we start selling scissors we'll run out of patience. How can we refactor?

We could move `withPriceBetween` and `colors` to a trait, but we still need custom `PenCollection` and `PaperCollection` classes.

We could have our custom collections extend a common `ProductCollection`, but in my experience we're digging ourselves a deeper hole that way. At some point, we'll come across another shared method that doesn't fit "product" either.

Enter the pipe operator. No more need to worry about having methods on a single collection class. If we convert them to static methods we can use different functions throughout without them needing a fixed home.

```php
class PaperCollection
{
    /** @param Paper[] $paper */
    public static function withSize(array $paper, PaperSize $size): self
    {
        return array_filter(
            $paper,
            fn (Paper $paper) => $paper->size === $size,
        );
    }
}

class PenCollection extends Collection
{
    /** @param Pen[] $pens */
    public static function withType(array $pens, PenType $size): self
    {
        return array_filter(
            $pens,
            fn (Pen $pen) => $pen->type === $type,
        );
    }
}

class ProductCollection
{
    /** @param Product[] $products */
    public static function withPriceBetween(array $products, int $min, int $max): self
    {
        return array_filter(
            $products,
            fn (Product $product) => $product->price >= $min && $product->price < $max,
        );
    }

    /** @param Product[] $products */
    public static function colors(array $products): Collection
    {
        return $products
        |> fn (array $products) => array_map(fn (Product $product) => $product->color, $products)
        |> array_unique();
    }
}
```

```php
$paperCollection
|> ProductCollection::withPriceBetween(5_00, 10_00);
|> PaperCollection::withPaperSize(PaperSize::Letter)
|> ProductCollection::colors()

$penCollection
|> ProductCollection::withPriceBetween(0_00, 10_00);
|> PaperCollection::withType(PenType::Ballpoint)
|> ProductCollection::colors()
```

Namespaced functions are also an option. They'll need to be stored in a separate file and autoloaded accordingly.

```php
namespace App\Paper;

/** @param Paper[] $paper */
function withSize(array $paper, PaperSize $size): self
{
    return array_filter(
        $paper,
        fn (Paper $paper) => $paper->size === $size,
    );
}
```

But they look so much better!

```php
use App\Paper\withPaperSize;
use App\Product\{withPriceBetween, colors};

$paperCollection
|> withPriceBetween(5_00, 10_00);
|> withPaperSize(PaperSize::Letter)
|> colors()
```

## Pipe operator RFC

In 2020, Larry Garfield created an [RFC](https://wiki.php.net/rfc/pipe-operator-v2) to add the pipe operator in PHP.
I like how Larry described the pipe operator in a [comment](https://github.com/php/php-src/pull/7214#issuecomment-881987384):

> Scalar methods work if and only if the method you want to use is one that was pre-blessed as a method. If not, you're SOL. Pipes allow any type-compatible function at all to be used, anywhere. There's simply no comparison in terms of the flexibility it allows.

Unfortunately the RFC was declined for PHP 8.1. There were two recurring arguments why it was declined.

First, there was discussion wether it should use a token. Back to one of my previous examples:

```php
'Hello, world!'
|> strtolower($$)
|> substr($$, 0, -1)
|> str_replace(',', '', $$)

// 'hello world'
```

I don't really mind wrapping code in an arrow function when the argument order is an issue. Or I would use a third party library that wraps standard PHP functions with pipe-friendly signatures.

```php
'Hello, world!'
|> strtolower(...)
|> substr(0, -1)
|> fn ($greeting) => str_replace(',', '', $greeting)

// 'hello world'
```

Second, many noted a `pipe` function can exist in userland. While true, a custom `pipe` will be difficult to statically analyze for type-safety between function calls. More importantly, it doesn't promote writing pipe-friendly code in general. Adding the pipe operator to the language would push developers to consider separating data from processes.

I hope the pipe operator can be reconsidered in a future PHP version.

---

More on my PHP wishlist:

- The pipe operator
- [Nested properties](/php-wishlist-nested-properties)
