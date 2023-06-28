---
title: "Use Blink to execute something once and only once"
slug: use-blink-to-execute-something-once-and-only-once
date: 2021-07-22
type: article
tags:
  - Laravel
  - PHP
---

Our [Blink](https://github.com/spatie/laravel-blink) package is marketed as a caching solution to memoize data for the duration of a web request. Recently, we came upon another use case for the package: to _execute_ something once and only once.

<!--more-->

Blink looks just like Laravel's cache. You can store things and retrieve them. The Blink cache is stored on a singleton object, so it's destroyed at the end of the request (similar to Laravel's `array` cache driver).

```php
$orders = blink('orders', fn () => Order::all());

$orders = blink('orders');
```

Now for a different use case. Say we want to generate and store PDF invoices for an order. We want to regenerate them whenever an order or an order line changes. We can use Eloquent events to determine when to dispatch a job.

```php
Order::saved(fn (Order $order) =>
    dispatch(new GenerateInvoicePdf($order))
);

OrderLine::saved(fn (OrderLine $order) =>
    dispatch(new GenerateInvoicePdf($orderLine->order))
);
```

If someone modifies an order and an order line in the same request, `GenerateInvoicePdf` will be dispatched twice, clogging the queue with unnecessary work.

Instead, we want to make sure the job only gets dispatched once. Here's where Blink comes in. Instead of using Blink to store something, we'll use it to execute something only once.

```php
Order::saved(fn (Order $order) =>
    blink('generate-invoice-pdf:' . $order->id, fn () =>
        dispatch(new GenerateInvoicePdf($order))
    )
);

OrderLine::saved(fn (OrderLine $order) =>
    blink('generate-invoice-pdf:' . $orderLine->order->id, fn () =>
        dispatch(new GenerateInvoicePdf($orderLine->order))
    )
);
```

Now it doesn't matter how many `saved` events are triggered; the job will only be dispatched once.

Cleaning things up, I like keeping cache calls to the same key in one place.

```php
class Order extends Model
{
    public function generateInvoicePdf(): void
    {
        blink('generate-invoice-pdf:' . $this->id, fn () =>
            dispatch(new GenerateInvoicePdf($this))
        );
    }
}

Order::saved(fn (Order $order) =>
    $order->generateInvoicePdf()
);

OrderLine::saved(fn (OrderLine $order) =>
    $orderLine->order->generateInvoicePdf()
);
```

This won't work when the environment is persisted across requests, like in a Horizon worker or Laravel Octane. In that case, you can fall store a `should_regenerate` boolean on the `orders` table and schedule a command to dispatch the `GenerateInvoicePdf` jobs.
