# Portfolio — Jeeban Jyoti Patra

A static, dependency-free portfolio site. No build step — it runs directly on GitHub Pages.

```
Portfolio-NEW/
├── index.html        # all page markup
├── css/styles.css    # theme variables (light + dark), keyframes, hover states
├── js/main.js        # theme toggle, scroll animations, rotating hero word
├── assets/favicon.svg
├── .nojekyll         # tells GitHub Pages to serve files as-is
└── README.md
```

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
cd Portfolio-NEW
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy to GitHub Pages
1. Create a repo — for a root URL name it `jeeban-jyoti.github.io`; any other name serves at `jeeban-jyoti.github.io/<repo>/`.
2. Push this folder's contents to the `main` branch:
   ```bash
   cd Portfolio-NEW
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/jeeban-jyoti/<repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → main / (root)** → Save.
4. The site is live in a minute or two. All paths are relative, so it works at a root or sub-path URL.

## Editing
- **Colors:** `:root` (light) and `html[data-theme="dark"]` at the top of `css/styles.css`.
- **Content:** plain HTML in `index.html`, one `<section>` per area (experience, projects, skills, education, leadership, achievements, contact).
- **Scroll animations:** add `data-reveal="up|left|right|scale|tilt|clip"` (plus optional `data-delay="1..3"`) to any element.
- **Counters:** `<span data-count="1974" data-suffix="+">1974</span>`.
- **Theme:** remembers the visitor's choice, otherwise follows their OS setting.
