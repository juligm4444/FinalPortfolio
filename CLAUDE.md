# FinalPortfolio — juligm4.com

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
| `/projects/candelaria` | `pages/projects/Candelaria.jsx` |
| `/projects/sensewave` | `pages/projects/Sensewave.jsx` |
| `/contact` | `pages/Contact.jsx` |

## Key conventions

- **Never hardcode text in components.** All copy must go through `translations.js` and be consumed via the locale hook.
- **`<<text>>` syntax in translations** marks highlighted words — rendered by the `Highlight` component.
- **New projects** require an entry in `src/data/projects.js` (slug, i18n keys, accent color, skills, links) plus a new page under `src/pages/projects/` and a route in `App.jsx`.
- **Skill icons** come in pairs: `src/assets/skills/Normal/<Name>.png` and `src/assets/skills/Hovered/<Name>_hovered.png`.
- **`PillarsBackground`** is a global decorative layer rendered behind all content in `App.jsx`.
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
| `sensewave` | Academic (2024) | Speculative neurotechnology brand — design-only case study |
| `candelaria` | In development (2025–2026) | Full-stack site for a university solar vehicle team |

## Owner

Julián Galindo Mora — Design student, Universidad de los Andes, graduating 2028. Designer + developer. Contact: julian_gm4@hotmail.com
