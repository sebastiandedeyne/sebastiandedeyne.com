---
date: 2017-10-03
title: Nordic.js 2017 recap
categories: ["articles"]
tags:
  - javascript
  - conferences
---

Last month I travelled up north to my first JavaScript conference: Nordic.js. The entire conference was a great experience: the speakers, the location, the food ([kanelbullar!](https://twitter.com/marsjosephine/status/906141755569045504)), ... Here's a quick recap of my favorite talks.

<!--more-->

### Ben Schwarz: Beyond the bubble

Ben gave a talk about web performance, and how many developers are spoiled with their fast internet connections and high-end devices. The talk strikes a nice balance between statistics, practical tips, and general food for thought on optimizing your website's performance.

[VOD](https://www.youtube.com/watch?v=p5ctfOdAAM8) • [Slides](https://speakerdeck.com/benschwarz/beyond-the-bubble-1) • [@benschwarz](http://www.twitter.com/benschwarz)

### David Khourshid: Reactive Web Animations with RxJS

I really like the idea of functional reactive programming and have been looking into RxJS for a while now. Unfortunately, in my day to day work it's currently a solution looking for a problem.

David Khourshid whipped up an Apple TV-like component on stage to demonstrate how simple certain animation concepts become with RxJS.

[VOD](https://www.youtube.com/watch?v=lqzFSAY6Wog) • [@davidkpiano](http://www.twitter.com/davidkpiano)

<aside>
If reading is your thing, David wrote a similar <a href="https://css-tricks.com/animated-intro-rxjs/">guest post on CSS Tricks</a> earlier this year.
</aside>

### Harriet Lawrence: Sociolinguistics and the Javascript community: a love story

If you're a frequent open source contributor, you're probably spending quite some time communicating with others on GitHub. Harriet is a professional technical writer who's also a linguistics researcher. Combine those two and you've got yourself an expert on communication in the open source community.

[VOD](https://www.youtube.com/watch?v=ZrlIvclUBM0) • [@harrietgl](http://www.twitter.com/harrietgl)

### Léonie Watson: You're only supposed to blow the bloody doors off!

Léonie speaks and writes about web accessability. The gist of her talk is that using the wrong accessability enhancements, like using an aria attribute for something that doesn't need it, generally does more harm than not doing anything at all. Tread carefully!

[VOD](https://www.youtube.com/watch?v=1DUBBWiY-o8) • [@leoniewatson](http://www.twitter.com/leoniewatson)

### Mars Jullian: Best Practices for reusable UI components

Mars is a senior UI engineer at Netflix, and gave a presentation on how they build reusable UI components for the application we all know and love.

The major takeaways were that components should be self-sufficient and easy to integrate with. Another interesting tip she gave was to never include margin and padding—unless there's a border—in reusable components. Spacing around a component depends too much on context and should be solved by the parent component.

[VOD](https://www.youtube.com/watch?v=rMFI1HtuFv4) • [Slides](https://speakerdeck.com/marsjosephine/nordicjs-best-practices-for-reusable-ui-components) • [@marsjosephine](http://www.twitter.com/marsjosephine)

### Myles Borins: The hilarious misadventures of being a platform downstream from your language

I didn't have much of a clue on _how_ Node.js works under the hood. Myles gave us an overview on how it was born and which challenges the Node.js team needs to solve in order to keep up with the rest of the JavaScript ecosystem.

Even if you're not actively using Node.js, this is a very interesting talk on building and maintaining ecosystems.

[VOD](https://www.youtube.com/watch?v=kkHdhtzM0wk) • [Slides](https://kni.sh/nordicjs-2017/) • [@mylesborins](http://www.twitter.com/mylesborins)

### Rachel Andrew: Solving layout problems with CSS Grid and friends

If you're interested in CSS layout, Rachel Andrew is definitely one to follow. While I didn't really learn anything new about grid itself in this talk, it was nice to get an explanation on _why_ we need grid, and it's fundamental differences with other layout solutions like flexbox.

[VOD](https://www.youtube.com/watch?v=7ukHDpAqYe0) • [Slides](https://www.slideshare.net/rachelandrew/solving-layout-problems-with-css-grid-friends-nordicjs) • [@rachelandrew](https://twitter.com/rachelandrew)
