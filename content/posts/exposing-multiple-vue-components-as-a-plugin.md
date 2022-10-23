---
date: 2017-06-28
title: Exposing multiple Vue components as a plugin
subtitle: Written for Vue ^2.0
categories: ["articles"]
tags:
  - Vue.js
---

Quick Vue tip for package authors! If you publish a package that exposes multiple Vue components, you can write a small plugin to install them all at once.

<!--more-->

```js
import Vue from "vue";
import MyPackage from "my-package";

Vue.use(MyPackage);

new Vue({ el: "#app" });
```

```html
<div id="app">
  <my-package-component></my-package-component>
  <my-other-package-component></my-other-package-component>
</div>
```

We recently published a [tabs package](https://github.com/spatie/vue-tabs-component). Initially, users needed to register two components in order to create a tabular interface: `Tabs`, which acts as a container, and `Tab`, which defines a single tab and its contents in the interface.

```js
import Vue from "vue";
import { Tabs, Tab } from "vue-tabs-component";

Vue.component("tabs", Tabs);
Vue.component("tab", Tab);

new Vue({ el: "#app" });
```

```html
<div id="app">
  <tabs> <tab title="Hello!"> Hello, world! </tab> </tabs>
</div>
```

Since developers are most likely going to use both components together, and there's a fair chance that they'd want to register them globally like in the example, it made sense to provide some sort of auto-install option.

The cleanest way to provide automatic component registration appeared to be by shipping a Vue plugin with the package.

Here's what the packages' default export looks like now:

```js
import Tab from './components/Tab';
import Tabs from './components/Tabs';

export default {
    install (Vue) {
        Vue.component('tab', Tab);
        Vue.component('tabs', Tabs);
    }
}

export { Tab, Tabs };
```

Like this, all it takes is a `Vue.use` to register all the packages' components!

```js
import Vue from 'vue';
import Tabs from 'vue-tabs-component';

Vue.use(Tabs);

new Vue({ el: '#app' });
```

If developers want more fine grained control over the package features they do and don't want, they can still use the named exports.

```js
import Vue from 'vue';
import { Tabs } from 'vue-tabs-component';
import MyTab from './MyTab';

Vue.component('tabs', Tabs);
Vue.component('tab', MyTab);

new Vue({ el: '#app' });
```

<aside>
Want an in-depth explanation of Vue plugins? There's a <a href="https://vuejs.org/v2/guide/plugins.html">guide</a> for that.
</aside>

---

_Credit to [@cristijora](https://github.com/cristijora) for pointing out that this is possible in a [vue-tabs-component auto installation PR](https://github.com/spatie/vue-tabs-component/pull/7#issuecomment-302302696)._
