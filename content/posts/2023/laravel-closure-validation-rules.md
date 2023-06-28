---
title: "Laravel closure validation rules"
slug: laravel-closure-validation-rules
date: 2023-06-16T13:00:00+02:00
tags:
  - Laravel
---

Today I was looking for a way to create a custom Laravel validation rule without the overhead of a new class. The rule I needed would only be used in one place, so wanted to keep it close to (or in) the request class.

Upon re-reading the validation docs, I learned that Laravel supports closures as rules.

```php
class JournalEntryRequest extends Request
{
    public function rules(): array
    {
        return [
            // …
            'lines' => [
                function (string $attribute, mixed $value, Closure $fail) {
                    $debit = collect($value)->where('type', 'debit')->sum('amount');
                    $credit = collect($value)->where('type', 'credit')->sum('amount');

                    if ($debit !== $credit) {
                        $fail("Debit and credit don't match.");
                    }

                    if ($debit !== 0) {
                        $fail("Amount must be greater than 0.");
                    }
                },
            ]
        ];
    }
}
```

Just what I needed!
