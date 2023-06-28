---
title: "Non-reactive data in Alpine.js"
slug: non-reactive-data-in-alpine-js
date: 2022-06-01
categories: ["articles"]
tags:
  - Alpine
---

Sometimes you want to store data in your Alpine component without wrapping it in a JavaScript proxy (which is how Alpine keeps everything [reactive](https://alpinejs.dev/advanced/reactivity)).

For example, third party libraries might have issues when wrapped in a proxy. Chart.js is one of those. If you store a Chart.js instance in Alpine data, the chart will error.

<!--more-->

To prevent Alpine from making the property reactive, the property shouldn't be on the data object in the first place. One way to create state without storing it on an object is with the [revealing module pattern](https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch09s03.html).

```html
<div x-data="chart">
  <canvas x-ref="canvas"></canvas>
</div>
```

```js
Alpine.data('chart', () => {
  let chart;

  return {
    init() {
      chart = new Chart(this.$refs.canvas, { … });
    },

    update() {
      // Fetch new data…

      chart.update();
    },
  };
});
```

With the revealing module pattern, the data is stored in a regular variable, and privately available in the component.

If you need to expose it to the outside world, you can add a getter.

```js
Alpine.data('chart', () => {
  let chart;

  return {
    init() {
      chart = new Chart(this.$refs.canvas, { … });
    },

    // …

    get chart() {
      return chart;
    },
  };
});
```
