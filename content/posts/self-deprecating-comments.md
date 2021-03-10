---
title: "Self-deprecating comments"
slug: self-deprecating-comments
date: 2021-03-10
keywords:
    - Programming
---

[Henrik Nyh](https://twitter.com/henrik) suggests to make comments more resilient to change with double-entry bookkeeping.

```diff
- $timeoutMs = 1000; // Equals 1 second
+ $timeoutMs = 1000; // 1000ms equals 1 second
```

> Whether the discrepancy is caught immediately by the author, or in review, or by another developer far down the line, it will be explicitly clear that the comment was not intended for the current value.

This lowers the odds that a comment will get out of sync, especially useful in configuration files.

For more context head to Henrik's blog, [The Pug Automatic](https://thepugautomatic.com/2021/02/write-self-deprecating-comments/).
