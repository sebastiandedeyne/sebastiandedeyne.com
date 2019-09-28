---
date: 2019-04-26
title: Why I prefer React over Vue
categories: ["articles"]
keywords:
    - JavaScript
    - React
    - Vue.js
---

Vue is the default JavaScript framework for Laravel apps. Being part of  the Laravel community, I often get the question why I prefer React, so I've decided to write down a few standout reasons.

<!--more-->

<aside>
<strong>BIG FAT DISCLAIMER!</strong>
<p>Vue is a great framework, I just personally prefer React in most cases. This post isn't meant to convince you to use React either. I just want to share the reasoning behind my choice. If you're looking for an more eloquent comparison between Vue and React, <a href="https://www.reddit.com/r/javascript/comments/8o781t/vuejs_or_react_which_you_would_chose_and_why/e01qn55/">this Reddit comment</a> is amazing.</p>
</aside>

Before I get started, a few notes about how I use React:

- I regularly use TypeScript
- I pretty much never use class components, only functions
- If I need a state management library, I use Redux + Immer, although I generally try to stick with context and local state
- I rarely build headless SPA's, apps I build are generally hybrid server/client apps with a Laravel backend

Let's go!

## Small API surface

React has a very small API surface. Things I regularly import:

- `Fragment`
- `createContext`
- Hooks (`useState`, `useEffect`, `useContext`,…)

That's pretty much all I need to build my app.

On the other hand, Vue has a vast amount of [component options](https://vuejs.org/v2/api/#Options-Data), [instance properties](https://vuejs.org/v2/api/#Instance-Properties), and [template directives](https://vuejs.org/v2/api/#Directives) to remember. I prefer React's modest amount of building blocks.

Vue uses a special [syntax to listen to events](https://vuejs.org/v2/guide/events.html#ad) and [custom events](https://vuejs.org/v2/guide/components-custom-events.html#ad). Events listeners are essentially callbacks that get passed down to child components. React uses props for everything, so that's one less thing to learn.

The same can be said about [slots](https://vuejs.org/v2/guide/components-slots.html#ad). Slots don't really exist in React, because props already solve the problem.

```html
<template>
  <button @click="$emit('click', $event')">
    <slot />
  </button>
</template>
```

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

## Functions over classes

The majority of components I write are essentially functions that receive props and return a view. React promotes the use of function components, so there's no syntax overhead of using classes or objects. No more reasoning about the `this` keyword either, simply `props => view`.

```js
function Avatar({ user }) {
  return (
    <img
      src={user.avatarUrl}
      alt={`User ${user.username}'s avatar`}
    />
  );
}
```

## JSX

React uses JSX for templating, which is a superset of JavaScript. Having templates embedded in a close-to-JavaScript syntax yields a major benefit: it's generally easy to use JavaScript tooling with JSX, because JSX files can be transpiled by Babel.

I'm not gonna lie, sometimes I miss a cleaner way to do an `if` statement in my templates, but overall, I'm a happy JSX user.

<aside>
I know you can use JSX with Vue, <a href="https://sebastiandedeyne.com/vue-templates-in-jsx">I've written about it</a>, but I generally prefer to stick with the defaults supplied by the framework.
</aside>

To illustrate, here's a small `.vue` vs `.jsx` comparison:

```html
<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.firstName }} {{ user.lastName }}
    </li>
  </ul>
</template>

<script>
export default {
  props: ['users']
}
</script>
```

```js
function UsersList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.firstName} {user.lastName}
        </li>
      ))}
    </ul>
  );
}
```

Not having directives like like `v-for` and `v-if` for everyday operations adds to JSX's learning curve, but I believe it's better in the long run to stick with language features.

## Fragments

In React, components don't have the limitation of having to return exactly one DOM node. You can return a list of nodes, or just text wrapped in a fragment.

```js
function UserDetails({ user }) {
  return (
    <>
      {user.firstName} {user.lastName}
      <span>{user.age}</span>
    </>
  );
}
```

This sounds trivial at first, but it's really nice to have your app output proper HTML instead of a `div` soup. It also plays well with CSS grid, because wrapper `div`s are the bane of grid's existence.

At the time of writing, this isn't fully supported in Vue, only in some [select cases](https://vuejsdevelopers.com/2018/09/11/vue-multiple-root-fragments/).

## It plays *very* well with TypeScript

Since React is *Just JavaScript*, it plays very well with TypeScript too. Type inference works incredibly good.

Consider a generic list component with a function a `renderItem` render prop:

```js
type Props = {
  items: T;
  renderItem: (item: T) => React.Node;
}

function GenericList<T>({ items, renderItem }: Props) {
  return (
    <ul>
      <li>
        {items.map((item, i) => (
          <li key={i}>
              {renderItem(item)}
          </li>
        ))}
      </li>
    </ul>
  );
}
```

Now let's use that to build a list of users:

```js

type User = {
  firstName: string;
  lastName: string;
}

type Props = {
  users: Array<User>;
}

function UsersList({ users }: Props) {
  return (
    <GenericList
      items={users}
      renderItem={user => (
        <>{user.firstName} {user.lastName}</>
      )}
    />
  );
}
```

Because TypeScript's type inference with generics is so good, the `user` parameter in `renderItem` will be properly inferred, and `user.firstName` and `user.lastName` will be auto-completed in my editor. Hooray!

Hooks are also a great match with TypeScript:

```js
function SignupForm() {
  const [email, setEmail] = useState('');

  // ...
}
```

Because we passed a string as `useState`'s initial value, TypeScript knows that in the rest of the component, `email` will be a string and `setEmail` expects a string.

Using TypeScript with Vue is possible, but you need to write your components with something like [`vue-class-component`](https://github.com/vuejs/vue-class-component), which looks a lot different than standard Vue components.

## React solves problems on a fundamental level

This is the single biggest reason why I love React. React rethinks problems from first principles. From a recent [Twitter thread](https://twitter.com/dan_abramov/status/1120971795425832961) by Dan Abramov:

> Showing updates as fast as possible seems like an obvious goal. But is it, always? I don’t think it is when you fetch (IO). User perception research shows that a fast succession of loading states (flashing and hiding spinners) makes the transition feel *slower*.

React has a great track record of introducing low level "primitives" for us to solve high level problems. The recent addition of hooks are a prime example of that.

## Closing thoughts

The way React handles templates, or the way props and state are declared versus how Vue does those things is superficial. I *prefer* the React "syntax", but they're not going to affect the the way I build apps.

Following React's evolution the past year or two I've noticed a few core ideas:

- The API stays simple and declarative with a strong focus on composability
- The React team generally rethinks things from the bottom up

That's why I love React.
