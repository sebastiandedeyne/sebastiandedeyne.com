---
date: 2016-03-09
title: Normalize your values on input
categories: ["articles"]
keywords:
  - PHP
  - programming
---

Dynamic languages allow us to pass anything as a parameter without requiring a specific type. In turn, this means we often need to handle some extra validation for the data that comes in to our objects.

This is a lightweight post on handling your incoming values effectively by normalizing them as soon as possible. It's a simple guideline worth keeping in mind which will help you keep your code easier to reason about.

<!--more-->

Let's say we're writing an abstraction for a collection of html classes, which can then render it's contents as a string or as an array. We want to be able to create an instance of `HtmlClasses` from either an array or a space seperated string.

```php
<?php

new HtmlClasses('foo bar baz');
new HtmlClasses(['foo, bar, baz']);
```

In it's most basic version, we'd just set the `$classes` string or array that gets passed in as an attribute on the class.

```php
<?php

class HtmlClasses
{
    /** @var string|array */
    protected $classes;

    /**
     * @param string|array $classes
     */
    public function __construct($classes)
    {
        if (!is_string($classes) && !is_array($classes)) {
            throw new InvalidArgumentException();
        }

        $this->class = $classes;
    }
}
```

Next up, we'll add our `toArray` method. If out `classes` property is already an array, we'll just return it, otherwise we'll wrap it in an array.

```php
<?php

class HtmlClasses
{
    /** @var string|array */
    protected $classes;

    // ...

    public function toArray() : array
    {
        if (! is_array($this->classes)) {
            return [$this->classes];
        }

        return $this->classes;
    }
}
```

We'll have to do the same to implement the `toString` method. As you'll notice, having multiple methods that use the `classes` property, this quickly adds bloat to your code, since you're never sure what it type it is.

```php
<?php

class HtmlClasses
{
    /** @var string|array */
    protected $classes;

    // ...

    public function toArray() : array
    {
        if (! is_array($this->classes)) {
            return [$this->classes];
        }

        return $this->classes;
    }

    public function toString() : string
    {
        if (! is_string($this->classes)) {
            return implode(' ', $this->classes);
        }

        return $this->classes;
    }
}
```

Let's turn things around, and ensure that the `classes` property is always a certain type, in this case, an array.

```php
<?php

class HtmlClasses
{
    /** @var array */
    protected $classes;

    /**
     * @param string|array $classes
     */
    public function __construct($classes)
    {
        if (is_array($classes)) {
            $this->classes = $classes;
            return;
        }

        if (is_string($classes)) {
            $this->classes = explode(' ', $classes);
            return;
        }

        throw new InvalidArgumentException();
    }
}
```

Since we know we're always dealing with an array, we can just return whatever we want, without having to reason about the edge cases every time.

```php
<?php

class HtmlClasses
{
    /** @var array */
    protected $classes;

    // ...

    public function toString() : string
    {
        return implode(' ', $this->classes);
    }

    public function toArray() : array
    {
        return $this->classes;
    }
}
```

## Named constructors

On a closing note, if you want to avoid dynamic parameters alltogether, you could resort to named constructors by creating a dedicated factory method per type.

```php
<?php

class HtmlClass
{
    /** @var array */
    protected $classes;

    private function __construct(array $classes)
    {
        $this->classes = $classes;
    }

    public static function fromArray(array $classes) : HtmlClass
    {
        return new static($classes);
    }

    public static function fromString(string $classes) : HtmlClass
    {
        return new static(explode(' ', $classes));
    }
}
```

For a more in depth view of the what and the why, I'd recommend reading Matthias Verraes' [article on named constructors in PHP](http://verraes.net/2014/06/named-constructors-in-php/).
