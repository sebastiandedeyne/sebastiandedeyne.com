---
date: 2017-08-16
title: What's in our .babelrc?
categories: ["articles"]
tags:
  - JavaScript
  - tooling
  - babel
---

A lot has been going in in JavaScript the past few years. One of my favorite things has been the usage of [babel](http://babeljs.io/), which allows us to write future JavaScript syntax today. The babel ecosystem has tons of plugins and configuration options, I'd like to elaborate on our usage at [Spatie](https://spatie.be).

<!--more-->

To provide some context on what we're using this for: we generally build medium-sized, non-SPA projects with [Laravel](https://laravel.com). We're using [Laravel Mix](https://laravel.com/docs/5.4/mix) to build our assets, which uses [Webpack](https://webpack.js.org/) under the hood.

Lets dive right in, here's what our .babelrc file looks like:

```json
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions", "> 5% in BE"],
          "uglify": true
        },
        "modules": false
      }
    ]
  ],
  "plugins": ["syntax-dynamic-import", "syntax-object-rest-spread"],
  "env": {
    "test": {
      "presets": [
        [
          "env",
          {
            "targets": {
              "node": "current"
            }
          }
        ]
      ]
    }
  }
}
```

I'll be going through the three main sections: presets, plugins, and environment specific configuration. Before getting into specific configuration, we'll review when and why we use specific babel plugins.

## Deciding Which Features Are Worth Adding

We try to keep to features that are officially included in the ECMAScipt standard. For a feature to be included in the ECMAScript spec, it needs to reach stage 4 in [the TC39 process](https://tc39.github.io/process-document/). The stage number correlates with the features implementation progress. The higher the number, the more likely it's going to be part of the spec.

Sometimes an upcoming feature _really_ fits our code style. In that case, we consider transpiling it with a babel plugin.

Babel's a double-edged sword. While it allows you to use modern JavaScript features without worrying about runtime support (in a browser or in node), it also allows you to use _any_ fantasy non-standard syntax in your code if you'd want to. Be default, we use the latest JavaScript feature set, which is ES2017 at the time of writing. When we want to add something that's not officially part of the language yet, we ask ourselves the following questions:

- What stage is the proposal in? What's the community reaction to this feature?
- Is it implemented in TypeScript? TypeScript's pretty conservative regarding new language features, so if they've decided to implement it, that's a good sign.
- How much effort would it take to refactor if we'd change our mind down the line?
- How much value does it provide? How will it help us write and read our code? Is the result worth the non-standard approach?

Based on the answer to these, we'll either include a babel plugin, or decide to hold off a bit longer.

## Preset: babel-preset-env

```json
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "> 5% in BE"],
        "uglify": true
      },
      "modules": false
    }]
  ],
  ...
}
```

Time to go through our .babelrc, starting with our base preset. `babel-preset-env` is an "autoprefixer for browsers". It transpiles everything from the current spec to a format readable by the specified environments. This means it compiles as little as possible, resulting in a more effecient output. For example, when arrow functions are supported in all major browsers, they won't necessarily need to be transpiled anymore.

We're specifying two properties in `babel-preset-env`'s configurations. `targets` contains a list of environments that we want to support. We target the last 2 version of every major browser, and every browser version that has more than more 5% usage in Belgium. We change the latter depending on the project's target audience. `uglify` is set to true, to ensure the output syntax is supported by uglify.js to minimize our bundles.

Secondly, we set `modules` to false to ensure that `import` statements are left as is (opposed to transpiling them to `require`). We're doing this to give Webpack the ability to statically analyze our code to produce more efficient bundles.

<aside>
Further reading: <a href="https://github.com/babel/babel-preset-env">babel-preset-env on GitHub</a>.
</aside>

## Plugins

```json
{
  ...
  "plugins": [
    "syntax-dynamic-import",
    "syntax-object-rest-spread"
  ],
  ...
}
```

There are two language features that aren't at stage 4 of the ECMAScript standard just yet but we're already using. They're both at stage 3 though so they're most likely to be included in the (hopefully near) future.

### Dynamic Import

One way to do code splitting with Webpack is with the dynamic `import()` function.

```js
if (document.querySelector(".js-carousel")) {
  import("./modules/carousel").then(carousel => carousel.init());
}
```

It also provides a nice syntax for only loading Vue components when necessary.

```js
const app = new Vue({
  el: "#app",

  components: {
    carousel: import("./components/Carousel")
  }
});
```

<aside>
Further reading:
<a href="https://webpack.js.org/guides/code-splitting/#dynamic-imports">Code splitting in Webpack</a>,
<a href="https://vuejs.org/v2/guide/components.html#Async-Components">Async components in Vue</a>,
<a href="https://github.com/tc39/proposal-dynamic-import">TC39 proposal</a>,
<a href="https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-dynamic-import">syntax-dynamic-import babel plugin</a>
</aside>

### Object Rest Spread

Object rest spread isn't officially in the spec yet, but is used a lot in the wild already. It allows us to assign an object's properties to a new object.

```js
const spatieEmployee = {
  name: "Sebastian",
  job: "Developer",
  employer: "Spatie"
};

const anotherSpatieEmployee = { ...spatieEmployee, name: "Alex" };
```

<aside>
Further reading:
<a href="https://github.com/tc39/proposal-object-rest-spread">TC39 proposal</a>,
<a href="https://github.com/babel/babel/tree/8c64068a4290f4f60fe93a47ebdf7005db6e6f70/packages/babel-plugin-syntax-object-rest-spread">syntax-object-rest-spread babel plugin</a>
</aside>

## Environment Specific Configuration

```json
{
  ...
  "env": {
    "test": {
      "presets": [
        ["env", {
          "targets": {
            "node": "current"
          }
        }]
      ]
    }
  }
}
```

Lastly, we have an environment specific override for [Jest](https://github.com/facebook/jest), our testing framework of choice. Since Jest is run in node, we need to transpile our imports to requires, and target whatever node runtime we're currently working in.

That concludes the walkthrough through our .babelrc file, including all the whats and whys. This post won't stay relevant forever. We're not afraid of tweaking things every now and then, which is hopefully for the better. I'll try to keep up with changes here when necessary.
