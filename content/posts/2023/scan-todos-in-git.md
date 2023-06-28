---
title: "Scan for todos on a git branch"
slug: scan-todos-in-git
date: 2023-03-10
type: article
tags:
  - Git
---

When I'm working on a feature or refactor, I often leave `@todo` comments to remain in flow and deal with other points later.

I don't mind committing them to my feature branch, as long as I work them away before merging in.

On large branches, it can be easy to forget about that todo I left in there a few days ago.

```php
class PodcastController
{
    public function process(Podcast $podcast): void
    {
        $podcast->process();

        // @todo Broadcast event to trigger webhooks

        return $podcast;
    }
```

Before I merge, I pipe `git diff` into a `grep` call to scan for changes that include `@todo`.

```sh
git --no-pager diff main..feature-branch | grep -i "^\+[^$]*@todo"
```

```diff
+        // @todo Broadcast event to trigger webhooks
```
