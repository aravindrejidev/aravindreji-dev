# Aravind Hub
Next.js 15 · Tailwind v4 · Framer Motion 12 · glisse (Liquid Glass)

    npm install && npm run dev

## Add a project (works from the GitHub mobile site/app)
1. Open `data/projects.json` → Edit.
2. Paste a new block at the TOP of the list (newest first), keep the comma.
3. Commit. Vercel redeploys in ~1 min.

    {
      "id": "my-app",                  // unique, no spaces
      "title": "My App",
      "icon": "🎵",                    // any emoji
      "section": "apps",               // apps | websites | contributions
      "blurb": "One-line summary on the card.",
      "details": "Longer text shown in the sheet.",
      "highlights": ["Point one", "Point two"],
      "tags": ["Kotlin"],
      "hue": 190,                      // optional 0-360 glow colour
      "pin": ["all", "apps"],          // optional, see below
      "links": [{ "label": "Download", "href": "https://..." }]
    }

(Remove the `//` comments in the real file; JSON doesn't allow them.)

## Pin
`pin` lists the views where the project floats to the top with a 📌 badge.
Each view is independent: `["all"]` pins only on All, `["apps"]` only in Apps,
`["all","apps"]` both. Use `[]` for no pin. Views: `all`, `apps`, `websites`, `contributions`.
A broken entry is skipped (see build log) instead of crashing the site.

## Project README + logo
- Logo: put `public/images/<id>.png` (set `"logo": "/images/<id>.png"`). Falls back to the emoji.
- README: put `public/readmes/<id>.md`. If missing, the repo's README is fetched from GitHub
  (needs `"repo": "RepoName"`). Relative images/links in a README resolve to that repo automatically.
- Optional fields: `license`, `langs` (`[{"name":"Kotlin","pct":80}]`).
