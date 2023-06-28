---
date: 2017-10-24
title: Debugging the dreaded "Class log does not exist" error in Laravel
type: article
tags:
  - Laravel
  - PHP
---

Every now and then I come accross a `Class log does not exist` exception in Laravel. This particular exception is thrown when something goes wrong really early in the application, before the exception handler is instantiated.

Whenever I come across this issue I'm stumped. Mostly it's related to an invalid configuration issue or an early service provider that throws an exception. I always forget how to debug this, so it's time to document my solution for tracking down the underlying error.

<!--more-->

We can't see what's actually going wrong, because Laravel throws a second exception while trying to log and display the initial error. We end up with `Class log does not exist` because Laravel wants to log the exception before the logger class exists.

To find the original exception, we need to trace down the method that catches it. This happens in the `handle` method in the current `Kernel` class. That's `Illuminate\Foundation\Http\Kernel` if we're accessing our app via HTTP, or `Illuminate\Foundation\Console\Kernel` when using Artisan.

Let's go throught the console kernel's `handle` method.

```php
<?php

/**
 * Run the console application.
 *
 * @param  \Symfony\Component\Console\Input\InputInterface  $input
 * @param  \Symfony\Component\Console\Output\OutputInterface  $output
 * @return int
 */
public function handle($input, $output = null)
{
    try {
        $this->bootstrap();

        return $this->getArtisan()->run($input, $output);
    } catch (Exception $e) {
        $this->reportException($e);

        $this->renderException($output, $e);

        return 1;
    } catch (Throwable $e) {
        $e = new FatalThrowableError($e);

        $this->reportException($e);

        $this->renderException($output, $e);

        return 1;
    }
}
```

The exception will end up in one of the two `catch` blocks. By adding a quick dump after them, we can quickly inspect the real exception.

```php
<?php

try {
    $this->bootstrap();

    return $this->getArtisan()->run($input, $output);
} catch (Exception $e) {
    die("{$e->getMessage()} {$e->getTraceAsString()}");

    $this->reportException($e);

    $this->renderException($output, $e);

    return 1;
} catch (Throwable $e) {
    die("{$e->getMessage()} {$e->getTraceAsString()}");

    $e = new FatalThrowableError($e);

    $this->reportException($e);

    $this->renderException($output, $e);

    return 1;
}
```

That's all! Now we'll be able to see a meaningful message in our output instead of an irrelevant `Class log does not exist` trace.

Don't forget to remove the calls when your application's back up and running!
