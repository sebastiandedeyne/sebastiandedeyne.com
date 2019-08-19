const container = document.querySelector("[data-webmentions]");

if (container) {
  renderWebmentions(container);
}

async function renderWebmentions(container) {
  const webmentions = await getWebmentions(container.dataset.webmentions);

  if (webmentions.length === 0) {
    return;
  }

  const list = document.createElement("ul");
  list.className = "pb-12 sm:pb-24";

  webmentions
    .filter(webmention => webmention["wm-property"] === "in-reply-to")
    .forEach(webmention => {
      list.appendChild(renderWebmention(webmention));
    });

  container.appendChild(list);
}

function getWebmentions(target) {
  return fetch(`https://webmention.io/api/mentions.jf2?target=${target}`)
    .then(response => response.json())
    .then(data => data.children);
}

function renderWebmention(webmention) {
  const rendered = document.importNode(
    document.getElementById("webmention-template").content,
    true
  );

  function set(selector, attribute, value) {
    rendered.querySelector(selector)[attribute] = value;
  }

  set("[data-author]", "href", webmention.author.url || webmention.url);
  set("[data-author-avatar]", "src", webmention.author.photo);
  set("[data-author-avatar]", "alt", `Photo of ${webmention.author.name}`);
  set("[data-author-name]", "textContent", webmention.author.name);
  set("[data-date]", "href", webmention.url);
  set("[data-date]", "textContent", webmention["wm-received"].substr(0, 10));

  if (webmention.content) {
    set(
      "[data-content]",
      "innerHTML",
      webmention.content.html || webmention.content.text
    );
  }

  return rendered;
}
