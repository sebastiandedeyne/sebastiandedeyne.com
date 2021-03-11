const triggers = Array.from(document.querySelectorAll("[data-search-trigger]"));
const backdrop = document.querySelector("[data-search-backdrop]");
const input = document.querySelector("[data-search-input]");
const results = Array.from(document.querySelectorAll("[data-search-result]"));

triggers.forEach(trigger => {
  trigger.addEventListener("click", event => {
    event.preventDefault();
    showSearch();
  });
});

backdrop.addEventListener("click", event => {
  if (event.target === backdrop) {
    hideSearch();
  }
});

window.addEventListener("keydown", event => {
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

input.addEventListener("input", event => {
  filterResults(event.target.value);
});

function showSearch() {
  if (backdrop.style.display === "block") {
    return;
  }

  backdrop.style.display = "block";
  input.value = "";
  requestAnimationFrame(() => input.focus());
}

function hideSearch() {
  if (backdrop.style.display === "") {
    return;
  }

  backdrop.style.display = "";
}

function filterResults(input) {
  const search = input.replace(/[^\w]/g, "").toLowerCase();

  if (!search) {
    results.forEach(item => {
      item.style.display = '';
    });

    return;
  }

  results.forEach(item => {
    if (item.dataset.searchResult.indexOf(search) !== -1) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}
