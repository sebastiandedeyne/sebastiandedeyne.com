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
  list.className = "webmentions";

  webmentions.forEach(webmention => {
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
  const action = {
    "in-reply-to": "replied",
    "like-of": "liked",
    "repost-of": "reposted",
    "mention-of": "mentioned"
  }[webmention["wm-property"]];

  const rendered = document.importNode(
    document.getElementById("webmention-template").content,
    true
  );

  function set(selector, attribute, value) {
    rendered.querySelector(selector)[attribute] = value;
  }

  set(".webmention-author", "href", webmention.author.url || webmention.url);
  set(".webmention-author-avatar", "src", webmention.author.photo);
  set(".webmention-author-avatar", "alt", `Photo of ${webmention.author.name}`);
  set(".webmention-author-name", "textContent", webmention.author.name);
  set(".webmention-action", "href", webmention.url);

  set(
    ".webmention-action",
    "textContent",
    `${action} on ${webmention["wm-received"].substr(0, 10)}`
  );

  if (webmention.content) {
    set(
      ".webmention-content",
      "innerHTML",
      webmention.content.html || webmention.content.text
    );
  }

  return rendered;
}
