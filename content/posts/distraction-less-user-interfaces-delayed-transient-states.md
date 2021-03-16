---
date: 2018-07-31
title: "Distraction-less user interfaces: Delayed transient states"
categories: ["articles"]
keywords:
  - ux
  - JavaScript
  - Vue.js
---

I have a specific pet peeve with user interfaces: things that draw my attention when they don't need to. In any graphical interface, movement is distraction. Our eyes are naturally drawn to anything in motion.

Motion is a powerful tool. We can abuse this distraction to attract our users to a certain place: a notification, an added list item after a background refresh, etc. Let's look into the movement behind a form submission. Below are three dummy forms, each with a different server response time.

<!--more-->

<p data-height="265" data-theme-id="light" data-slug-hash="pZpWQw" data-default-tab="result" data-user="sebdd" data-pen-title="pZpWQw" class="codepen">See the Pen <a href="https://codepen.io/sebdd/pen/pZpWQw/">pZpWQw</a> by Sebastian De Deyne (<a href="https://codepen.io/sebdd">@sebdd</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

In the first two examples, the submit button changed twice in the blink of an eye. We might even think we missed the first state change because it happened so fast. We saw _something_ happen though, and we're probably able place it into perspective:

_“That happened so fast, but everything went well. I suppose what I missed wasn't that important after all.”_

It's a near-subconscious train of thought, but the fact that we needed to make that deduction means the interface momentarily distracted us. Let's fix this.

## Identifying the problem

We have a submit button. It's enabled by default. While the form is being submitted, it's temporarily disabled. When the server responds, it's re-enabled. While the form is being submitted, it's in a _transient state_ between unsaved and saved.

The problem is: our app is too fast! That doesn't sound like a problem, but is in the context of an interface. In the transient state, the interface is trying to communicate something: _"I'm busy."_ However, the application is so fast that the user doesn't care about it being busy. It completed the task so swiftly that the user didn't even get the chance to react to the transient state.

If an interface doesn't need to talk to users, it shouldn't.

Unfortunately, sometimes users are on a slow network connection. In that case, we have to notify them that something is indeed happening. A transient _"I'm busy"_ state makes sense here, or the user thinks something's wrong.

To summarize: we _don't_ want a visible disabled state when the network conditions are in our favor, but we _do_ need one when things are running slow.

Solution: delay the visible transient state.

When the network is fast, the transition is seamless. When the network is slow, the interface will tell us it's working on it.

<p data-height="265" data-theme-id="light" data-slug-hash="VByrVj" data-default-tab="result" data-user="sebdd" data-pen-title="Delayed transient states 2" class="codepen">See the Pen <a href="https://codepen.io/sebdd/pen/VByrVj/">Delayed transient states 2</a> by Sebastian De Deyne (<a href="https://codepen.io/sebdd">@sebdd</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Let's build this. We'll be using Vue to build an `AjaxForm` component, but these concepts can be applied in any other environment.

## Show me the code!

Let's start with a basic `AjaxForm` implementation.

```html
<template>
  <form @submit="submit">
    <button type="submit" :disabled="status === 'submitting'">
      {{ buttonText }}
    </button>
  </form>
</template>

<script>
  export default {
    data: () => ({
      status: "idle" // or 'submitting' or 'submitted'
    }),

    computed: {
      buttonText() {
        if (this.status === "submitting") {
          return "Busy...";
        }

        if (this.status === "submitted") {
          return "Thanks!";
        }

        return "Submit";
      }
    },

    methods: {
      submit() {
        this.status = "submitting";

        doSubmit()
          .then(() => {
            this.status = "submitted";
          })
          .catch(() => {
            this.status = "idle";
          });
      }
    }
  };
</script>

<style scoped>
  button[disabled] {
    opacity: 0.5;
  }
</style>
```

Our form has a submit button, with a dynamic text depicting the form status. When the button is clicked, the form gets submitted, and the button will be disabled until the form is idle again.

This implementation will give our users motion sickness: if the form takes 100ms to submit, the button will go from "Submit" to "Busy.." to "Thanks!" in that very short time span, probably also changing visual styles like opacity along the way.

To fix this, wa can modify our script to wait a certain amount of time, let's say 400ms, until we disable the button. That way, the _"Busy..."_ state change will never be visible to the user unless the submission takes longer than 400ms.

```html
<script>
  export default {
    // ...

    methods: {
      submit() {
        const busyTimeout = window.setTimeout(() => {
          this.status = "submitting";
        }, 400);

        doSubmit()
          .then(() => {
            window.clearTimeout(busyTimeout);

            this.status = "submitted";
          })
          .catch(() => {
            window.clearTimeout(busyTimeout);

            this.status = "idle";
          });
      }
    }
  };
</script>
```

We'll now show _"Busy..."_ after 400ms, only if the form submission hasn't completed (successfully or not) in that time.

Unfortunately, it looks like we just introduced a bug. If a user clicks the button again within those 400ms, the form will be submitted multiple times. We didn't immediately disable the button like in the first example. We're using the "status" property for two concerns: the form status and a network health check of some sorts. Let's split it up into two concepts and squash our bug.

```html
<template>
  <form @submit="submit">
    <button
      type="submit"
      :disabled="status === 'submitting'"
      :class="{ 'is-disabled': isSlowRequest }"
    >
      {{ buttonText }}
    </button>
  </form>
</template>

<script>
  export default {
    data: () => ({
      status: "idle", // or 'submitting' or 'submitted'
      isSlowRequest: false
    }),

    computed: {
      buttonText() {
        if (this.isSlowRequest) {
          return "Busy...";
        }

        if (this.status === "submitted") {
          return "Thanks!";
        }

        return "Submit";
      }
    },

    methods: {
      submit() {
        this.status = "submitting";

        const slowRequestTimeout = window.setTimeout(() => {
          this.isSlowRequest = true;
        }, 400);

        doSubmit()
          .then(() => {
            window.clearTimeout(slowRequestTimeout);
            this.isSlowRequest = false;

            this.status = "submitted";
          })
          .catch(() => {
            window.clearTimeout(slowRequestTimeout);
            this.isSlowRequest = false;

            this.status = "idle";
          });
      }
    }
  };
</script>

<style scoped>
  button.is-disabled {
    opacity: 0.5;
  }
</style>
```

Above, we introduced an `isSlowRequest` property to take care of how we want to visually indicate the busy state. The `status` property is now immediately updated in the first example, so the button gets properly disabled now.

Note that we're also using an `is-disabled` class so the button there's no immediate visual change when it gets disabled in the DOM.

I'm using similar `setTimeout` techniques in a bunch of projects, and it's a great trick to remove unnecessary distraction.
