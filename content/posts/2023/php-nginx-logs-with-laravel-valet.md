---
title: "PHP & NGINX logs with Laravel Valet"
slug: php-nginx-logs-with-laravel-valet
date: 2023-03-17
type: article
tags:
  - Laravel
  - Valet
  - PHP
  - NGINX
---

Putting this in a blog post because I _always_ forget.

To view PHP logs from Laravel Valet:

```sh {.short}
open ~/.config/valet/Log/php-fpm.log
```

To view NGINX logs from Laravel Valet:

```sh {.short}
open ~/.config/valet/Log/nginx-error.log
```
