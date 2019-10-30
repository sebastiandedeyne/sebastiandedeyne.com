const search = document.querySelector("[data-archive-search]");

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

const items = Array.from(document.querySelectorAll("[data-archive-item]"));
const groups = Array.from(document.querySelectorAll("[data-archive-group]"));

function filterArchiveList(search) {
  search = search.replace(/[^\w]/g, "").toLowerCase();

  if (!search) {
    [...items, ...groups].forEach(item => {
      item.classList.remove("hidden");
    });
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
}
