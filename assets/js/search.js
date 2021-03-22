const triggers = Array.from(document.querySelectorAll("[data-search-trigger]"));
const backdrop = document.querySelector("[data-search-backdrop]");
const input = document.querySelector("[data-search-input]");
const results = Array.from(document.querySelectorAll("[data-search-result]"));

let selectedIndex = 0;

function showSearch() {
  if (backdrop.style.display === "block") {
    return;
  }

  backdrop.style.display = "block";

  input.value = "";
  updateResults("");

  window.requestAnimationFrame(() => input.focus());
}

function hideSearch() {
  if (backdrop.style.display === "") {
    return;
  }

  backdrop.style.display = "";
}

function updateResults(input) {
  const search = input.replace(/[^\w]/g, "").toLowerCase();

  if (!search) {
    results.forEach((result) => {
      result.style.display = "";
    });

    updateSelected(0);

    return;
  }

  results.forEach((result) => {
    if (result.dataset.searchResult.indexOf(search) !== -1) {
      result.style.display = "";
    } else {
      result.style.display = "none";
    }
  });

  updateSelected(0);
}

function updateSelected(newIndex, scroll = true) {
  const visibleResults = results.filter(
    (result) => result.style.display === ""
  );

  if (newIndex < 0 || newIndex >= visibleResults.length) {
    return;
  }

  selectedIndex = newIndex;

  results.forEach((result) => {
    result.classList.remove("selected");
  });

  visibleResults.forEach((result, index) => {
    if (index === selectedIndex) {
      result.classList.add("selected");
      if (scroll) {
        window.requestAnimationFrame(() => {
          result.scrollIntoView({ block: "center" });
        });
      }
    }
  });
}

function visitSelected() {
  const selected = results.find((result) => {
    return result.classList.contains("selected");
  });

  if (selected) {
    window.location = selected.querySelector("a").href;
  }
}

triggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    showSearch();
  });
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "k":
      if (event.metaKey) {
        showSearch();
      }
      break;
    case "Escape":
      hideSearch();
      break;
  }
});

backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) {
    hideSearch();
  }
});

input.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Tab":
      event.preventDefault();
      break;
    case "ArrowDown":
      updateSelected(selectedIndex + 1);
      break;
    case "ArrowUp":
      updateSelected(selectedIndex - 1);
      break;
    case "Enter":
      visitSelected();
      break;
  }
});

input.addEventListener("input", (event) => {
  updateResults(event.target.value);
});

results.forEach((result, index) => {
  result.addEventListener("mouseenter", (event) => {
    updateSelected(index, false);
  });
});
