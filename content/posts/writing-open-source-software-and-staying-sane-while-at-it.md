---
title: "Writing open source software, and staying sane while at it"
date: 2019-10-29
categories: ["articles"]
keywords:
  - programming
  - oss
---

In the 4.5 years I've been a developer at [Spatie](https://spatie.be), over 200 packages have been built and released by our team. I've done quite some authoring and maintenance over the years, and I'd like to share 8 actionable tips on writing and maintaining open source software without going insane.

<aside>This post is based on a 4 minute lightning talk with the same title I gave at Full Stack Europe 2019 last week.</aside>

### 1. Duplication is fine

Don't be afraid to build something that already exists. Don't be afraid to solve a problem that has already been solved. There are many valid reasons for multiple solutions to exist.

Maybe the existing library only solves 80% of your use case, and you're looking for a perfect solution. Maybe you want full ownership over the solution because it's important to your business. Or maybe you just want to experiment, have fun, or grow as a developer. These are all valid reasons to roll your own solution.

### 2. Write docs first

Write your library's docs as soon as possible. This helps you focus on the API that you *want*, without getting into technical details.

Another reason to write docs first is motivation. If you've spent hours coding up a package, your energy will be drained and writing docs will feel like a chore. If you've already written them, you can release your code to the world immediately after writing it, which gives a big energy boost.

### 3. Implement, then package

If possible, create an open source package after you've implemented it in a real project. This will help you focus on writing a great package because you don't need to worry about solving the problem at the same time.

### 4. Spy on others

Before releasing a package, spy on others in the same ecosystem. Are there any code style conventions? Is there a standardised way to deal with configuration? Try to make your package blend in as much as possible to reduce friction for your users.

### 5. Don't overcomplicate

If you don't need a feature, don't build it. If you don't need something to be extendible, don't add any abstractions. And when I say you, I mean _you_. Don't fall into the trap of thinking what your library consumers _might_ want. 

Write your library, receive feedback, and _then_ consider making things more complicated if they add value.

### 6. Tag stable versions early

Tag a stable version number for your library early. Having an unstable version means the library is still somewhere on your mental to-do list, which can be tiring and bring down motivation.

If you tag a stable version, you can easily set it aside because it's not a work in progress anymore. It could also motivate you to work on the next version, both are great outcomes.

Don't forget that a stable version doesn't mean it needs to be finished, it just needs to be stable.

### 7. Learn to be selfish

If people are requesting features or sending PRs for things you don't need or want in your package, it's perfectly fine to say no.

Code is written once, but maintained forever; and you're the one that gets stuck with the maintenance.

### 8. Don't be afraid to let go

I have a lot of packages that I'd like to rewrite, or add new features to, but I can never find the time. This creates a constant nagging feeling of having a lot of things on my plate. 

Either delegate to contributors, or look for a co-maintainer to help you out. Seeing your library grow with help of others is just as rewarding as doing it all yourself.