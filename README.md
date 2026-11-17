# Workplace Harassment — Interactive 3D Knowledge Universe

An immersive 3D knowledge graph for a college presentation on **workplace harassment**.
The topic lives in a dark three-dimensional space: a large glowing central node, twelve
topic nodes and thirty-five sub-topic nodes, every pair joined by real interlocking
metal chains. Nodes open floating information panels, the presenter can walk the topic
in a fixed order, and the whole topic can be printed as an A3 educational chart.

Built with React + TypeScript + Vite, Three.js / React Three Fiber / drei for the
scene, Framer Motion for UI transitions, Tailwind CSS and Lucide icons.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript only
```

Everything runs offline after `npm install`: fonts are bundled through `@fontsource`,
the metal reflections come from a procedurally generated environment map, and no
network request, backend, database or API key is involved.

---

## Using it

| Action | How |
| --- | --- |
| Orbit / zoom / pan | Drag, scroll, right-drag (or two-finger gestures) |
| Select a topic | Click a node, or use the **Topics** button top-right |
| Move a node | Press a node and drag it; its sub-topics and chains follow |
| Previous / Next topic | Buttons in the panel, or **←** / **→** |
| Close the panel | **Esc**, the ✕ button, or select another node |
| Reset the camera | *Reset view* bottom-left, or Settings |
| Presentation mode | **Present** top-right — fullscreen, larger panel, keyboard navigation |
| Printable poster | **Poster** top-right → *Print / Save as PDF* |
| Quality / motion | **Settings** top-right |
| Feedback form | **Feedback** top-right, or navigate directly to `/feedback` |
| Feedback QR code | **Feedback QR** in bottom toolbar, sidebar, or printable poster |

**Presentation mode** hides the free-exploration chrome, enlarges the information panel,
shows the topic progress, requests fullscreen and keeps arrow-key navigation active.
**Poster view** is a separate static A3 landscape layout built from the same topic data,
with `@media print` rules that strip all interface controls.

---

## Content

All teaching material is in [`src/data/topics.ts`](src/data/topics.ts):

* 0 — Overview of workplace harassment
* 1 — Introduction
* 2 — Types (verbal, physical, psychological, bullying, discrimination, sexual)
* 3 — Causes (authority, awareness, power imbalance, culture, weak complaints, accountability)
* 4 — Effects (well-being, confidence, productivity, growth, teams, reputation)
* 5 — Indian laws and legal framework (Constitution, BNS 2023, POSH, labour law, policy)
* 6 — POSH Act, 2013 (objectives, coverage, what counts)
* 7 — Important provisions (Internal Committee, Local Committee, complaint procedure)
* 8 — Employer responsibilities
* 9 — Ethical values and workplace culture
* 10 — Prevention and reporting
* 11 — Case study (clearly labelled fictional)
* 12 — Conclusion

The legal section is deliberately precise: **the POSH Act, 2013 addresses sexual
harassment of women at the workplace** and is not presented as a general anti-bullying
statute. Other forms of harassment are attributed to service rules, criminal law and
organisational policy, and the point is repeated on the poster.

---

## Architecture

```
src/
  components/
    Scene3D/          KnowledgeUniverse, SceneContent, Node3D, ChainConnection,
                      CameraController, SceneLighting, BackgroundParticles,
                      LabelProjector, PerformanceGuard
    Sidebar/          TopicSidebar, TopicTree
    InformationPanel/ TopicPanel, TopicNavigation, PanelConnector
    Presentation/     PresentationOverlay
    Poster/           PosterView
    Interface/        Header, Toolbar, SettingsPanel, NodeLabels
  data/               topics.ts (content), graphLayout.ts (positions, edges)
  hooks/              useTopicNavigation, useGraphSelection, useKeyboardNavigation
  lib/                chainGeometry, geometry, textures, palette, quality,
                      screenBridge
  store/              useAppStore (zustand)
  styles/             globals.css, poster.css
  App.tsx, main.tsx
```

### How the 3D graph works

* **Layout** — hand-placed XYZ coordinates in `graphLayout.ts`, three depth levels,
  no flat ring. Structural edges come from the topic hierarchy; a few cross-links
  (`effects → prevention`, `causes → ethics`, …) keep the graph from reading as a tree.
* **Nodes** — shared `IcosahedronGeometry` per level with per-node metallic materials,
  an emissive wireframe shell as the bright outline, and a procedural halo sprite.
  Hover, selection (1.3×) and dimming are eased in the frame loop, not in React state.
* **Chains** — `ChainConnection` builds a cubic Bézier between two node surfaces, samples
  it by arc length and places one instanced oval link every `0.285` units. Each link is a
  hollow tube ring around an ellipse; consecutive links alternate their plane by 90°
  around the path tangent, so they interlock. Links are re-instanced whenever a node is
  dragged, and the whole chain lerps between silver, gold (highlight) and dim.
* **Camera** — `CameraController` eases both the camera and the OrbitControls target to the
  selected node, offsetting the framing so the panel never covers the node. A manual
  orbit cancels the flight; reduced motion snaps instead.
* **Labels** — DOM labels positioned by `LabelProjector` in the render loop through
  `lib/screenBridge.ts`, which avoids re-rendering React 60 times a second. The same
  bridge feeds the panel connector's SVG.
* **Performance** — instanced chain links, shared geometries, no shadow maps, no
  post-processing, capped particle counts, a `dpr` cap, and an automatic quality
  downgrade (`PerformanceGuard`) if the frame rate falls below ~36 fps for a few seconds.

### Quality and accessibility

Settings expose **Low / Medium / High** quality (chain resolution, wireframe shells,
halo sprites, particle count, pixel ratio), an **Auto quality** fallback, and a
**Reduced motion** switch that also respects the OS `prefers-reduced-motion` setting.

---

## Deployment

The build is a fully static `dist/` bundle with relative asset paths, so it runs at a
domain root or in a sub-folder, with no backend, bindings, database or environment
variables.

```bash
npm run build     # -> dist/
npm run preview   # serve the built bundle at http://localhost:4173
```

The production bundle has been smoke-tested locally: HTML, JS, CSS and the bundled
fonts all load from `dist/` with no 404s, and the 3D scene renders from the built chunk.

### Cloudflare Pages — via Git (recommended)

1. Push this repository to GitHub or GitLab.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Import an existing Git
   repository**.
3. Use these settings:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variables | none |

4. **Save and Deploy.** Every push to `main` redeploys; pull requests get preview URLs.

---

## Custom Feedback System & Google Sheets Backend

The presentation website features a dedicated custom feedback collection system integrated directly with Google Sheets.

* **Dedicated Route**: [`/feedback`](/feedback) (accessible via direct link, in-app navigation, or QR code).
* **Fields**: Name (required), Student ID (optional), Star Rating (1–5 stars), Feedback / Review (required textarea).
* **Spam & Flooding Protection**: Honeypot field and short-term duplicate submission caching.
* **Storage Backend**: Google Apps Script (`backend/google-apps-script/Code.gs`) saving to Google Sheets without requiring attendees to sign in.
* **Printable QR Code**: Displayed on the interactive site and integrated directly onto the printable A3 poster for mobile scanning.

### Google Sheets Integration Setup

For complete, beginner-friendly instructions on creating the Google Sheet, deploying `Code.gs` as a Web App, and configuring `VITE_FEEDBACK_ENDPOINT`, see:

👉 [**Google Sheets Feedback Setup Guide**](docs/GOOGLE_SHEETS_FEEDBACK_SETUP.md)

---

## Deployment

### Cloudflare Pages — Git integration (recommended)

1. Push this repository to GitHub or GitLab.
2. In the Cloudflare dashboard, go to **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
3. Select this repository and use the presets:

   | Setting | Value |
   | --- | --- |
   | Framework preset | None / Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variables | `VITE_FEEDBACK_ENDPOINT`, `VITE_SITE_URL` |

4. **Save and Deploy.** Every push to `main` redeploys; pull requests get preview URLs.

Committed for this path:

* `wrangler.toml` — declares `pages_build_output_dir = "./dist"`.
* `.nvmrc` — pins Node 22 for Cloudflare's build image.
* `public/_headers` — caching rules and security headers.
* `public/_redirects` — SPA rewrite (`/* /index.html 200`) enabling direct browser navigation to `/feedback`.

### Cloudflare Pages — direct upload

```bash
npx wrangler login
npm run build
npx wrangler pages deploy
# or, with your own project name:
# npx wrangler pages deploy dist --project-name workplace-harassment-universe
```

`wrangler pages deploy` reads the output directory from `wrangler.toml`. Rename the
`name` field there (or pass `--project-name`) to match your Pages project.

### Cloudflare Workers static assets (alternative)

If you prefer a Worker over Pages, replace `wrangler.toml` with `wrangler.jsonc`:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "workplace-harassment-universe",
  "compatibility_date": "2026-11-17",
  "assets": { "directory": "./dist" }
}
```

Then `npm run build && npx wrangler deploy`. Add
`"not_found_handling": "single-page-application"` only once client-side routing exists.

### Vercel and other static hosts

* **Vercel** — framework preset *Vite*, build `npm run build`, output `dist`; no rewrites.
* **Any static host** — upload the contents of `dist/` (GitHub Pages, Netlify, S3, an
  intranet share, or a USB stick served by any static file server).

---

## Notes and limitations

* Node dragging is intentionally direct rather than physically simulated; a dragged node
  is clamped to a generous bounding box so it cannot be lost off-screen. *Settings →
  Restore node positions* resets the layout.
* Labels are HTML projected onto the canvas rather than 3D text, so they stay crisp at
  projector resolutions and require no font download.
* The poster is designed for A3 landscape. Browsers can also save it as PDF from the same
  print dialog; other paper sizes will reflow rather than clip.
* The case study is fictional and labelled as such in the content, the panel and the
  poster.
