import { siFigma, siReact, siNextdotjs, siPython, siDjango, siSupabase, siTailwindcss, siThreedotjs, siBlender, siUnity, siGit } from 'simple-icons'

/* V3 §G.3 — one Plush Tile per tool, its logo drawn in the fur. Logos from the
   simple-icons package (CC0). The list follows projects.tools in translations.
   SQL has no logo of its own there (only products such as MySQL), so it uses a
   simple own glyph: a database cylinder. */
const si = (icon) => ({ body: `<path d="${icon.path}"/>` })

export const TOOL_GLYPHS = {
  Figma: si(siFigma),
  React: si(siReact),
  'Next.js': si(siNextdotjs),
  Python: si(siPython),
  Django: si(siDjango),
  Supabase: si(siSupabase),
  Tailwind: si(siTailwindcss),
  'Three.js': si(siThreedotjs),
  Blender: si(siBlender),
  Unity: si(siUnity),
  Git: si(siGit),
  SQL: {
    stroke: true,
    body: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13"/><path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8"/>',
  },
}

/** Own glyphs (not from simple-icons), listed in the V3 report. */
export const OWN_TOOL_GLYPHS = ['SQL']

export const toolSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '')
