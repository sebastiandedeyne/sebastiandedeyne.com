---
title: "Eloquent findOrFail caveats"
slug: eloquent-find-or-fail-caveats
date: 2021-11-23
type: article
tags:
  - Laravel
  - Eloquent
---

I use `Model::findOrFail` a *lot* in Laravel. Recently, I realized it's not always the best option.

<!--more-->

`findOrFail` is great because it ensures you'll end up with a model instance. No more "Attempt to read property on null" exceptions.

```php
$title = Post::findOrFail($id)->title;
```

Another benefit is that Laravel returns a 404 response for you when the model doesn't exist. (This is handled in Laravel's base [exception handler](https://github.com/laravel/framework/blob/5b50d53053990e2ed2da8b8f8dffbdce290c1b40/src/Illuminate/Foundation/Exceptions/Handler.php#L384-L385)) The 404 response is a double-edged sword. It's a great feature in controllers and other outer layers of your application, but can be harmful in core business logic.

Validating that a model exists should generally happen in a request object or a controller action. When I'm deep inside the application — like in an action or a service class — a missing model often means there's an inconsistency in my database state. That's not the same as a missing resource. Inconsistent database states should generally return a 500 status code, not 404.

In addition, Laravel doesn't report model not found exceptions to error trackers. This makes sense for 404 responses. But if a model wasn't found in my core business logic, it means I need to validate earlier or catch the error and deal with it.

I stopped using `findOrFail` in actions, aggregate roots, and other core business classes. In those places, I'd rather throw a plain exception that my error tracker will pick up.
