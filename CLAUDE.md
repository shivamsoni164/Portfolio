# Portfolio — Shivam Soni

A static personal portfolio website for Shivam Soni, UX Designer.

## Project Structure

```
Portfolio/
├── index.html      # Single-page layout
├── styles.css      # All styles with design tokens
├── main.js         # Minimal JS for scroll animations
└── CLAUDE.md
```

## Stack

- Plain HTML, CSS, JavaScript — no build tools, no frameworks
- Google Fonts: Playfair Display (serif, headings)
- System fonts: Helvetica Neue / Arial (sans-serif, body)

## Design System

Design tokens are defined as CSS custom properties in `:root` in `styles.css`:

- **Colors:** Grey scale (`--color-grey-*`) + project placeholder (`--color-project-placeholder: #c79999`)
- **Typography:** Two font families, sizes (`--font-size-*`), weights, line heights, letter spacings
- **Layout:** `--page-padding-x: 160px`, `--section-gap: 60px`, `--label-width: 259px`

### Layout Pattern

Sections use a two-column row pattern:
- Left: `.section-label` (fixed `259px` width, contains `<h2 class="label-text">`)
- Right: `.section-content` or section-specific content (flex: 1)

## Sections (in order)

1. **Hero** — Name, ampersand accent, tagline, body intro, CTA button
2. **Divider** — SVG horizontal rule
3. **Projects** — 2-column grid of `.project-card` (4 cards, placeholder thumbnails)
4. **My Process** — Label + body text bio

## Animations

`main.js` adds `.fade-in` to all `.section` and `.project-card` elements on load, then uses `IntersectionObserver` to add `.visible` when they scroll into view. CSS transitions handle the opacity/translateY effect.

## Responsive Breakpoints

- `≤ 1200px`: padding reduced to 80px
- `≤ 960px`: padding 40px, stacked section rows, fluid project grid
- `≤ 640px`: padding 24px, single-column project grid, smaller type scale

## Current State / TODOs

- Project cards have placeholder thumbnails (`background-color: #c79999`) and lorem ipsum text — need real content
- CTA "Ask me anything" button links to `#` — needs target
- No navigation / footer yet
- Open Graph image tag missing
