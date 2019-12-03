const fs = require("fs");
const https = require("https");

const token = process.env.WEBMENTIONS_TOKEN;

const since = new Date();
since.setDate(since.getDate() - 1);

const url =
  "https://webmention.io/api/mentions.jf2" +
  "?domain=sebastiandedeyne.com" +
  `&token=${token}` +
  `&since=${since.toISOString()}` +
  "&per-page=999";

fetch(url)
  .then(response => {
    if (!("children" in response)) {
      throw new Error("Invalid webmention.io response");
    }

    response.children.filter(isPost).forEach(entry => {
      const filename = `${__dirname}/data/webmentions/${getSlug(entry)}.json`;

      if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, JSON.stringify([entry], null, 2));
        return;
      }

      const entries = JSON.parse(fs.readFileSync(filename));

      const newEntries = uniqBy([entry, ...entries], entry => entry["wm-id"]);
      newEntries.sort((a, b) => b["wm-id"] - a["wm-id"]);

      fs.writeFileSync(filename, JSON.stringify(newEntries, null, 2));
    });
  })
  .catch(error => {
    setTimeout(() => {
      throw error;
    });
  });

const postSlugs = fs
  .readdirSync(`${__dirname}/content/posts`)
  .map(filename => filename.replace(".md", ""));

function isPost(entry) {
  return postSlugs.includes(getSlug(entry));
}

function getSlug(entry) {
  return entry["wm-target"]
    .replace("https://sebastiandedeyne.com/", "")
    .replace(/\/$/, "");
}

function fetch(url) {
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
