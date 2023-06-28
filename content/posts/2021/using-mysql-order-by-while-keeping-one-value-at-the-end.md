---
title: "Using MySQL `order by` while keeping one value at the end"
slug: using-mysql-order-by-while-keeping-one-value-at-the-end
date: 2021-12-16
tags:
  - MySQL
  - Laravel
---

The other day I needed to sort a dataset in MySQL and ensure one value was always at the end. I never fully understood how `order by` works, so I did some research on how to solve my problem and how `order by` behaves.

<!--more-->

The data set looks like a list of jobs. I want to present them alphabetically sorted. However, one of them is "Other", and I want that one to appear at the end of the list in my UI.

```
| id | name               |
|  1 | Backend Developer  |
|  2 | Designer           |
|  3 | Other              |
|  4 | Account Manager    |
|  5 | Frontend Developer |
```

Lets jump straight to the solution:

```
select * from jobs
order by field(name, "Other"), name
```

The `field(value, …list)` function returns the (1-based) index of the value in the list. If the value isn't in the list, it returns 0.

This is what the result of `field(name, "Other")` looks like for this dataset:

```
| id | name               | field
|  1 | Backend Developer  | 0
|  2 | Designer           | 0
|  3 | Other              | 1
|  4 | Account Manager    | 0
|  5 | Frontend Developer | 0
```

The second part of the solution is using `order by` for multiple columns.

I always assumed `order by` would order by the first clause, then the second. This is not entirely true. When you order by multiple values, MySQL treats the first as the primary value to sort by, and the next one as the secondary. This means once the first clause pushes values down or up, they'll stay there.

To illustrate, here's a simple dataset with letters and numbers.

```
| letter | number |
| d      |      2 |
| e      |      1 |
| c      |      3 |
| a      |      3 |
| b      |      1 |
```

When we run `order by number, letter`, MySQL will order by number first, and keep the subsets on their own little islands:

```
| letter | number |

| e      |      1 |
| b      |      1 |

| d      |      2 |

| c      |      3 |
| a      |      3 |
```

Then, MySQL will order the subsets by letter:

```
| letter | number |

| b      |      1 |
| e      |      1 |

| d      |      2 |

| a      |      3 |
| c      |      3 |
```

Back to our jobs dataset, `order by field(name, "Other")` will push the "Other" value below.

```
| id | name               | field |
|  1 | Backend Developer  |     0 |
|  2 | Designer           |     0 |
|  4 | Account Manager    |     0 |
|  5 | Frontend Developer |     0 |

|  3 | Other              |     1 |
```

The second part of the `order by` clause will order the subsets by name.

```
| id | name               | field |
|  4 | Account Manager    |     0 |
|  1 | Backend Developer  |     0 |
|  2 | Designer           |     0 |
|  5 | Frontend Developer |     0 |

|  3 | Other              |     1 |
```

## With Eloquent in Laravel

If you want to use the `field` function to order in Laravel, you need to use `orderByRaw`:

```php
$jobs = Job::query()
    ->orderByRaw('field(name, "Other")')
    ->orderBy('name');
```

If you want to apply this to all queries to the `jobs` table in our app, you can consider a global scope:

```php
class Job extends Model
{
    protected static function boot()
    {
        static::addGlobalScope(
            'order',
            fn (Builder $builder) => $builder
                ->orderByRaw('FIELD(name, "Other")')
                ->orderBy('name')
        );
    }
}
```
