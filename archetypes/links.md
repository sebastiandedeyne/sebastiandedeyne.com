---
title: "{{ replace .Name "-" " " | strings.FirstUpper }}"
slug: {{ .Name }}
date: {{ .Date }}
link:
tags:
---
