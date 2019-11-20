const container = document.querySelector("[data-webmentions]");

if (container) {
  renderWebmentions(container);
}

async function renderWebmentions(container) {
  const webmentions = await fetch(
    `https://webmention.io/api/mentions.jf2?target=${container.dataset.webmentions}`
  )
    .then(response => response.json())
    .then(data => data.children);

  const likes = webmentions.filter(webmention => {
    return webmention["wm-property"] === "like-of";
  });

  const replies = webmentions
    .filter(webmention => {
      return webmention["wm-property"] === "in-reply-to";
    })
    .reverse();

  if (likes.length === 0 && replies.length === 0) {
    return;
  }

  container.innerHTML = `
    <hr>
    <h2 class="h2 mt-6">
      Webmentions
      <a
        href="https://sebastiandedeyne.com/adding-webmentions-to-my-blog"
        class="ml-2 font-normal text-gray-700 dark:text-gray-500 text-xs w-4 h-4 inline-flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full font-semibold"
        style="transform: translateY(-2px)"
      >
        ?
      </a>
    </h2>
    <div class="pb-12 sm:pb-24">
      ${renderLikes(likes)}
      ${renderReplies(replies)}
    </div>
  `;
}

function renderLikes(likes) {
  if (likes.length === 0) {
    return "";
  }

  return `
    <ul class="mt-8 flex flex-wrap items-center ml-3">
      <li>${likes.map(renderLike).join("")}</li>
      <li class="ml-2 text-sm text-gray-600">${likes.length} likes</li>
    </ul>
  `;
}

function renderLike(like) {
  return `
    <li class="w-8 h-8 mb-1 -ml-3">
      <a href="${like.author.url || like.url}">
        <img
          src="${like.author.photo}"
          alt="Photo of ${like.author.name}"
          class="block w-8 h-8 object-cover rounded-full border"
        />
      </a>
    </li>
  `;
}

function renderReplies(replies) {
  if (replies.length === 0) {
    return "";
  }

  return `
    <ul class="mt-8">
      ${replies.map(renderReply).join("")}
    </ul>
  `;
}

function renderReply(reply) {
  return `
    <li class="mb-8 last:mb-0">
      <p class="mb-1">
        <a href="${reply.author.url || reply.url}">
          <img
            src="${reply.author.photo}"
            alt="Photo of ${reply.author.name}"
            class="inline-block w-8 h-8 object-cover rounded-full mr-1 mb-1 border"
          />
          <span class="font-bold">${reply.author.name}</span>
        </a>
        <a href=${reply.url} class="text-gray-600 text-sm ml-1">
          ${reply["wm-received"].substr(0, 10)}
        </a>
      </p>
      <div class="markup">
        ${reply.content.html || reply.content.text}
      </div>
    </li>
  `;
}
