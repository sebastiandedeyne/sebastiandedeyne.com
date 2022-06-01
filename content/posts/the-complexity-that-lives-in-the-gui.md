---
title: "The complexity that lives in the GUI"
slug: the-complexity-that-lives-in-the-gui
date: 2021-02-22
link: https://blog.royalsloth.eu/posts/the-complexity-that-lives-in-the-gui/
keywords:
  - programming
  - frontend
---

RoyalSloth reviews the three most common patterns to model interconnected state in a user interface.

> - **Connect the boxes:** create the user avatar component and pass its instance to the inventory table component
> - **Lift the state up:** move the internal state of the user avatar component and the state of the inventory table into a separate box/class
> - **Introduce a message bus:** connect the inventory table and the user avatar component to the shared pipe that is used for distributing events in the application

*Connect the boxes* and *lift the state up* seem to be the most common choices for React apps; respectively prop drilling and context or single state trees (like Redux).

There's no silver bullet to UI complexity, all methods have their caveats.

Read the full article on [blog.royalsloth.eu](https://blog.royalsloth.eu/posts/the-complexity-that-lives-in-the-gui/).
