# Portfolio 2 — Shivam Soni

UX case-study pages for **Shivam Soni**, built to match Figma
(`Portfolio-Collab`). Plain HTML, CSS and JavaScript — no build tools, no
frameworks.

## Pages

- **`index.html`** — home: a short intro and the selected work. Each project
  block is a single link into its case study.
- **`sahayya.html`** — *Sahayya*: redesigning an end-to-end loan origination
  system that cut loan processing from 10 days to 4.
- **`kickfurther.html`** — *Kickfurther*: making an invisible deal-recovery
  process visible to investors, businesses, and the internal team.

## Structure

```
Portfolio-2/
├── index.html                 # Home / selected work (site entry)
├── sahayya.html               # Sahayya case study
├── kickfurther.html           # Kickfurther case study
├── assets/
│   ├── css/
│   │   ├── styles.css         # shared base: tokens, layout, components, responsive
│   │   └── kickfurther.css    # Kickfurther-only type + components
│   ├── js/
│   │   └── main.js            # scroll-spy, smooth scroll, fade-in, image fallback
│   └── img/
│       ├── sahayya/           # Sahayya graphics
│       └── kickfurther/       # Kickfurther graphics
├── docs/
│   └── figma-assets.md        # source Figma nodes for every exported image
└── README.md
```

## Design system

Shared tokens are CSS custom properties in `:root` (`assets/css/styles.css`):
grey scale (`--grey-40` … `--grey-950`), orange accent (`--orange-400`),
blue, and font tokens (`--font-display`, `--font-sans`, `--font-mono`).

Both pages use the same type system from the Figma design:
[Fraunces](https://fonts.google.com/specimen/Fraunces) (serif display) for
headings, [Ek Mukta](https://fonts.google.com/specimen/Ek+Mukta) for body,
and [Geist Mono](https://fonts.google.com/specimen/Geist+Mono) for labels
(a free stand-in for the design's licensed *Apercu Mono Pro*).
`assets/css/kickfurther.css` adds only Kickfurther-specific components
(promise cards, the compliance/alert widget, stat tiles) and a couple of
tone tweaks.

Both pages share the layout: sticky top nav, sticky left section-nav
sidebar with scroll-spy, and a 768px content column.

## Responsive

Breakpoints at **1080 / 900 / 640 / 400px** — the sidebar collapses to a
horizontal section list, grids and cards stack, and wide diagrams scroll
inside their own container.

## Images

Every graphic is exported from Figma into `assets/img/<project>/`. The map
from filename → source Figma node is in
[`docs/figma-assets.md`](docs/figma-assets.md). Each `<figure class="asset-slot">`
falls back to a labelled placeholder if its image is missing, so the pages
never show broken images.

## Run locally

Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```
