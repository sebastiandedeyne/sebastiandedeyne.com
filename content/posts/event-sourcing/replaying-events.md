---
title: "Thoughts on event sourcing: Replaying events"
slug: event-sourcing/replaying-events
date: 2023-06-20T10:50:00+02:00
categories: ["articles"]
tags:
  - Event Sourcing
summary: |
  When event sourcing, the stream of events is your source of truth where all data is derived from. A promise often made in event sourcing pitches is that you can destroy your data and rebuild (replay) it at any time. In my experience, it's a lot more nuanced than that.
---

When event sourcing, the stream of events is your source of truth where all data is derived from. When a user adds an item to their cart, an `ItemWasAddedToCart` event is dispatched, and most likely you'll have a `CartProjector` to insert a row in your `cart_items` table.

A promise often made in event sourcing pitches is that you can destroy your `cart_items` table and rebuild (replay) it at any time. Have a bug in your projections? Replay! Want to add more data? Replay! Want to view the state to a previous point in time? Replay! In my experience, it's a lot more nuanced than that.

## Problems with replays

Completely deleting and replaying your data means downtime. If something goes wrong, you could end up with a partially populated database which sounds disastrous. The kind of deploy I wouldn't want to touch with a ten foot pole.

Deleting data so it can be replayed can also be application specific. Say you have an event sourced `subscriptions` table. You also have a non-event sourced `users` table with a `primary_subscription_uuid` column. When you want to replay subscriptions, you don't only need to drop `subscriptions`, but also `users.primary_subscription_uuid`.

Another case for replays is to read your data at a specific point in time. This is difficult to combine with existing projections. If you want to see what a subscription looked like three months ago, you can't just remove and replay the data because the end user would be pulled back in time when they visit the site. This can be confusing, and cause inconsistencies when actions happen on past data.

So how _do_ we use replays? (in the broad sense of the word)

---

## Phased rollouts

Last year we launched an event sourced webshop with a projection for financial transactions optimized for reporting. Months later the projection wasn't fit anymore for the new needs of our client.

Instead of doing a full replay, we built a new system alongside the old. When we deployed the new projection, we replayed the events on it to populate the table. In the first few weeks, we didn't use the new data yet. While the old projection remained online, we had all the time in the world to validate its correctness on real data.

Once we were confident in the new system, we made it available to our external reporting tool. In the mean time, we could keep the old projection alive so the client didn't need to rebuild all their reports during the transition.

## Small-batch replays

Bugs happen. Sometimes something's screwed up in your projections and you just want to rebuild from a clean slate. This is where the replay promise can come true, but keep it small to mitigate risk.

I've written scripts to delete a projection, query relevant events and run them through projectors again. If you do this for a single model instead of the entire system, it can be fast enough to do without downtime. These scripts are often specific to the application and projection. Which events should be queried? How should data be deleted? Are there any non-event sourced foreign key constraints that could break? Too many variables to pour into a generic solution.

## Look back in time in memory or with snapshots

There are two ways to use your event stream and look back in time: in memory or with snapshots.

You could query stored events to replay them to a current point in time in memory, and present the result to the user. This way, you avoid overwriting the current state. The drawback to is that it can be slow as the "projection" is built on demand.

You could also have an (additional) projection that snapshots your data. Instead of storing a subscription once, you store it once for the current state and copies for every day/month/year/… depending on the granularity you need. Event sourcing is well fit for this because it makes it easy to store multiple representations of the same data. The drawback to this is that you could end up storing a _lot_ of (duplicate) data.

---

I don't believe in the promise of cheap replays in event sourcing. They come with a cost, but can be very useful for the right problems. But that's fine. They're still one of many benefits an event sourced systems have, and I wouldn't want to build applications any other way.
