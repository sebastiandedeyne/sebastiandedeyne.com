---
date: 2018-01-15
title: Passing data to layouts in Blade through extends
type: article
tags:
  - Laravel
  - PHP
---

Laravel quick tip! The `@extends` Blade directive accepts a second (undocumented) parameter to pass data to the parent layout.

<!--more-->

The docs show this example to render a page title in a layout:

```php
<?php

<html>
    <head>
        <title>App Name - @yield('title')</title>
    </head>
</html>
```

```php
<?php

@extends('layouts.app')

@section('title', 'Page Title')
```

This makes it hard to do change or manipulate the page title. A plain variable would make this easier. Suppose we'd want to ensure that our title starts with a capital.

```html
<html>
  <head>
    <title>App Name - {{ ucfirst($title) }}</title>
  </head>
</html>
```

Now we can't pass our title with `@section` anymore. Luckily, `@extends` accepts a second argument, one that lets us pass plain data to the layout.

```php
<?php

@extends('layouts.app', ['title' => 'Page Title'])
```

I also prefer this syntax because `title` feels more like a _property_ in the layout than a _section_.

One little caveat, if you forget to pass a title, PHP will throw an error because the variable isn't defined. Make sure you always provide a fallback! PHP's null coalescing operator is pretty good at that.

```html
<html>
  <head>
    <title>App Name - {{ ucfirst($title ?? '') }}</title>
  </head>
</html>
```
