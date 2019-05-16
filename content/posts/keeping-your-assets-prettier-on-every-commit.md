---
date: 2019-04-04
title: Keep your assets Prettier on every commit
categories: ["articles"]
tags:
    - tooling
---

I'm a happy [prettier](https://prettier.io) user to keep my CSS and JavaScript files consistent. However, it's hard to keep the discipline to run Prettier before every commit. This week I decided to automate the process with [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged).

<!--more-->

<aside>
There's also <a href="#">an updated version</a> of this post that uses husky and lint-staged to set up PHP CS Fixer.
</aside>

As an aside, this is what our `.prettierrc` generally looks like in [Spatie](https://spatie.be) projects:

```json
{
    "printWidth": 120,
    "tabWidth": 4,
    "trailingComma": "all",
    "singleQuote": true
}
```

Before we get started, we need to ensure our dependencies are installed:

```
npm install prettier husky lint-staged --save-dev
```

## Running prettier with lint-staged

Lint-staged is an npm package that will run a script on your staged files, in other words, on the files you want to commit. You can filter the staged files you want to run the scripts on with a glob.

We'll add the lint-staged configuration to our `package.json` file.

```json
{
    "lint-staged": {
        "linters": {
            "resources/**/*.{css,js}": [
                "prettier --write",
                "git add"
            ]
        }
    }
}
```

This is based on a Laravel project, where assets are stored in `resources`, and built to `public`. With the above config, we'll run prettier on every staged CSS and JavaScript file.

*Don't forget the `.vue` extension in the glob if you're using Vue single file components!*

## Git hooks with Husky

Husky is pretty straightforward. It registers some git hooks for you after `npm install`. The hook we care about is pre-commit: we want to format our assets before they get committed to the repository.

We'll add the husky configuration to our `package.json` file.

```json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    }
}
```

This will run the `lint-staged` command on pre-commit.

Since lint-staged only applies to files you've changed, it runs pretty fast too, so there's not too much extra overhead while committing!
