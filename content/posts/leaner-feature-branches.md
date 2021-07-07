---
title: "Leaner feature branches"
slug: leaner-feature-branches
date: 2021-07-07
categories: ["articles"]
keywords:
    - Git
---

In most projects we use [git flow](https://nvie.com/posts/a-successful-git-branching-model/) to some extent — depending on the project and team size. This includes feature branches.

> Feature branches (or sometimes called topic branches) are used to develop new features for the upcoming or a distant future release. When starting development of a feature, the target release in which this feature will be incorporated may well be unknown at that point. The essence of a feature branch is that it exists as long as the feature is in development, but will eventually be merged back into develop (to definitely add the new feature to the upcoming release) or discarded (in case of a disappointing experiment).

Working on a project that has a lot of interdependencies between features with a bigger team comes with a new set of challenges dealing with git.

We've recently come up with a new guideline: if it's not directly tied to your feature, don't put it in your feature branch.

<!--more-->

This might sound obvious, but in practice our instinct seems to be "work on the feature branch until the feature is complete" without thinking twice.

---

For example, you're working on a dynamic footer feature in a multi-tenant app. The footer contains the tenant's address (among other things). You want the tenant to store the address on their settings page, and pull that data into the footer. You created a `feature/footer` branch from `develop`.

While you could keep everything on the footer branch, your team members (and sometimes users) are better off if you branch out. Create a new `feature/address` branch from `develop` to add the address settings, merge it into `develop`, and finally bring `feature/footer` back up to date with `develop`.

---

If other developers are building something that requires the same derived feature, they don't have to wait on the main feature to be merged in to continue.

This also keeps PRs smaller and more focussed, which means reviews will be easier and faster to process, which results in a tighter feedback loop.

Finally, if it turns out the main feature has a lot of rabbit holes, the derived feature can be shipped on its own without waiting for the rest.

The hard part is _identifying_ derived features as features, not as a plain bullet point on the main feature's specs.
