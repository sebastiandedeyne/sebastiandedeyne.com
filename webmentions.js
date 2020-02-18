const fs = require("fs");
const https = require("https");

const postSlugs = fs.readdirSync(`${__dirname}/content/posts`).flatMap(path => {
  const fullPath = `${__dirname}/content/posts/${path}`;

  if (fs.lstatSync(fullPath).isDirectory()) {
    return fs
      .readdirSync(fullPath)
      .map(subPath => `${path}--${subPath.replace(".md", "")}`);
  }

  return [path.replace(".md", "")];
});

fetchWebmentions().then(webmentionsResponse => {
  if (!("children" in webmentionsResponse)) {
    throw new Error("Invalid webmention.io response.");
  }

  webmentionsResponse.children
    .filter(entry => postSlugs.includes(getSlug(entry)))
    .forEach(entry => {
      const filename = `${__dirname}/data/webmentions/${getSlug(entry)}.json`;

      if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, JSON.stringify([entry], null, 2));
        return;
      }

      const entries = JSON.parse(fs.readFileSync(filename));

      const newEntries = uniqBy([entry, ...entries], entry => entry["wm-id"]);
      newEntries.sort((a, b) => a["wm-id"] - b["wm-id"]);

      fs.writeFileSync(filename, JSON.stringify(newEntries, null, 2));
    });
});

function getSlug(entry) {
  return entry["wm-target"]
    .replace("https://sebastiandedeyne.com/", "")
    .replace(/\/$/, "")
    .replace("/", "--");
}

function fetchWebmentions() {
  const token = process.env.WEBMENTIONS_TOKEN;

  const since = new Date();
  since.setDate(since.getDate() - 1);

  const url =
    "https://webmention.io/api/mentions.jf2" +
    "?domain=sebastiandedeyne.com" +
    `&token=${token}` +
    `&since=${since.toISOString()}` +
    "&per-page=999";

  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let body = "";

        res.on("data", chunk => {
          body += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", error => {
        reject(error);
      });
  });
}

function uniqBy(array, callback) {
  return Array.from(
    array
      .reduce((map, item) => {
        const key = callback(item);

        if (!map.has(key)) {
          map.set(key, item);
        }

        return map;
      }, new Map())
      .values()
  );
}
