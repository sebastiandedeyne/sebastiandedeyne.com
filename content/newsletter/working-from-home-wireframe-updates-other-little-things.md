---
title: "Working from home, wireframe updates & other little things"
date: 2020-04-01
---

Hi!

Because of reasons you probably already know I'm working from home for the time being. In normal times, I worked from home two days a week, so I'm not new to remote work, but going from two to five days is a big step nonetheless.

I had a hard time finding flow in the first few days, so I set up a schedule to bring some structure into my workdays.

08:15 | Get up
09:00 | Work (3,5h)
12:30 | Lunch break
13:00 | Work (3h)
16:00 | Outside break
16:45 | Work (1,5h)
18:15 | Evening

I'm not following this by the minute, sometimes not even by the hour, but having a framework to fall back to brings peace of mind and allows me to focus on other things. Three weeks in and I'm feeling pretty comfortable working at home.

If you're forced to work remotely in the coming weeks, and you're still not feeling it, I recommend [Matt Stauffer's post](https://mattstauffer.com/blog/making-the-best-of-a-less-than-ideal-remote-work-environment/) on setting up a work environment.

## Wireframing with React & Tailwind

This month, I finished the [wireframes](https://backups-wires.netlify.com) for the backup app we're building at Spatie. With "finished", I mean that they're fleshed out enough for someone to start building the app based on them. Some details or less prominent views are missing, but we'll handle those as we build the app.

I used React, Next.js & Tailwind to create the backup app wireframes. At the same time, I'm using Figma for the wireframes of a (huge) client project. Now that I'm getting more proficient with Figma, I prefer it over React.

I started using React for prototypes because I felt more at home in my code editor than in a GUI app like Sketch Figma. However, after some practice, I became more proficient with Figma, to the point where code started to feel like overhead.

That said, building an HTML prototype still shines for interfaces with complex interactions like drag & drop, or have interfaces with a lot of conditional elements.

## JavaScript Framework Diet update

Since last month's newsletter, I added two new posts to the JavaScript Framework Diet series:

- [File structure](https://sebastiandedeyne.com/javascript-framework-diet/file-structure/)
- [Dropdowns](https://sebastiandedeyne.com/javascript-framework-diet/dropdowns/)

Next up is a post about transitions. Not gonna lie, this one's taking longer than usual because of writer's block. This is a hard topic to write about because I don't only need to explain *how* transitions are set up, but *why* they're set up that way.

## Unix things I always forget

In the meantime, I started a second blog series: Unix things I always forget. This one's more low key that the JavaScript Framework Diet.

I often forget how to do things in Unix, like finding files with a specific extension, symlinking, etc. This series is an attempt to document the commands I always forget.

Follow along on [sebastiandedeyne.com](https://sebastiandedeyne.com/unix-things/)!

## More on the blog

Various posts I wrote this month, from the IndieWeb to DevOps:

- [Webmentions on a static site with GitHub Actions](https://sebastiandedeyne.com/webmentions-on-a-static-site-with-github-actions/)
- [Composer, semver, and underlying dependency changes](https://sebastiandedeyne.com/composer-semver-and-underlying-dependency-changes/)
- [Setting up a global .gitignore file](https://sebastiandedeyne.com/setting-up-a-global-gitignore-file/)
- [Upgrading Node.js on a Laravel Forge Provisioned Server](https://sebastiandedeyne.com/upgrading-node-js-on-a-laravel-forge-provisioned-server/)

Some links I shared:

- [Give it five minutes](https://sebastiandedeyne.com/give-it-five-minutes/)
- [Privacy and having nothing to hide](https://sebastiandedeyne.com/privacy-and-having-nothing-to-hide/)

## Recipes site update

A while back, I set up [a Next.js project with a custom webpack loader](https://github.com/sebastiandedeyne/recipes.sebastiandedeyne.com/tree/fef8e712767aa3da6b44b3d18354fd1fa035392a) to organize my recipes. While doing some greenkeeping in the app, I realized Next.js & webpack weren't bringing much to the table. I dropped them in favor of a 40-line custom build script to build the webpage instead.

For small projects like this don't change often, I prefer to maintain an as-small-as-possible stack over a gazillion node\_modules that probably won't install when I pull this project back in a year from now.

Check out the [static live site](https://recipes.sebastiandedeyne.com), or browse the repository on [GitHub](https://github.com/sebastiandedeyne/recipes.sebastiandedeyne.com/tree/68cbc9515d97b344e6b5c19c40ec6ae9ca751a1a).

## On the horizon

I'm doing a small experiment per month: write 200 words per day in the week. 200 words aren't a lot on their own, but if I can consistently pull this off for 20 days a month, it amounts up to a lot of writing. More importantly, it builds a habit (I read [Atomic Habits](https://jamesclear.com/atomic-habits) earlier this year).

Besides writing, I'm spending more time on OSS repositories again. Nothing new, just trying to keep issues and PR's under control.

I'm also working on a small, code related but non-code project. A bit too soon to talk about that, but looking forward to sharing it in the future.

Until the next issue,

Seb
