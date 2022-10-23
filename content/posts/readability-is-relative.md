---
date: 2018-12-06
title: Readability is relative
categories: ["articles"]
tags:
    - programming
---

When I write a library that's going to be used by others, I strive for a gentle learning curve. When someone reads code that uses my library, I want them to understand what's happening without reading a bunch of documentation first. I tend to keep my API's as explicit as possible, and try to stay away from odd or foreign notations.

My colleague [Brent](https://stitcher.io/blog) is writing a library to deal with date & time periods in PHP. There was a [discussion](https://github.com/spatie/period/issues/9) whether a period's boundaries should be included in the range or not.

<!--more-->

```php
<?php

$period = Period::make('2018-12-25', '2018-12-27');

$period->contains(new DateTime('2018-12-27'));
// true of false?
```

The conclusion of the discussion was that there's no right answer, and the library should allow both. A period's boundaries should be configurable.

In math, intervals use parentheses and square brackets to denote the difference between included and excluded.

`[1, 5)` is an interval from 1 to 5, including the 1 and excluding the 5. `[1, 5]` also includes the 5. Using this notation, the `Period::make` method could look like this:

```php
<?php

Period::make('2018-12-25', '2018-12-27', '[)');
```

If you're in to mathematics, this makes perfect sense. If you've never seen the bracket notation before, you probably have no idea what it means. Or worse, you might _think_ you understand it and interpret it the wrong way.

An alternative, would be to expose a more verbose API:

```php
<?php

Period::make(
    '2018-12-25',
    '2018-12-27',
    Period::LEFT_OPEN_RIGHT_CLOSED
);
```

Now let's compare our two API's side by side:

```
[]  LEFT_OPEN_RIGHT_OPEN
[)  LEFT_OPEN_RIGHT_CLOSED
(]  LEFT_CLOSED_RIGHT_OPEN
()  LEFT_CLOSED_RIGHT_CLOSED
```

I'm not a math expert. The explicit API makes more sense to me. If I was a math expert, I'd probably find the explicit API unnecessarily verbose.

What's the better API? The more succinct mathematical notation, or the verbose constants? I don't know. The problem is, readability of code isn't something we can measure objectively, it depends on the reader.

The mathematical notation has a steeper learning curve. However, if you understand it, I'd argue it's more readable than the overly explicit API, especially if you're spending all day staring at period definitions.

Explicit API's also leave more room for interpretation. Are `LEFT_OPEN_RIGHT_OPEN` and `LEFT_CLOSED_RIGHT_CLOSED` good names? Should we name them `OPEN` and `CLOSED` instead? Sounds like that makes sense, but then they're not fully consistent with the middle two options.

Similar discussions often pop up when talking to domain experts. As a programmer, I need to do my best to wrap my head around a domain, and tend to keep away from abbreviations and acronyms. This keeps my peers that will be reading and refactoring my code six months later happy.

Elon Musk hates acronyms too. So much, that he sent a company-wide e-mail:

> There is a creeping tendency to use made up acronyms at SpaceX. Excessive use of made up acronyms is a significant impediment to communication and keeping communication good as we grow is incredibly important. Individually, a few acronyms here and there may not seem so bad, but if a thousand people are making these up, over time the result will be a huge glossary that we have to issue to new employees. No one can actually remember all these acronyms and people don't want to seem dumb in a meeting, so they just sit there in ignorance. This is particularly tough on new employees.
>
> That needs to stop immediately or I will take drastic action - I have given enough warning over the years. Unless an acronym is approved by me, it should not enter the SpaceX glossary. If there is an existing acronym that cannot reasonably be justified, it should be eliminated, as I have requested in the past.
>
> For example, there should be not "HTS" [horizontal test stand] or "VTS" [vertical test stand] designations for test stands. Those are particularly dumb, as they contain unnecessary words. A "stand" at our test site is obviously a test stand. VTS-3 is four syllables compared with "Tripod", which is two, so the bloody acronym version actually takes longer to say than the name!

That rant deserves a round of applause 👏 However, there's one more paragraph in the letter:

> The key test for an acronym is to ask whether it helps or hurts communication. An acronym that most engineers outside of SpaceX already know, such as GUI, is fine to use. It is also ok to make up a few acronyms/contractions every now and again, assuming I have approved them, e.g. MVac and M9 instead of Merlin 1C-Vacuum or Merlin 1C-Sea Level, but those need to be kept to a minimum.

Looks like there's room for some exceptions anyway!

When writing software, ask yourself what you can afford with respect to your readers. How much domain knowledge do you expect of your API consumers? Are you designing an API for power users? Laymen? Maybe both?

There's no right or wrong, it all depends on context. And like most things in software, there are always tradeoffs involved.
