# FinalPortfolio — juligm4.com

> Redesign in progress: **`docs/REDESIGN.md` is the source of truth and wins over this file if they contradict.**

Personal portfolio for Julián Galindo Mora. React + Vite SPA deployed on Vercel.

## Stack

- **Framework:** React 18 + Vite 5
- **Routing:** React Router DOM 6 (defined in `src/App.jsx`)
- **Styling:** Tailwind CSS 3 (`tailwind.config.js`)
- **Animation:** Framer Motion 11, GSAP 3, Three.js + React Three Fiber
- **i18n:** Custom `LocaleProvider` — all copy lives in `src/i18n/translations.js` (en/es)
- **Theme:** Custom `ThemeProvider` — dark/light via `data-theme` on `<html>`, persisted to `localStorage` key `juligm4.theme`
- **Deployment:** Vercel (`vercel.json`)

## Project structure

```
src/
  App.jsx              # Route definitions
  main.jsx             # Entry point
  components/          # Reusable UI primitives
  sections/            # Page-level content blocks
  pages/               # Route-level pages
    projects/          # Per-project case study pages
  data/
    projects.js        # Single source of truth for project cards
  i18n/
    translations.js    # Single source of truth for all UI text (en + es)
    LocaleProvider.jsx
  theme/
    ThemeProvider.jsx
  hooks/
  assets/
    badges/            # Certification badge PNGs
    files/             # CV-English.pdf, CV-Español.pdf
    fonts/             # Libre Baskerville, Roboto Mono (variable)
    identity/          # Logo variants (Icon, DarkIcon, LightIcon)
    images/            # Project images (candelaria/, licorimetro/)
    skills/Normal/     # Tech stack icons — default state
    skills/Hovered/    # Tech stack icons — hovered state
```

## Pages & routes

| Route | Component |
|---|---|
| `/` | `pages/Home.jsx` |
| `/about` | `pages/About.jsx` |
| `/projects` | `pages/Projects.jsx` |
| `/projects/licorimetro` | `pages/projects/Licorimetro.jsx` |
| `/projects/candelaria` | `pages/projects/Candelaria.jsx` (brand, default export) |
| `/projects/candelaria-website` | `pages/projects/Candelaria.jsx` (`CandelariaWebsite`) |
| `/projects/sensewave` | `pages/projects/Sensewave.jsx` |
| `/projects/umbral` | `pages/projects/Umbral.jsx` |
| `/projects/bloom` | `pages/projects/Bloom.jsx` |
| `/contact` | `pages/Contact.jsx` |

## Key conventions

- **Never hardcode text in components.** All copy must go through `translations.js` and be consumed via the locale hook.
- **`<<text>>` syntax in translations** marks highlighted words — rendered by the `Highlight` component.
- **New projects** require an entry in `src/data/projects.js` (slug, i18n keys, accent color, skills, links) plus a new page under `src/pages/projects/` and a route in `App.jsx`.
- **Skill icons** come in pairs: `src/assets/skills/Normal/<Name>.png` and `src/assets/skills/Hovered/<Name>_hovered.png`.
- **`PillarsBackground`** is a global decorative layer rendered behind all content in `App.jsx`.
- **Case-study typography is fixed site-wide:** Libre Baskerville (`font-display`) for headings, Roboto Mono (`font-body`) for prose, Space Grotesk (`font-nav`) for labels, tags and buttons. Layout and palette may vary per project; fonts may not.
- Theme is applied via `data-theme` attribute, so CSS should use `[data-theme='dark']` selectors rather than a `.dark` class.

## Dev commands

```bash
npm run dev      # start dev server (Vite)
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

## Projects

| Slug | Status | Description |
|---|---|---|
| `licorimetro` | Academic (2023) | Android mobile app with OCR for beverage discovery |
| `sensewave` | Academic (2025) | Speculative neurotechnology brand — design-only case study |
| `candelaria` | In development (Oct 2025–present) | Brand + full-stack site for the university solar vehicle research hub (semillero) |
| `bloom` | Freelance (Jun 2026) | UX research, information architecture and wireframing for Bloom / BeBloomers |
| `umbral` | Year not set in data | Object project (El Umbral) — date to be confirmed |

## Owner

Julián Galindo Mora — Design student, Universidad de los Andes (since 2025-2, expected graduation 2028). Previously Systems & Computer Engineering at the same university, 2021-1 to 2025-1 (9 semesters; Visual Computing option completed). Designer + developer. Contact: julian_gm4@hotmail.com
