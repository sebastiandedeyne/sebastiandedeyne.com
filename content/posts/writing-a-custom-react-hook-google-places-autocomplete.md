---
title: "Writing a custom React hook: Google Places autocomplete"
date: 2019-10-11
categories: ["articles"]
keywords:
    - React
---

I built a small React component that uses the Google Places API to autocomplete an address in a project I'm working on, and extracted the predection fetching to a custom `useAddressPredictions` hook. It's a nice example of a custom React hook composed of different primisite hooks, so I decided to pen write my thought process while building it.

<!--more-->

<aside>New to React hooks? The React docs have an excellent <a href="https://reactjs.org/docs/hooks-overview.html">Hooks at a Glance</a> page to get you started.</aside>

Retrieving address predictions from the Google Places API is fairly straightforward:

```js
const autocomplete =
  new window.google.maps.places.AutocompleteService();

autocomplete.getPlacePredictions(
  { input: "Samberstraat" },
   predictions => {
    // Predictions for "Samberstraat"
  }
);
```

The callback in `getPlacePredictions` will receive an array of predictions, that each have a `description` property containing the predicted address.

```js
[
  { description: "Samberstraat Antwerpen" },
  { description: "Samberstraat Mechelen" },
]
```

I want a custom hook that receives an address and returns an array of predicted addresses. Here's what an `AddressPredictions` component using the hook could look like:

{{< highlight jsx "hl_lines=7" >}}
import React, { useState } from "react";
import useAddressPredictions from "./useAddressPredictions";

export default function AddressPredictions() {
  const [input, setInput] = useState("");

  const predictions = useAddressPredictions(input);

  return (
    <div>
      <input
        value={input}
        onChange={event => setInput(event.target.value)}
      />
      <ul>
        {predictions.map((prediction, index) => (
          <li key={index}>{prediction}</li>
        ))}
      </ul>
    </div>
  );
}
{{</ highlight >}}

There's an `input` to start searching, and a list of predictions will be rendered below.

Let's start building! The custom `useAddressPredictions` hook will receive an input and return an array of predictions.

```js
export default function useAddressPredictions(input) {
  return [];
}
```

First we need to instantiate Google's `AutocompleteService`. We only want to do this on the first render, not when the component rerenders.

The `useRef` hook allows us to register something similar to an instance variable of a class. When the ref's `current` value is empty, we instantiate the `AutocompleteService`. This will only happen once.

```js {hl_lines=["1","4-9"]}
import { useRef } from "react";

export default function useAddressPredictions(input) {
  const autocomplete = useRef();

  if (!autocomplete.current) {
    autocomplete.current =
      new window.google.maps.places.AutocompleteService();
  }

  return [];
}
```

Time to start fetching predictions. We want to fetch them whenever the `input` variable's value changes. Data fetching is a side effect, so we'll use the `useEffect` hook.

```js {hl_lines=["1","11-18","20-22"]}
import { useEffect, useRef } from "react";

export default function useAddressPredictions(input) {
  const autocomplete = useRef();

  if (!autocomplete.current) {
    autocomplete.current =
      new window.google.maps.places.AutocompleteService();
  }

  function getPlacePredictions(input) {
    autocomplete.current.getPlacePredictions(
      { input },
      predictions => {
        //
      }
    );
  }

  useEffect(() => {
    getPlacePredictions(input);
  }, [input]);

  return [];
}
```

Whenever `input` changes, new predictions will be fetched. Now we can to store those predictions locally with the `useState` hook. Since we don't care about the full prediction objects, we'll also map them to an array of address string first.

```js {hl_lines=["1","4","17-19","28"]}
import { useEffect, useRef, useState } from "react";

export default function useAddressPredictions(input) {
  const [predictions, setPredictions] = useState([]);

  const autocomplete = useRef();

  if (!autocomplete.current) {
    autocomplete.current =
      new window.google.maps.places.AutocompleteService();
  }

  function getPlacePredictions(input) {
    autocomplete.current.getPlacePredictions(
      { input },
      predictions => {
        setPredictions(
          predictions.map(prediction => prediction.description)
        );
      }
    );
  }

  useEffect(() => {
    getPlacePredictions(input);
  }, [input]);

  return predictions;
}
```

Our hook works! But there's one more issue: if `value` is attached to text input, the hook will do an API call on every keypress, which would be a lot. We can debouce the call to fix this.

You can't simply wrap something in `debounce` in a React function component, because a new debounced function would be created on every render. That way the debounce function wouldn't be able to track how often the function gets run.

We need ensure the debounced function doesn't get recreated when the component rerenders. The `useCallback` hook is just what we need here.

```js {hl_lines=["1-2","25-28","31"]}
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

export default function useAddressPredictions(input) {
  const [predictions, setPredictions] = useState([]);

  const autocomplete = useRef();

  if (!autocomplete.current) {
    autocomplete.current =
      new window.google.maps.places.AutocompleteService();
  }

  function getPlacePredictions(input) {
    autocomplete.current.getPlacePredictions(
      { input },
      predictions => {
        setPredictions(
          predictions.map(prediction => prediction.description)
        );
      }
    );
  }

  const debouncedGetPlacePredictions = useCallback(
      debounce(getPlacePredictions, 500),
      []
  );

  useEffect(() => {
    debouncedGetPlacePredictions(input);
  }, [input]);

  return predictions;
}
```

`useCallback` created a new function whenever one of its dependencies change. We're passing an empty dependencies array to `useCallback`, so it will only be created once.

We used a combination of `useCallback`, `useEffect`, `useRef` and `useState` to create our custom hook. Hooks are a great way to extract split components in manageable chunks, and I'm looking forward to sharing more thought processes like this in the future!
