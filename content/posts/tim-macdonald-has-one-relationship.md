---
title: "Tim MacDonald on HasOne relationships in Laravel"
slug: tim-macdonald-has-one-relationship
date: 2021-03-30
categories: ["articles"]
keywords:
  - Laravel
  - Eloquent
---

I've used `HasOne` relationships for `1:1` relationships, but those are rare. I haven't considered using them to scope down relationships, like having one default payment method in a set of `n` methods.

```php
<?php

class User extends Model
{
    public function paymentMethods(): HasMany
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function defaultPaymentMethod(): ?HasOne
    {
        return $this->hasOne(PaymentMethod::class)
            ->whereDefault();
    }
}

$user->defaultPaymentMethod;
```

After reading [Tim's post](https://timacdonald.me/would-you-like-a-fry-with-that-using-a-has-one-over-a-has-many-relationship-in-laravel/), I have a feeling there are some places where I needed this but didn't think of it at the time…
