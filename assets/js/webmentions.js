class WebMentions extends HTMLElement {
  async connectedCallback() {
    const webmentions = await getWebmentions(this.getAttribute("target"));

    if (webmentions.length === 0) {
      return;
    }

    this.innerHTML = `
      <div class="webmentions">
        <h2>Webmentions</h2>
        <ul>
          ${webmentions.map(renderWebmention).join("")}
        </ul>
      </div>
    `;
  }
}

customElements.define("web-mentions", WebMentions);

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
        <span class="webmention-author">
          <a href="${webmention.author.url}">
            <img
              src="${webmention.author.photo}"
              alt="Photo of ${webmention.author.name}"
            />
            ${webmention.author.name}
          </a>
        </span>
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
