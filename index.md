---
layout: default
title: Home
---

# Welcome to My Blog!

Here are my recent posts:

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}
