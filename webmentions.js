const fs = require("fs");
const https = require("https");

fetchWebmentions().then(webmentions => {
  webmentions.forEach(webmention => {
    // Sluggify the webmention target URL.
    // Example: "https://sebastiandedeyne/unix-things/listing-directories/"
    //   -> "unix-things--listing-directories"
    const slug = webmention["wm-target"]
      .replace("https://sebastiandedeyne.com/", "")
      .replace(/\/$/, "")
      .replace("/", "--");

    const filename = `${__dirname}/data/webmentions/${slug}.json`;

    // If there's no data file for the webmention target yet, we can simply
    // create a new one with the webmention as the sole entry.
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, JSON.stringify([webmention], null, 2));

      return;
    }

    // If there are already entries for a webmention target, append the
    // new webmention to the existing ones. But first filter the existing
    // entries to prevent duplicates.
    const entries = JSON.parse(fs.readFileSync(filename))
      .filter(wm => wm["wm-id"] !== webmention["wm-id"])
      .concat([webmention]);

    // Sort the entries by webmention ID to have a deterministic order.
    entries.sort((a, b) => a["wm-id"] - b["wm-id"]);

    fs.writeFileSync(filename, JSON.stringify(entries, null, 2));
  });
});

function fetchWebmentions() {
  // Token will be passed as an environment variable by Netlify.
  const token = process.env.WEBMENTIONS_TOKEN;

  // Fetch all webmentions from the past 3 days.
  const since = new Date();
  since.setDate(since.getDate() - 3);

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
  }).then(response => {
    if (!("children" in response)) {
      throw new Error("Invalid webmention.io response.");
    }

    return response.children;
  });
}
