---
date: 2018-02-15
title: A pair of helping hands when naming things
tags:
  - programming
---

One of the hardest (and sometimes frustrating) tasks in a programmer's day-to-day workload is naming things. When I have a hard time finding that perfect word, I generally wind up in one of two situations:

- I have a plausible name in mind, but I'm _not entirely satisfied_ with it
- I have _no idea_ what I could possibly name it

Luckily, there are tools out there that can be of help.

<!--more-->

## "Surely there's a better word for this"

This often occurs when the name I have in mind is a bit too generic, or when it just doesn't _feel_ right.

Synonyms are great for when the word you're looking at is close-but-not-perfect.
[Thesaurus.com](http://www.thesaurus.com/) is a great place to browse synonyms. You can keep clicking through until you've found exactly what you're looking for.

## "I have a complete lack of inspiration today"

Sometimes I'm completely stumped. I know the _context_ of the word I'm looking for, but I can't think of anything that resembles it. [Word Associations Network](https://wordassociations.net) can help here. The results here are a lot more broad than the ones on Thesaurus.

## Alfred

I ofter refer to these services when coding or writing, so I made an [Alfred workflow](https://github.com/sebastiandedeyne/naming-things-alfred-workflow) that lets me seamlessly search for the perfect word.

The workflow is available on GitHub and adds two keywords to search for synonyms and associations: `syn` and `assoc`.

Typing `syn dog` in Alfred will direct me to a list of "dog" synonyms like "pup", "mutt" or "tail-wagger". `assoc dog` will provide a broader search, like "kennel", "handler" and "cat".

## Keep it simple

Like with code, don't try to be _too_ smart all the time. If what you're building already exists elsewhere, you might not need to come up with a name on your own. There might be an often used term for a specific concept. Look for alternative implementations of the same concept—even (especially!) in other programming languages. Maybe you can borrow something.

This post wouldn't be complete without Phil Karlton's renowned quote, so I'll just leave this here.

> There are only two hard things in Computer Science: cache invalidation and naming things.
