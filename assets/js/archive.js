const search = document.querySelector("[data-archive-search]");
const keywords = Array.from(
  document.querySelectorAll("[data-archive-keyword]")
);
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

keywords.forEach(keyword => {
  keyword.addEventListener("click", () => {
    search.value = keyword.textContent.trim();
    filterArchiveList(search.value);
  });
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
      item.style.display = '';
    });

    window.history.replaceState(null, null, window.location.pathname);

    return;
  }

  items.forEach(item => {
    if (item.dataset.archiveItem.indexOf(search) !== -1) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });

  groups.forEach(group => {
    const allHidden = Array.from(
      group.querySelectorAll("[data-archive-item]")
    ).every(item => {
      return item.style.display === 'none';
    });

    if (allHidden) {
      group.style.display = 'none';
    } else {
      group.style.display = '';
    }
  });

  window.history.replaceState(
    null,
    null,
    `${window.location.pathname}?search=${encodeURIComponent(
      input.toLowerCase()
    )}`
  );
}
