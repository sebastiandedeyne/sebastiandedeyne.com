---
date: 2017-08-04
title: Generate pdfs with Google Chrome on a Forge provisioned server
subtitle: Written for Ubuntu ^16.04
type: article
tags:
  - Laravel Forge
  - devops
---

This week I needed to export some charts generated with HTML & JavaScript as a pdf file. I already had implemented the charts on a webpage so I wanted a solution that allowed me to use my existing code for the pdfs.

Headless Chrome to the rescue! Chrome can run as a cli tool, and print a pdf file from a url. All I had to do was make some layout tweaks to make everything printer-friendly.

<!--more-->

The command is pretty straight forward:

```bash
google-chrome --headless --disable-gpu \
    --print-to-pdf="output.pdf" https://spatie.be
```

That odd `--disable-gpu` flag isn't really relevant but it's necessary to use Chrome headless.

I wrote an Artisan command to generate a pdf from a set of results, and everything was up and running in my local environment in no time. Since Chrome ships with the CLI tool, all I had to do was write a little alias.

```bash
alias google-chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
```

The next step was getting this to work on an actual server, in this case a freshly provisioned [Forge](https://forge.laravel.com) server. There are a few guides for installing Chrome on Ubuntu, but here's what ultimately did the trick for me.

```bash
sudo apt-get install libxss1 libappindicator1 libindicator7

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# If there are errors running this, ignore them for now
sudo dpkg -i google-chrome*.deb

# This fixes the errors that appeared in the previous command
sudo apt-get install -f
```

That's it! I created an environment variable to set the Chrome path in my application, and It Just Works™

---

- [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)
- [Using headless Chrome as an automated screenshot tool](https://medium.com/@dschnr/using-headless-chrome-as-an-automated-screenshot-tool-4b07dffba79a)
