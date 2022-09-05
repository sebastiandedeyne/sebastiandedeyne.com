---
title: "Granular interfaces"
slug: granular-interfaces
date: 2022-09-05
categories: ["articles"]
image: /media/granular-interfaces.jpg
keywords:
  - Programming
  - PHP
---

![](/media/granular-interfaces.png)

*A few weeks ago a spec change for an application we're working on forced us to refactor part of the codebase. It was food for thought about the flexibility granular interfaces provide, and choosing the right abstraction at the right time. This is a short writeup on the thought process we went through as we updated our logic to support a new feature now and allow more options in the future.*

Imagine we were hired to build a course platform. We're working on the code that grants access to a course after a user purchased it.

First, we'll create a course object with a `Purchasable` interface to indicate it can be purchased, and a `Registrable` interface to indicate a registration should be created after the customer has paid.

```php
class Course implements Purchasable, Registrable
{
}
```

Somewhere down the line in our checkout code, we can loop over the order items and create registrations for each registrable product we come across.

```php
foreach ($order->items as $orderItem) {
    if ($orderItem->purchasable instanceof Registrable) {
        createRegistration($orderItem->purchasable);
    }
}
```

Later on, the client asks how they can sell a bundle of courses. Purchasing a bundle would register a customer for a bunch of courses at once.

Since a bundle can be purchased, it will implement the `Purchasable` interface. However, implementing the `Registrable` interface wouldn't make sense. After the bundle is purchased, registrations need to be created for the underlying courses, not the bundle itself.

```php
class Bundle implements Purchasable
{
    public function __construct(
        public array $courses
    ) {
    }
}
```

This shows that the `Registrable` interface has not one but two responsibilities. It indicates that something can be tied to a registration, and it tells the system to create registrations after payment.

A course fulfills both responsibilities, but a bundle only needs to provision. Let's introduce a new `CreatesRegistrations` interface only to create registrations.

```php
class Bundle implements Product, CreatesRegistrations
{
    public function __construct(
        public array $courses
    ) {
    }

    public function createsRegistrationsFor(): array
    {
        return $this->courses;
    }
}
```

In our checkout code, we add another check for the new interface.

```php
foreach ($order->items as $orderItem) {
    if ($orderItem->purchasable instanceof Registrable) {
        createRegistration($cartItem->purchasable);
    }

    if ($orderItem->product instanceof CreatesRegistrations) {
        foreach ($orderItem->product->createsRegistrationsFor() as $registrable) {
            createRegistration($registrable);
        }
    }
}
```

That solves our problem, but our checkout code is getting bloated. Even worse, there are now two ways to tell our system a product will create registrations. If we want to know wether a product will create a registration, we have to check for both the `Registrable` and `CreatesRegistrations` interfaces.

We can consolidate the behavior to always use our `CreatesRegistrations` interface. The `Course` object can return a reference to itself.

```php
class Course implements Product, Registrable, CreatesRegistrations
{
    public function providesRegistrationsFor(): array
    {
        return [$this];
    }
}
```

And we can revert our checkout code is back to one `createRegistration` call.

```php
foreach ($order->items as $orderItem) {
    if ($orderItem->product instanceof ProvidesRegistrations) {
        foreach ($orderItem->product->providesRegistrationsFor() as $registrable) {
            createRegistration($registrable);
        }
    }
}
```

After refactoring to a more granular interface, our system is became flexible and composable. Small interfaces communicate intent more clearly, making it easier to understand the flow of a system.

That doesn't mean we should be paralyzed to find the perfect abstraction before we start. We only realized our interface wasn't granular enough after it grew out of its original use case. As a system evolves, abstractions should arise from current needs, not future possibilities.
