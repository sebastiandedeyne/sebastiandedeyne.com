---
date: 2018-02-05
title: Blade component aliases in Laravel 5.6
subtitle: Laravel ^5.6
categories: ["articles"]
keywords:
  - Laravel
  - PHP
  - blade
---

Laravel 5.6 adds the ability to register alias directives for Blade components. Let's review some background information and examples.

<!--more-->

## Blade components 101

I've been using Blade components since they were added back in Laravel 5.4. For those who don't know what a Blade component is, it's a directive to include views inspired by "components" in JavaScript frameworks like Vue.

```html
{{-- resources/views/components/alert.blade.php --}}

<div class="alert alert-{{ $type }}">{{ $slot }}</div>

{{-- resources/views/page.blade.php --}} @component('components.alert', [
'title' => 'Beware!', 'type' => 'warning', ]) Here be dragons! @endcomponent
```

A component's injected contents—placed in the "main slot"—are available through a `$slot` variable. Other data can be passed via an associative array similar to `@include`. What's nice about plain variables is that you can easily transform them or fall back to a default value, which is a bit more verbose using `@section` in layouts.

We can also share component "properties" via the `@slot` directive. This is useful if we need to pass a chunk of html or any other large string to the component.

```html
@component('components.card', ['type' => 'warning']) @slot('header')
<img src="dragon.svg" /> Beware! @endslot Here be dragons! @endcomponent
```

This is pretty cool. We can now build apps by composing components, a more coherant model than traditional layouts & includes.

## Introducing component aliases

I had one issue with Blade components—they can be annoyingly verbose at times.

Compare a Vue.js component with the previous `alert` example:

```html
<alert type="warning" title="Beware!">
    Here be dragons!
</alert>
```

This is much leaner than `@component('path.to.component', ...)`. A similar html-like syntax in Blade would be a bad idea, but that's okay. Blade's has a simple syntax: print things with curly brackets and do all the other things with directives. Let's keep it that way.

What if we could simplify the component syntax to a single directive? this is possible with the new `Blade::component` function.

Back to our `alert` example:

```php
<?php

Blade::component('components.alert');
```

```html
@alert(['type' => 'warning', 'title' => 'Beware!']) Careful! @endalert
```

If you don't have any extra slots, you can reduce it even further.

```html
@alert Careful! @endalert
```

We were able to contract the verbose `@component` syntax to something simpler while maintaining readability.

By default, Blade will assume that the last part of the component path is its alias. If we'd prefer a diffent name for our alias, we can pass a second parameter.

```php
<?php

Blade::component('components.alert', 'myAlert');
```

Component aliases will be part of Laravel 5.6, I hope they'll be of help tidying up your views!
