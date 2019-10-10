const container = document.querySelector("[data-webmentions]");

if (container) {
  renderWebmentions(container);
}

async function renderWebmentions(container) {
  const webmentions = await getWebmentions(container.dataset.webmentions);

  const replies = webmentions
    .filter(webmention => {
      return webmention["wm-property"] === "in-reply-to";
    })
    .reverse();

  if (replies.length === 0) {
    return;
  }

  const separator = document.createElement("hr");
  container.appendChild(separator);

  const title = document.createElement("h2");
  title.textContent = "Webmentions";
  title.className = "h2 mt-6 mb-8";
  container.appendChild(title);

  const whatmentions = document.createElement("a");
  whatmentions.textContent = "?";
  whatmentions.className =
    "ml-2 font-normal text-gray-700 dark:text-gray-500 text-xs w-4 h-4 inline-flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full font-semibold";
  whatmentions.style.transform = "translateY(-2px)";
  whatmentions.href =
    "https://sebastiandedeyne.com/adding-webmentions-to-my-blog";
  title.appendChild(whatmentions);

  const list = document.createElement("ul");
  list.className = "pb-12 sm:pb-24";

  replies.forEach(webmention => {
    list.appendChild(renderReply(webmention));
  });

  container.appendChild(list);
}

function getWebmentions(target) {
  return fetch(`https://webmention.io/api/mentions.jf2?target=${target}`)
    .then(response => response.json())
    .then(data => data.children);
}

function renderReply(webmention) {
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
