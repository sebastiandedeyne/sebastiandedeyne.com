---
title: "The Record type in TypeScript"
slug: typescript-record-type
date: 2021-03-31
tags:
  - TypeScript
---

I can't count the amount of times I've defined an object type with unknown string keys and a specific value type.

```js
type Scores = {
    [key: string]: number;
}
```
And despite using it all the time, I can't for the life of me remember the `[key: string]` syntax.

Today, my problems are solved. Apparently TypeScript has a built in `Record` type that does exactly that:

```js
type Scores = Record<string, number>;
```
