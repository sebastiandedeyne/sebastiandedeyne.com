const container = document.querySelector("[data-webmentions]");

if (container) {
  renderWebmentions(container);
}

async function renderWebmentions(container) {
  const webmentions = await getWebmentions(container.dataset.webmentions);

  if (webmentions.length === 0) {
    return;
  }

  container.innerHTML = `
    <div class="webmentions">
      <h2>Webmentions</h2>
      <ul>
        ${webmentions.map(renderWebmention).join("")}
      </ul>
    </div>
  `;
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

  return `
    <li>
      <p class="webmention-header">
        <a href="${webmention.author.url ||
          webmention.url}" class="webmention-author">
          <img
            src="${webmention.author.photo}"
            alt="Photo of ${webmention.author.name}"
          />
          ${webmention.author.name}
        </a>
        <a href="${webmention.url}">
          ${action} on ${webmention["wm-received"].substr(0, 10)}
        </a>
      </p>
      ${
        webmention.content
          ? `<div class="webmention-content markup">${webmention.content.html ||
              webmention.content.text}</div>`
          : ""
      }
    </li>
  `;
}
