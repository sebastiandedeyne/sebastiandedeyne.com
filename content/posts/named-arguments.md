---
title: "Named arguments"
slug: named-arguments
date: 2022-09-15
categories: ["articles"]
keywords:
  - PHP
---

I shiver at the sight of a function packed with too-many-to-read-at-a-glance arguments without a description. Especially boolean flags. Boolean flags lack context. Look at this code, I have no idea what `false, false, true` conveys.

```php
$page->render(false, false, true);
```

A pattern I often see in older code is an associative array as the single parameter. At least the intent is clear, but arrays lack IDE completion and type safety.

```php
$page->render([
  'footer' => false,
  'header' => false,
  'include_assets' => true,
]);
```

After another round of refactoring, we might end up with a bunch of fluent methods on the object.

```php
$page
    ->showFooter(false)
    ->showHeader(false)
    ->includeAssets()
    ->render();
```

The fluent builder removes our gripes and provides IDE completion and type safety, but I'm not content yet. Fluent builders explode the size of an object's public API surface.

```php
class Page
{
    private bool $showFooter = true;

    private bool $showHeader = true;

    private bool $includeAssets = false;

    public function showFooter(bool $showFooter): self
    {
        $this->showFooter = $showFooter;

        return $this;
    }

    public function showHeader(bool $showHeader): self
    {
        $this->showHeader = $showHeader;

        return $this;
    }

    public function includeAssets(bool $includeAssets): self
    {
        $this->includeAssets = $includeAssets;

        return $this;
    }

    //
}
```

That's all boilerplate, and doesn't even include alternative methods like `withoutFooter()`. It also introduces a bunch of internal (mutable) state.

```php
$firstRender = $page
    ->showFooter(false)
    ->showHeader(false)
    ->includeAssets()
    ->render();

$secondRender = $page
    ->showFooter(false)
    ->render();
```

The second render wil also exclude the header and include the assets because we mutated the state earlier. We could rewrite our object to be immutable,  that would lead to a more consistent implementation but introduce even more boilerplate code.

The year is now ~~2020~~ 2022, and another option has presented itself: named arguments.

```php
$page->render(
    footer: false,
    header: false,
    includeAssets: true,
);
```

To me, named arguments provide the best of all worlds. Proper IDE support, type safety, no internal state required, keeps the object's public methods to a minimum.

I didn't expect to appreciate them so much, but I think they're my favorite addition to PHP in a while.
