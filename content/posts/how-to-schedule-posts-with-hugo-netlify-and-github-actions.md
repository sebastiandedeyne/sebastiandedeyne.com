---
title: "How to schedule posts with Hugo, Netlify, and GitHub Actions"
slug: how-to-schedule-posts-with-hugo-netlify-and-github-actions
date: 2020-10-08T08:00:00+02:00
categories: ["articles"]
keywords:
  - Netlify
  - Hugo
  - static sites
  - GitHub Actions
---

If all went well, this post was published automatically. I  added the ability to schedule posts on my static blog (built with Hugo). I wrote a short GitHub Action to trigger a build on Netlify every morning.

<!--more-->

By default, [Hugo](https://gohugo.io) doesn't build pages that have a date in the future. During development, you can preview them with a flag.

```bash
hugo server --buildFuture
```

A post with this front matter would be scheduled to publish on February 2nd 2030 at 8:00 AM in my timezone:

```md
---
title: Dive into Shimizu Corporation's underground city
date: 2030-02-01T08:00:00+02:00
---
```

Since Netlify builds Hugo sites _without_ the `--buildFuture` flag, scheduled posts don't appear online. Netlify only publishes this site when I push changes to the git repository.

That's where GitHub Actions come in: you can [schedule an Action](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#scheduled-events) with cron.

I'm no cron expert by any means, so I opened [crontab.guru](https://crontab.guru) and smashed some numbers until I came up with a schedule that runs every morning at 8:00 AM. GitHub Actions are configured in UTC, so that's 6:00 over there.

```yaml
on:
  schedule:
    - cron: "0 6 * * *"
```

Now to trigger a build. Netlify supports [Build hooks](https://docs.netlify.com/configure-builds/build-hooks/#parameters), which are unique URLs you can POST to to trigger a build. After setting up a build hook in Netlify, I can `curl` it from the Action.

Build hook endpoints are protected by a secret token, which I added as a [secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) in my repository's settings.

Here's the final Action file:

```yaml
name: Cron build

on:
  schedule:
    - cron: "0 6 * * *"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger our build webhook on Netlify
        run: curl -s -X POST "https://api.netlify.com/build_hooks/${TOKEN}"
        env:
          TOKEN: ${{ secrets.NETLIFY_CRON_BUILD_HOOK }}
```

Now my site rebuilds every morning, and whenever I have a new post scheduled, it'll go live.
