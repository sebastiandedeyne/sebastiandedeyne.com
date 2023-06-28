---
date: 2017-05-15
title: The list function & practical uses of array destructuring in PHP
subtitle: Written for PHP ^7.1
tags:
  - PHP
---

PHP 7.1 introduced a [new syntax](https://wiki.php.net/rfc/short_list_syntax) for [the `list()` function](http://www.php.net/list). I've never really seen too much `list()` calls in the wild, but it enables you to write some pretty neat stuff.

This post is a primer of `list()` and it's PHP 7.1 short notation, and an overview of some use cases I've been applying them to.

<!--more-->

## `list()` 101

The `list()` construct (it's actually not a function but a language construct like `array()`) has been around since PHP 4. `list()` allows you to pull variables from an array based on their index. Let's start with a quick primer!

Here's what a basic `list()` call looks like:

```php
<?php

list($a, $b, $c) = ['foo', 'bar', 'baz'];

echo $a; // "foo"
echo $b; // "bar"
echo $c; // "baz"
```

You can give `list()` less arguments than the array's size if you don't care about the rest of the items.

```php
<?php

list($a, $b) = ['foo', 'bar', 'baz'];

echo $a; // "foo"
echo $b; // "bar"
```

If you try to pull out an index that isn't set, an undefined offset error is thrown.

```php
<?php

list($a, $b, $c) = ['foo', 'bar'];

echo $a; // "foo"
echo $b; // "bar"
echo $c; // Undefined offset: 1
```

To skip an intermediate value, you can provide an empty argument.

```php
<?php

list($a, , $b) = ['foo', 'bar', 'baz'];

echo $a; // "foo"
echo $b; // "baz"
```

As of PHP 7.1, you can specify the key of the item you want to unpack from an associative array. (RFC [here](https://wiki.php.net/rfc/list_keys))

```php
<?php

$person = [
    'name' => 'Sebastian',
    'job' => 'Developer',
];

list('job' => $job) = $person;

echo $job; // "Developer"
```

Fun fact: since `list()` is an assignment operator, you could also assign things in arrays. Not saying this is particularly useful, but it's possible!

```php
<?php

$people = [
    ['name' => 'Freek', 'role' => 'Developer'],
    ['name' => 'Sebastian', 'role' => 'Developer'],
    ['name' => 'Willem', 'role' => 'Designer'],
];

$names = [];

foreach ($people as $person) {
    list('name' => $names[]) = $person;
}

var_dump($names); // ["Freek", "Sebastian", "Willem"];
```

The `list()` operator is pretty cool, but has one caveat: it's _ugly_. PHP 7.1 fixes this with some syntactic sugar: plain old vanilla square brackets. These two statements do the same:

```php
<?php

// Oldschool
list($a, $b, $c) = ['foo', 'bar', 'baz'];

// PHP 7.1
[$a, $b, $c] = ['foo', 'bar', 'baz'];
```

While it's not as powerful as [JavaScript's array destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), it's still a cool tool to have baked in the language.

Now that we know how array destructuring works, let's move on to some practical examples.

## Exhibit A: Some Classic Unpacking Examples

In this exhibit, we'll glide over some with some real world situations.

You've exploded a string and want to immediately assing the result as two seperate variables.

```php
<?php

[$user, $repository] = explode('/', 'spatie/laravel-medialibrary', 2);
```

You've created a few objects at once, and want them all as their own variables.

```php
<?php

[$userA, $userB, $userC] = factory(User::class, 3)->create();
```

You want to swap two variables.

```php
<?php

$a = 'hello';
$b = 'world';

[$a, $b] = [$b, $a];

echo $a; // "world"
echo $b; // "hello"
```

Voila, nothing too fancy here, let's move over to some more specific use cases, borrowed from other languages.

## Exhibit B: Tuples

The most concise definition of a tuple is a _"data structure consisting of multiple parts"_. Tuples are pretty much arrays with a fixed size and a predefined structure, for example a tuple of a status code and a message, a tuple of a longitude and a latitude, etc.

Tuples are useful in PHP when a key-value pair just doesn't cut it (maybe we need duplicate keys, or would want more that one value) and when we don't want to bother creating a value object.

Let's start with an array of some fruits and vegetables. Every piece of produce has an `id`, a `name` and a `type`.

```php
<?php

$produce = [
    [1, 'apple', 'fruit'],
    [2, 'banana', 'fruit'],
    [3, 'carrot', 'vegetable'],
];
```

Using the index to access the values requires us to reason about the array contents on every statement. Though process: _"This is `$item[0]`, which means is the first item in the array. Next is `$item[1]`, which means it's the second item, etc."_

```php
<?php

$mappedProduce = [];

foreach ($produce as $produce) {
    $mappedProduce[] = [
        'id' => $produce[0],
        'name' => $produce[1],
        'type' => $produce[2],
    ];
}
```

By destructuring, we can immediately assign the values to a variable, making the contents of the loop clearer. Thought process: _"I have an array containing entries that have an id, a name and a type."_

```php
<?php

$mappedProduce = [];

foreach ($produce as [$id, $name, $type]) {
    $mappedProduce[] = [
        'id' => $id,
        'name' => $name,
        'type' => $type,
    ];
}
```

Bonus snippet: we could use compact to create the array with a single statement _(although I don't like compact because it's just as ugly as `list()`)_.

```php
<?php

$mappedProduce = [];

foreach ($produce as [$id, $name, $type]) {
    $mappedProduce[] = compact('id', 'name', 'type');
}
```

A more real world example: I recently had to make a pretty large form that only contained simple text inputs. I defined every input as a `[$name, $value, $required]` tuple and looped over all of them.

```html
@foreach([ ['name', $user->name, true], ['telephone', $user->telephone, true],
['fax', $user->fax, false], // ... ] as [$name, $value, $required])
<div>
  <label for="{{ $name }}">{{ __($name) }}</label>
  <input
    type="{{ $text }}"
    name="{{ $name }}"
    id="{{ $name }}"
    value="{{ $value }}"
    @if($required)
    required
    @endif
  />
  <div>@endforeach</div>
</div>
```

Further reading: [Tuples in Python](https://www.tutorialspoint.com/python/python_tuples.htm), [Tuples in Elixir](http://elixir-lang.org/getting-started/basic-types.html#tuples)

## Exhibit C: Multiple Returns

Some languages allow multiple returns. Consider a function that expects an integer, and returns two integers, one of them being `$input + 5`, the other `$input - 5`. Here's what that would look like in Go:

```go
func addAndRemoveFive(i int) (int, int) {
    return i + 5, i - 5
}

func main() {
    x, y := addAndRemoveFive(10)
}
```

We could achieve something similar by returning an array in PHP and immediately destructuring:

```php
<?php

function addAndRemoveFive(int $i): array {
    return [$i + 5, $i - 5];
}

[$x, $y] = addAndRemoveFive(10);

echo $x; // 15
echo $y; // 5
```

One large downside here: there's currently no way to document this, neither with PHP 7's return types nor with PHPDoc (unless both returns have the same type, then you could hint with `@return int[]`).

A more real world situation where multiple returns can be useful is cases where you're expecting a status and a message that you may or may not care about, like validation.

```php
<?php

[$valid, $reason] = $validator->validate($data);

if (! $valid) {
    return new JsonResponse(422, ['reason' => $reason]);
}

return new JsonResponse(200);
```

The previous example could also be interpreted as a tuple containing a status and a reason.

Further reading: [Multiple returns in Go](https://golang.org/doc/effective_go.html#multiple-returns)

## That's It!

That concludes today's presentation. I'll update the post in the future when I come accross other nifty use cases. Meanwhile, feel free to hit me up on [Twitter](https://twitter.com/sebdedeyne) if you're using `list()` in other cool ways!
