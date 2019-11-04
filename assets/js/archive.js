const search = document.querySelector("[data-archive-search]");
const items = Array.from(document.querySelectorAll("[data-archive-item]"));
const groups = Array.from(document.querySelectorAll("[data-archive-group]"));

window.addEventListener("keyup", event => {
  if (document.activeElement && document.activeElement.tagName === "INPUT") {
    return;
  }

  if (event.key === "/") {
    search.focus();
  }
});

search.addEventListener("input", event => {
  filterArchiveList(event.target.value);
});

const initialSearchMatches = window.location.search.match(/search=([^$]+)/);

if (initialSearchMatches) {
  search.value = decodeURIComponent(initialSearchMatches[1]);
}

filterArchiveList(search.value);

function filterArchiveList(input) {
  const search = input.replace(/[^\w]/g, "").toLowerCase();

  if (!search) {
    [...items, ...groups].forEach(item => {
      item.classList.remove("hidden");
    });

    window.history.replaceState(null, null, window.location.pathname);

    return;
  }

  items.forEach(item => {
    if (item.dataset.archiveItem.indexOf(search) !== -1) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });

  groups.forEach(group => {
    const allHidden = Array.from(
      group.querySelectorAll("[data-archive-item]")
    ).every(item => {
      return item.classList.contains("hidden");
    });

    if (allHidden) {
      group.classList.add("hidden");
    } else {
      group.classList.remove("hidden");
    }
  });

  window.history.replaceState(
    null,
    null,
    `${window.location.pathname}?search=${encodeURIComponent(search)}`
  );
}
