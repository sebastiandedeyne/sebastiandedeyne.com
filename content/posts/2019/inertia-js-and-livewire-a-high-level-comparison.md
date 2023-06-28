---
title: "Inertia.js and Livewire: a high level comparison"
slug: inertia-js-and-livewire-a-high-level-comparison
date: 2019-09-26
type: article
tags:
    - JavaScript
    - Inertia.js
    - Livewire
    - Laravel
---

Both Inertia.js and Livewire have been in the spotlight the past few months. The two libraries often get put next to each other because of their (coincidentally) simultaneous releases.

I've seen many people compare the two, or ask if they can be used together. This post showcases their similarities and differences, and should help you understand which problems they each solve best.

<!--more-->

<aside>
<p>Disclaimer: I'm the maintainer of Inertia's React adapter, and I'm using Inertia on a daily basis. My Livewire experience is limited to playing around with it on a small scale, although I do believe I have a good understanding of it's high level architecture and intentions. That said, this is meant to be an objective post, I don't want to push you in either direction without understanding the tradeoffs.</p>
<p>Second disclaimer: Both libraries are still young, so whatever caveats and limitations I mention are subject to change.</p>
</aside>

## Setting the stage

Inertia and Livewire were both born out of frustration with the current JavaScript landscape. Frameworks like Vue.js or React enable us to build incredible user interfaces, but the cost in complexity of building a SPA is incredibly high.

I see Inertia and Livewire as opposite solutions to similar problems. In a nutshell, Livewire enables you to build user interfaces by creating special components in Blade. You don't need to write any JavaScript unless strictly necessary. Inertia replaces Blade views altogether by returning JavaScript components from controller actions. Those components can be built with your frontend framework of choice.

Livewire is a Laravel library, while Inertia has adapters for several server and client frameworks. That said, this comparison assumes you want to use Laravel on the backend.

## More or less JavaScript

Let's start with Livewire. Livewire is invisible at first. You build your application with Blade like you're already used to. Need to add something interactive? Sprinkle in some basic JavaScript, or build a Livewire component.

Livewire components can be embedded in your existing views:

```html
@livewire('counter')
```

They exist out of a plain PHP file to control the data and a Blade file to control the template.

```php
<?php

use Livewire\Component;

class Counter extends Component
{
    public $count = 0;

    public function render()
    {
        return view('livewire.counter');
    }
}
```

```html
<div>
  <span>{{ $count }}</span>
</div>
```

You can bind data and events to DOM nodes using `wire:` directives like `wire:click`. Events trigger an HTTP request and invoke their associated handler method on the component class written in PHP.

```php
<?php

use Livewire\Component;

class Counter extends Component
{
    public $count = 0;

    public function increment()
    {
        $this->count++;
    }

    public function decrement()
    {
        $this->count--;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

```html
<div>
    <button wire:click="increment">+</button>
    <button wire:click="decrement">-</button>

    <span>{{ $count }}</span>
</div>
```

This allows you to write interactive components without writing any JavaScript. State and event handling gets lifted to the component class on the server.

When it comes to writing JavaScript, Inertia is Livewire's polar opposite. After installing Inertia you stop writing Blade views altogether.

In contrast to Livewire, you return components from your controller actions.

```php
<?php

class UsersController
{
    public function index()
    {
        return inertia('Users/Index', [
            'users' => User::all(),
        ]);
    }
}
```

Inertia will render a component written in Vue (or your framework of choice) matching the component path you specified in the response.

```html
<template>
  <table>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <!-- … -->
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['users'],
}
</script>
```

You handle user interactions on the client like you're already used to with Vue. If you need to transition to a new page, use the `InertiaLink` component. This will request a JSON response with AJAX instead of triggering a full page visit, giving your application a smooth SPA-like experience.

```html
<template>
  <table>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>
          <InertiaLink :href="`/users/${user.id}`">
            {{ user.name }}
          </InertiaLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['users'],
}
</script>
```

Inertia can also be used to fetch fresh data for the current page.

```html
<template>
  <div>
    <input type="search" v-model="search">
    <table>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>
            <InertiaLink :href="`/users/${user.id}`">
              {{ user.name }}
            </InertiaLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['users'],

  data() {
    return {
      search: '',
    };
  },

  watch: {
    search(search) {
      Inertia.visit(
        `window.location.href?search=${search}`,
        { preserveState: true }
      );
    }
  }
}
</script>
```

## Developer experience

If you decide to use Livewire, you can progressively add Livewire components throughout your application. Data fetching is also managed in the Livewire component PHP class, so it's separate from your application's controllers. That means you can embed multiple components on a single page, and they'll each have their state and lifecycle.

With Inertia you pretty much need to go all-in (at least per section of your application). Data fetching happens in controllers like you're already used to, but that means you need to think more in "pages" and less in "components" in the context of the client-server communication.

Both of these approaches have a similar outcome: you end up writing a lot less AJAX-only endpoints.

Take a classic data table component as an example. In a traditional application, you'd have a controller action to return the base view and another action to fetch data asynchronously.

With Livewire you'd write a data table Livewire component that takes care of both the template and the data fetching.

With Inertia you'd write a single controller action that returns the view with the relevant data. This works because every subsequent request is already an AJAX request.

## Render performance

JavaScript is a hard requirement for Inertia to render anything at all. If you need your server to return a fully rendered document, Inertia is a no go for now. The lack of server rendering changes the initial load experience, and can potentially impact SEO. A server-rendered document will always display faster than one that only renders on the client after all assets are downloaded and executed.

This is a much-discussed tradeoff when talking about SPAs. In the context of an interactive web application, the added load time is often worth it for the optimizations you can do on subsequent renders. Note that the performance penalty for Inertia is a lot smaller than for SPAs. SPAs need to make an additional AJAX request on every page to fetch data, while data is immediately included in an Inertia response.

Livewire is a whole different beast. Since Livewire renders everything on the server, you'll always have a short time to [first meaningful paint](https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint). After the content's downloaded, Livewire will execute its scripts and the page will be interactive. Assuming you're not loading huge amounts of JavaScript, the [time to interactive](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive) of Inertia and Livewire are quite similar.

## Should I use Inertia or Livewire?

The usual answer to all programming questions in the universe: it depends.

### From a personal preference perspective

Aside from the context of your project: if you prefer developing in Vue, React, or another frontend framework, you'll prefer Inertia. If you love Blade and want to write less JavaScript, Livewire would probably be your weapon of choice. This is, however, a highly subjective measure.

### From a technical perspective

If you're building a marketing-heavy landing page, a blog, or anything else with a higher bounce rate by nature, the longer time to first meaningful paint can hurt. Livewire is a better fit for these. The same applies to pages that must display content without relying on JavaScript.

If you're building an app it's a more nuanced decision.

A big selling point for Livewire is that each component has its lifecycle. This is pretty big you have a lot of blocks that need to communicate to the server individually.

Inertia keeps you limited to pages, but that makes the whole thing more familiar and gives you that smooth SPA-like experience throughout your application.

### From an onboarding perspective

If you're already building apps with Laravel and Vue, Inertia feels like a step up from mounting components in Blade views without drastically changing the way you need to structure your application. Livewire's model is a bigger shift away from the MVC monolith we're used to building.

## Closing thoughts

Keep in mind that this is a very high-level overview of the two. Both have a ton of small features that spark joy in day-to-day development.

One thing Inertia and Livewire have in common: they're both young and _very_ exciting pieces of technology.

If Livewire sounds interesting to you, take a look at [laravel-livewire.com](https://laravel-livewire.com). Livewire is created and maintained by [Caleb Porzio](https://calebporzio.com). If you want to learn more about Inertia.js, I highly recommend reading ["Server-side apps with client-side rendering"](https://reinink.ca/articles/server-side-apps-with-client-side-rendering) and ["Introducing Inertia.js"](https://reinink.ca/articles/introducing-inertia-js) from its author [Jonathan Reinink](https://reinink.ca).

<aside>A big thank you to both Caleb and Jonathan for reviewing this post!</aside>
