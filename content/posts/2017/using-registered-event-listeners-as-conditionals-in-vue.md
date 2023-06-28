---
date: 2017-07-18
title: Using registered event listeners as conditionals in Vue
subtitle: Written for Vue ^2.4
categories: ["articles"]
tags:
    - Vue.js
    - JavaScript
---

Today I was writing a form component that needed an optional back button. Since the form component is generic, the back button could point to anything.

<!--more-->

I decided to use a [component event](https://vuejs.org/v2/guide/components.html#Custom-Events), so the parent can listen to a `back` event and do it's own thing. Also: The back button isn't always necessary, so I needed some sort of prop to decide if it should be rendered.

Here what my first iteration looked like:

```html
<!-- GenericForm.vue -->

<template>
  <div>
    <!-- ... -->
    <button v-if="showBackButton" @click="$emit('back')">Back</button>
  </div>
</template>

<script>
  export default {
    props: {
      showBackButton: { default: false }
    }
  };
</script>
```

Which looks like this in use:

```html
<generic-form :showBackButton="true" @back="goBack"></generic-form>
```

Something feels wrong here. The prop looks pretty noisy to me, since I'm never going to show it if I didn't register a listener in the first place! (at least in the context of my application)

Turns out, [as of Vue 2.4](https://github.com/vuejs/vue/releases/tag/v2.4.0), components have a `$listeners` property, which is an object that contains a list of handlers listening to the component's events.

Let's clean up our component public API with this in mind.

```html
<!-- GenericForm.vue -->

<template>
  <div>
    <!-- ... -->
    <button v-if="showBackButton" @click="$emit('back')">Back</button>
  </div>
</template>

<script>
  export default {
    computed: {
      showBackButton() {
        return !!this.$listeners.back;
      }
    }
  };
</script>
```

Which looks way better than the previous example in use!

```html
<generic-form @back="goBack"></generic-form>
```

Now the form component will automagically render the back button when it has an event handler listening.

<aside>
Closing thought: Sometimes it's a better idea to be explicit. It depends!
</aside>
