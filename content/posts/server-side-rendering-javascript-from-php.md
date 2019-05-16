---
date: 2018-03-11
title: Server side rendering JavaScript from PHP
categories: ["articles"]
tags:
  - php
  - javascript
  - ssr
---

Server side rendering is a hot topic when it comes to client side applications. Unfortunately, it's not an easy thing to do, especially if you're not building things in a Node.js environment.

I published two libraries to enable server side rendering JavaScript from PHP: [spatie/server-side-rendering](https://github.com/spatie/server-side-rendering) and [spatie/laravel-server-side-rendering](https://github.com/spatie/laravel-server-side-rendering) for Laravel apps.

Let's review some server side rendering concepts, benefits and tradeoffs, and build a server renderer in PHP from first principles.

<!--more-->

## What is server side rendering?

A single page app (commonly known as an SPA) is a client-side rendered app. It's an application that runs solely in your browser. If you're using a framework like React, Vue.js or AngularJS, the client renders your app from scratch.

### Browsers have work to do

A browser needs to go through a few steps before a SPA is booted and ready for use.

- Download scripts
- Parse scripts
- Run scripts
- Retrieve data (optional, but common)
- Render the app in a previously empty container _(first meaningful paint)_
- Ready! _(time to interactive)_

The user doesn't see anything meaningful until the browser has fully rendered the app, which takes a while! This creates a noticeable delay until the [first meaningful paint](https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint) and takes away from the user experience.

This is where server side rendering (commonly known as SSR) comes in. SSR prerenders the initial application state on your server. Here's what the browser's to-do list looks like _with_ server side rendering:

- Render incoming HTML from the server _(first meaningful paint)_
- Download scripts
- Parse scripts
- Run scripts
- Retrieve data
- Make the existing HTML interactive
- Ready! _(time to interactive)_

Since the server provides a prerendered chunk of HTML, the user doesn't need to wait until everything's complete to see something meaningful. Note that the [time to interactive](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive) is still at the end of the line, but the _perceived_ performance got a huge boost.

### Server side rendering benefits

Server side rendering's main benefit is an improved user experience. SSR is also a must-have if you're dealing with older web crawlers that can't execute JavaScript. The crawlers will be able to index a rendered page from the server instead of a nearly empty document.

## How do you server side render things?

It's important to remember that server side rendering is not trivial. Your application suddenly runs in both browser and server environments. If you rely on DOM access in your app, you need to ensure that those calls won't be fired on the server, because there's no DOM API available.

### Infrastructure complexity

You've decided to server side render your client-side application. If you're reading this article, you're probably building the majority of your app with PHP. Your server rendered SPA needs to run in a Node.js environment, so you'll need to maintain a second application.

You'll need a bridge between the two apps for them to communicate and share data: you'll need an API. Building a stateless API is _hard_ compared to a stateful application. You'll need to deal with new concepts like authentication via JWT or OAUTH, CORS, REST calls. These are all non-trivial to add to an existing application.

Benefits don't exist without tradeoffs. We've established that SSR enhances your app's user experience, but SSR doesn't come without costs.

### Server side rendering tradeoffs

There's an extra step on the server. It'll have an increased load and pages will have slightly increased response times. The latter won't affect the user because the first meaningful paint becomes immediate.

You'll probably render your SPA in a Node.js application. If you're not writing your backend in JavaScript, you're introducing infrastructure complexity.

Let's simplify our infrastructure needs. Let's find a way to server side render a client side app in the PHP environment we already have.

## Rendering a JavaScript application in PHP

We need to gather three key ingredients to render a SPA on the server:

- An engine that can execute JavaScript
- A script to render the app on the server
- A script to render & run our app on the client

### SSR scripts 101

<aside>
The following examples use Vue.js. Don't worry if you're used to working with other frameworks like React. The core concepts are very similar and everything should look familiar.
</aside>

For simplicity's sake, we're gonna build a classic "Hello, world!" example.

Here's what our app looks like without SSR in mind:

```js
// app.js
import Vue from "vue";

new Vue({
  template: `
    <div>Hello, world!</div>
  `,

  el: "#app"
});
```

This instantiates a Vue component with a template and renders the app in a container (an empty `div` with an `app` id).

If we'd run this script on the server, it would throw an error. We don't have any DOM access, so Vue would try to render the app in an element that can't ever exist.

Let's refactor our script to something we _can_ run on the server.

```js
// app.js
import Vue from "vue";

export default () =>
  new Vue({
    template: `
    <div>Hello, world!</div>
  `
  });

// entry-client.js
import createApp from "./app";

const app = createApp();

app.$mount("#app");
```

We split the previous script in two parts. The `app.js` file becomes a factory to create new app instances. A second script, `entry-client.js`, will run in the browser. It creates a new app instance with the factory and mounts it in the DOM.

Now that we can create an app without a DOM dependency, we can write a second script for the server.

```js
// entry-server.js
import createApp from "./app";
import renderToString from "vue-server-renderer/basic";

const app = createApp();

renderToString(app, (err, html) => {
  if (err) {
    throw new Error(err);
  }
  // Dispatch the HTML string to the client...
});
```

We imported the same app factory, but we're using a server renderer to render a plain HTML string. This string will contain a representation of the application's initial state.

We already have two of our three key ingredients: a server script and a client script. Now lets run them in PHP!

## Executing JavaScript

The first option that comes to mind to run JavaScript in PHP is V8Js. V8Js is a V8 engine embedded in a PHP extension which allows us to execute JavaScript.

Executing a script with V8Js is pretty straightforward. We can capture the result with output buffering in PHP and `print` in JavaScript.

```php
<?php

$v8 = new V8Js();

ob_start();

// $script contains the contents of the script we want to execute

$v8->executeString($script);

echo ob_get_contents();
```

```js
print("<div>Hello, world!</div>");
```

The drawback of this method is the need for a third-party PHP extension. Extensions could be hard or impossible to install on your system so it would be nice if there was an alternative.

An alternative way to run JavaScript would be with Node.js. We could spawn a Node process that runs our script and capture its output. Symfony's `Process` component does just what we need.

```php
<?php

use Symfony\Component\Process\Process;

// $nodePath is the path to the Node.js executable
// $scriptPath is the path to the script we want to execute

new Process([$nodePath, $scriptPath]);

echo $process->mustRun()->getOutput();
```

```js
console.log("<div>Hello, world!</div>");
```

Note that for Node we're calling `console.log` instead of `print`.

## Let's bring it all together!

One of the key concepts of the spatie/server-side-rendering package is the `Engine` interface. An engine is an abstraction of the above JavaScript execution.

```
namespace Spatie\Ssr;

interface Engine
{
    public function run(string $script): string;
    public function getDispatchHandler(): string;
}
```

The `run` method expects a script (script _contents_, not a path), and returns the execution result. `getDispatchHandler` allows the engine to declare how it expects the script to emit the output. A `print` function in the case of V8, or a `console.log` for Node.

A V8Js engine implementation isn't too fancy. It mostly resembles our above proof of concept, with some added error handling.

```php
<?php

namespace Spatie\Ssr\Engines;

use V8Js;
use V8JsException;
use Spatie\Ssr\Engine;
use Spatie\Ssr\Exceptions\EngineError;

class V8 implements Engine
{
    /** @var \V8Js */
    protected $v8;

    public function __construct(V8Js $v8)
    {
        $this->v8 = $v8;
    }

    public function run(string $script): string
    {
        try {
            ob_start();

            $this->v8->executeString($script);

            return ob_get_contents();
        } catch (V8JsException $exception) {
            throw EngineError::withException($exception);
        } finally {
            ob_end_clean();
        }
    }

    public function getDispatchHandler(): string
    {
        return 'print';
    }
}
```

Notice that we rethrow the `V8JsException` as our own `EngineError`. This way we can catch same exception with any engine implementation.

A Node engine is a bit more complex. Unlike V8Js, Node needs a _file_ to execute, not script contents. Before executing a server script, it needs to be saved to a temporary path.

```php
<?php

namespace Spatie\Ssr\Engines;

use Spatie\Ssr\Engine;
use Spatie\Ssr\Exceptions\EngineError;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class Node implements Engine
{
    /** @var string */
    protected $nodePath;

    /** @var string */
    protected $tempPath;

    public function __construct(string $nodePath, string $tempPath)
    {
        $this->nodePath = $nodePath;
        $this->tempPath = $tempPath;
    }

    public function run(string $script): string
    {
        // Generate a random, unique-ish temporary file path
        $tempFilePath = $this->createTempFilePath();

        // Write the script contents to the temporary file
        file_put_contents($tempFilePath, $script);

        // Create a process to execute the temporary file
        $process = new Process([$this->nodePath, $tempFilePath]);

        try {
            return substr($process->mustRun()->getOutput(), 0, -1);
        } catch (ProcessFailedException $exception) {
            throw EngineError::withException($exception);
        } finally {
            unlink($tempFilePath);
        }
    }

    public function getDispatchHandler(): string
    {
        return 'console.log';
    }

    protected function createTempFilePath(): string
    {
        return $this->tempPath.'/'.md5(time()).'.js';
    }
}
```

Besides the temporary path steps, the implementation looks pretty straightforward.

Now that we have a solid engine interface, we can write an actual renderer class. The following paragraphs highlight the basics of the `Renderer` class from the spatie/server-side-rendering package.

The renderer has one dependency: an `Engine` implementation.

```php
<?php

class Renderer
{
    public function __construct(Engine $engine)
    {
        $this->engine = $engine;
    }
}
```

If we were to write a render method, it'd need to execute a script that consists of two parts:

- Our application script
- A dispatch function to capture the rendered HTML

A simple `render` method looks like this:

```php
<?php

class Renderer
{
    public function render(string $entry): string
    {
        $serverScript = implode(';', [
            "var dispatch = {$this->engine->getDispatchHandler()}",
            file_get_contents($entry),
        ]);

        return $this->engine->run($serverScript);
    }
}
```

The method requires an entry path that points to our `entry-server.js` file.

We'll need some way to _dispatch_ the prerendered HTML from the script to the PHP environment. A function needs to be loaded before our server script to ensure it's available. The `dispatch` function contains the return value of the engine's `getDispatchHandler` method.

Remember our server's entry script? Let's call that newly added `dispatch` script with the prerendered application.

```js
// entry-server.js
import app from "./app";
import renderToString from "vue-server-renderer/basic";

renderToString(app, (err, html) => {
  if (err) {
    throw new Error(err);
  }
  dispatch(html);
});
```

The application script itself doesn't need any special treatment. A `file_get_contents` call will suffice.

We created a server renderer in PHP! The full `Renderer` implementation in spatie/server-side-rendering looks a bit different. There's better error handling and more features, including mechanics to share data between PHP and JavaScript. Browse through the [server-side-rendering codebase](https://github.com/spatie/server-side-rendering) if you're interested in the nitty gritty details.

## Think things through first

We reviewed server side rendering's benefits and tradeoffs. We know SSR adds complexity to an application's architecture and infrastructure. If server side rendering doesn't provide any value to your business, you probably shouldn't bother with it in the first place.

If you _do_ want to get started with server side rendering, read up on application architecture first. Most JavaScript frameworks have an in-depth guide on SSR. Vue.js has [an entire site](https://ssr.vuejs.org/en/) dedicated to SSR documentation. It explains pitfalls like data fetching and managing application for server rendered apps.

### Use a battle-tested solution if possible

There are many battle-tested solutions out there that provide a great SSR experience out of the box. Notable projects are [Next.js](https://github.com/zeit/next.js/) if you're building a React app, or [Nuxt.js](https://nuxtjs.org/) if you prefer Vue.

### Still here? Consider server side rendering from PHP

You have limited resources to manage the infrastructure complexity. You want to server render a component as part of a larger PHP app. You don't want to build and maintain a stateless API. If any of those reasons resonate with you, server rendering in PHP could be a viable solution.

I published two libraries to enable server side rendering JavaScript from PHP: [spatie/server-side-rendering](https://github.com/spatie/server-side-rendering) and [spatie/laravel-server-side-rendering](https://github.com/spatie/laravel-server-side-rendering) for Laravel apps. The Laravel package works with near-0 configuration. The generic package requires some setup depending on your environment. Don't be daunted though, everything's thorougly documented in the readme's.

If you'd rather see the libraries in action first, check out the [spatie/laravel-server-side-rendering-examples](http://github.com/spatie/laravel-server-side-rendering-examples) repository and follow the installation guide.

I hope these packages can be of help if you're considering SSR, and I'm looking forward to any questions or feedback on GitHub!
