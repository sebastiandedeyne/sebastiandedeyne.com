---
title: "{{ replace .Name "-" " " | strings.FirstUpper }}"
slug: {{ .Name }}
date: {{ dateFormat "2006-01-02" .Date }}T08:00:00+02:00
link:
tags:
---
