---
date: 2018-08-14
title: Mo' models mo' problems
subtitle: A dive into `v-model` and `.sync`
categories: ["articles"]
keywords:
  - Vue.js
  - JavaScript
---

One of the best things about Vue templates is the special `v-model` prop. `v-model` allows you two quickly map prop getters and setters without breaking unidirectional data flow. _Props down, events up._

<!--more-->

```html
<!-- People.vue -->
<template>
  <filter v-model="filter"></filter>
  <ul>
    <li v-for="person in filteredPeople" :key="person.name">
      {{ person.name }}
    </li>
  </ul>
</template>

<script>
  import Filter from "./Filter";

  export default {
    data() {
      return {
        filter: "",
        people: [
          /* ... */
        ]
      };
    },

    components: { Filter },

    computed: {
      filteredPeople() {
        // Return filtered `people` array result
      }
    }
  };
</script>
```

For now, we assume the `filter` prop is a plain string. The `v-model` property expands to a `:value` prop and an `@input` event listener.

```html
<filter v-model="filter"></filter>

<!-- Expands to... -->

<filter :value="filter" @input="filter = $event"></filter>
```

Inside the `Filter` component, we registered an `@input` listener to an `input` element, which emits the value to the parent component.

```html
<!-- Filter.vue -->
<template>
  <input
    type="search"
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
  export default {
    props: {
      value: { required: true, type: String }
    }
  };
</script>
```

This works great for simple inputs, but what if we want to expand our filter to an object?

```html
<!-- People.vue -->
<template>
  <filter v-model="filter"></filter>
  <!-- ... -->
</template>

<script>
  export default {
    data() {
      return {
        filter: {
          query: "",
          job: ""
        }
      };
    }

    // ...
  };
</script>
```

We're not allowed to modify props in Vue, so we need to emit a _modified copy_ of the `filter` prop from our `Filter` component.

```html
<!-- Filter.vue -->
<template>
  <div>
    <input
      type="search"
      :value="value.query"
      @input="$emit('input', {
        ...value,
        query: $event.target.value
      })"
    />
    <select
      :value="value.job"
      @input="$emit('input', {
        ...value,
        job: $event.target.value
      })"
    >
      <option value="">All</option>
      <option value="developer">Developer</option>
      <option value="designer">Designer</option>
      <option value="manager">Account manager</option>
    </select>
  </div>
</template>

<script>
  export default {
    props: {
      value: { required: true, type: Object }
    }
  };
</script>
```

This works, but `Filter` became a black box: it's not immediately clear what `value` contains. We need to dive into the components implementation details to discover it expects `query` and `job` keys.

We can solve this by down passing each filter key individually, and emitting multiple, key-specific events.

```html
<!-- People.vue -->
<template>
  <filter
    :query="filter.query"
    :job="filter.job"
    @queryinput="filter.query = $event"
    @jobinput="filter.job = $event"
  ></filter>
  <!-- ... -->
</template>
```

```html
<!-- Filter.vue -->
<template>
  <div>
    <input
      type="search"
      :value="query"
      @input="$emit('queryinput', $event.target.value)"
    />
    <select :value="job" @input="$emit('jobinput', $event.target.value)">
      <option value="">All</option>
      <option value="developer">Developer</option>
      <option value="designer">Designer</option>
      <option value="manager">Account manager</option>
    </select>
  </div>
</template>

<script>
  export default {
    props: {
      value: { required: true, type: String },
      job: { required: true, type: String }
    }
  };
</script>
```

We've greatly improved `Filter`'s public API. Someone using the component now knows it expects two distinct props: `query` and `job`.

Unfortunately, by making `Filter` more explicit, we've punished the consumer. The parent now needs to pass a prop and register an event listener for each `filter` key.

Compared to how concise `v-model` was, this feels like a regression. We had to invent our own API.

Vue provides a more generic alternative to `v-model`: the `.sync` modifier.

```html
<!-- People.vue -->
<template>
  <filter :query.sync="filter.query" :job.sync="filter.job"></filter>
  <!-- ... -->
</template>
```

`sync` works just like `v-model`, except it listens for an `update:[key]` event. The above expands to our two props, and two listeners.

```html
<!-- People.vue -->
<template>
  <filter
    :query="filter.query"
    :job="filter.job"
    @update:query="filter.query = $event"
    @update:job="filter.job = $event"
  ></filter>
</template>
```

If we rename the emitted events in `Filter`, we get the best of both words: _seemingly_ two way data binding while maintaining an explicit component API.

```html
<!-- Filter.vue -->
<template>
  <div>
    <input
      type="search"
      :value="query"
      @input="$emit('update:query', $event.target.value)"
    />
    <select :value="job" @input="$emit('update:job', $event.target.value)">
      <option value="">All</option>
      <option value="developer">Developer</option>
      <option value="designer">Designer</option>
      <option value="manager">Account manager</option>
    </select>
  </div>
</template>

<script>
  export default {
    props: {
      value: { required: true, type: String },
      job: { required: true, type: String }
    }
  };
</script>
```

When refactoring your UI to components, always keep in mind that props and events are your components public API.

Just like when you're modelling your application's domain, try to keep things explicit. Props and events should be enough to tell the outside world everything it needs to know about a component's behavior.
