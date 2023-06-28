---
title: "Live updating Oh Dear! status pages"
date: 2019-09-23
type: article
tags:
    - JavaScript
---

Last week Oh Dear! launched a new [status pages feature](https://ohdear.app/blog/introducing-status-pages-for-all-our-users). I designed them and implemented their frontend. Here's a live example on [status.flareapp.io](https://status.flareapp.io).

![](/media/oh-dear-status-page-online.jpg)

We were originally going to use Vue for the pages, so we could make the entire view reactive so we could easily fetch and update data with AJAX or websockets. I started building the status page view, but quickly became hesitant about the decision to use Vue. It didn't feel like the right tool for the job.

<!--more-->

There's a noticeable performance impact when using a frontend framework. Vue requires quite some kilobytes of JavaScript that needs to be loaded, parsed and executed. We also wouldn't be able to server side render the data, so the page would be blank until everything was loaded. Dropping Vue would provide an overall snappier experience.

Secondly, since this is a status page we were aiming to build it as resilient as possible. What's the point of a status page that's down. Dropping the JavaScript dependency to display the pages means there's one thing less that can go wrong.

That was enough for us to reconsider our original idea. Instead of relying on a framework, we used 20 lines of good old vanilla JavaScript.

```js
function autorefresh() {
  fetch('')
    .then(response => response.text())
    .then(content => {
      const parser = new DOMParser();
      const html = parser.parseFromString(content, 'text/html');

      document.title = html.title;
      document.querySelector('.content').innerHTML = html.querySelector('.content').innerHTML;
    });
}

window.setInterval(autorefresh, 30 * 1000);

window.addEventListener('offline', () => {
  document.getElementById('autorefresh-online').classList.add('hidden');
  document.getElementById('autorefresh-offline').classList.remove('hidden');
});

window.addEventListener('online', autorefresh);
```

The `autorefresh` function fetches the current URL and parses its response as text.

```js
fetch('')
  .then(response => response.text())
  .then(content => {
    //
  });
```

After the content is retrieved, the native `DOMParser` API is responsible for parsing the text into an HTML document. We can now query this document just like the live DOM, and replace the current document's values with fresh ones.

```js
const parser = new DOMParser();
const html = parser.parseFromString(content, 'text/html');

document.title = html.title;
document.querySelector('.content').innerHTML = html.querySelector('.content').innerHTML;
```

The `autorefresh` function gets called every 30 seconds in an interval.

```js
window.setInterval(autorefresh, 30 * 1000);
```

The template on the server always displays a fresh timestamp. That means the timestamp gets updated whenever the page is refreshed in the background.

```html
<p id="autorefresh-online" class="inline-block rounded p-2 leading-snug text-left text-xs">
    Live updates enabled
    <br>
    Last checked
    <time datetime="{{ now($statusPage->timezone)->toISOString() }}" class="font-bold tabular-nums">
        {{ now($statusPage->timezone)->format('H:i:s T') }}
    </time>
</p>
```

When the browser's offline, we wanted to visualize that live updates are disabled. I added a hidden by default "Offline" block to the template.

```html
<p id="autorefresh-online" class="inline-block rounded p-2 leading-snug text-left text-xs">
    <!---->
</p>
<p id="autorefresh-offline" class="inline-block hidden bg-red-600 font-bold px-1 rounded text-red-100 text-sm">
    Offline
</p>
```

When the browser goes offline, the "Last checked" block becomes hidden, and the "Offline" block becomes visible.

```js
window.addEventListener('offline', () => {
  document.getElementById('autorefresh-online').classList.add('hidden');
  document.getElementById('autorefresh-offline').classList.remove('hidden');
});
```

![](/media/oh-dear-status-page-offline.jpg)

When the browser comes back online, it triggers a new `autorefresh` call. By fetching fresh HTML from the server, the "Offline" block gets replaced with the "Last checked" block again.

```js
window.addEventListener('online', autorefresh);
```

And that's how everything's tied together! I'm glad we took a step back to reconsider how we could solve the problem, instead of defaulting to more complicated tools like frameworks or websockets.
