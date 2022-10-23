---
title: "Why we use `!important` with Tailwind"
slug: why-we-use-important-with-tailwind
date: 2021-04-21
categories: ["articles"]
tags:
  - Tailwind
  - CSS
---

Tl;dr: We use `!important` because it solves annoying specificity issues. Despite being overkill in most situations, we haven't come across any practical drawbacks from globally enabling it.

If you want to learn more about how we came to that conclusion and how CSS specificity works, read on!

<!--more-->

Tailwind has a configuration option to mark all utilities as `!important`.

```js
// tailwind.config.js
module.exports = {
  important: true,
}
```

```css
.p-4 {
  padding: 1rem !important;
}
```

We enable this setting because utilities should always have the final say. This is a habit we inherited from ITCSS long before Tailwind existed. We weren't building interfaces *utility-first*, but we were using utilities.

From Harry Roberts' [introduction to ITCSS](https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528):

> This layer beats – or 'trumps' – all other layers, and has the power to override anything at all that has gone before it. It is inelegant and heavy-handed, and contains utility and helper classes, hacks and overrides.

Most of the time, this doesn't matter in Tailwind. When you style an element with utilities, the odds are slim that there will be clashes among them because they target a single CSS property.

```html
<button class="px-2 font-semibold border">
```

This applies to `padding-left`, `padding-right`, `font-weight`, and `border`. No properties are declared twice. This is different when you want to override a component with utilities.

```css
.card {
  padding: 2rem;
}

.p-4 {
  padding: 1rem;
}
```

```html
<div class="card p-4">
```

In this example, the `padding` property gets applied twice. To ensure the utility wins, Tailwind places utilities *after* components in the generated CSS. The other way around, utilities would never win.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This falls apart when a component class has a higher specificity. For example, when using the `@tailwindcss/typography` `.prose` class.

```html
<div class="prose">
  <h1 class="font-medium">
  </h1>
</div>
```

`.prose h1` specifies `font-weight: 800`. The `.font-medium` class will never apply because `.prose-h1` has a higher specificity.

{{< aside >}}Visit [specificity.keegan.st](https://specificity.keegan.st) to play around with the specificity calculator.{{< /aside >}}

![CSS Specificity calculator results](/media/css-specificity.jpg)

{{< aside >}}Setting `important: true` was also the Tailwind team's response to a [similar issue](https://github.com/tailwindlabs/tailwindcss-typography/issues/26#issuecomment-659362241).{{< /aside >}}

This breaks our guiding principle: utilities should always have the final say. To work around these kinds of problems, we mark all utilities as `!important`.

Using `!important` for all utilities is like using a sledgehammer to hit a nail in the wall. Despite being overkill in most situations, we haven't come across any practical drawbacks from globally enabling it.

## Alternative methods

If you don't like the idea of `!important` everywhere, Tailwind provides two more escape hatches.

### The high specificity selector solution

Tailwind has another option: add a high specificty selector to all utilities.

```js
// tailwind.config.js
module.exports = {
  important: '#app',
}
```

The `#app` selector is arbitrary, as long as it has a high specificity like an ID. Tailwind will prepend all utilities with this selector.

```css
#app .p-4 {
  padding: 1rem;
}
```

This solves the `.prose h1` vs. `.font-medium` problem because `#app` will always win.

![CSS Specificity calculator results](/media/css-specificity-2.jpg)

The benefit is that you're not forced to use `!important` when you want to override a utility. Yes, this breaks our "utilities should always have the final say" guideline. But I've come across situations where I want to override a utility with an inline style in JavaScript.

This example doesn't work without `!important` with the `important: true` configuration:

```html
<div class="flex" style="display: none;">
</div>
```

The downsides are that your stylesheet depends on an arbitrary selector to exist (you need to wrap everything in `#app`) and the noise it adds to the utilities' selectors (which is a minor issue).

We haven't tried `important: '#app'` in a meaningful project yet—because we hadn't found out about it before—but might in the future.

### Tailwind JIT

Tailwind's new Just-In-Time mode comes with an on-demand `!important` modifier.

```html
<div class="prose">
  <h1 class="!font-medium">
  </h1>
</div>
```

With this modifier, we'd be able to keep `!important` out of our codebase and call upon it when needed. After further consideration, I don't think we'll be turning off `!important` for two reasons.

First, it makes it harder for developers with less CSS knowledge to contribute. They now have to make a conscious decision between an `!important` and non-`!important` utility.

Second, it can get confusing when we extract components. We'd need to add `!important` preemptively to ensure it renders as expected depending on the context.

```html
<!-- Header -->
<h1 class="font-medium"></h1>

<!-- a) This works -->
<Header />

<!-- b) This doesn't -->
<div class="prose">
  <Header />
</div>
```

By specifying CSS rules with `!important`, we can ensure they're applied in no matter what context. Exactly what we want of utilities.

## Resources

A lot of our opinions on CSS are based on Harry Roberts' guidelines. He wrote an article about `!important` on his blog, [CSS Wizardry](https://csswizardry.com/2016/05/the-importance-of-important/).

If you want to learn how specificity is calculated, read up on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#the_!important_exception). If you learn more about the cascade in general, I recommend [this excellent article](https://css-tricks.com/the-c-in-css-the-cascade/) on CSS Tricks.
