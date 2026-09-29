# Damn Marto, You Buggin

Portfolio site for Shamar Aitcheson (MartoDaGeneral): Cybersecurity & Business Administration at Northeastern, developer on Lost & Hound, and music producer.

The site is plain HTML/CSS/JS in [`docs/`](docs/), with no build step.

```
docs/
├── index.html   ← all page content
├── styles.css   ← colors/fonts are tokens at the top of the file
├── script.js    ← terminal typing, waveform, glitch, scroll reveals
└── assets/      ← images and files (e.g. resume.pdf)
```

## Preview locally

Open `docs/index.html` in a browser, or run:

```sh
python3 -m http.server -d docs 8000   # then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repo on GitHub and push this project to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main`, and the folder to `/docs`.
4. After a minute the site is live at `https://<username>.github.io/<repo>/`.

For a custom domain (e.g. `damnmarto.com`), add it in the same Pages settings and point your DNS at GitHub.
