/* Glyphs drawn INTO the fur of a Plush Tile (and masked in the flat fallback).
   Own set, 24×24, single ink. `stroke` glyphs are outlines; the rest are fills.
   Tool logos come from simple-icons (see src/data/tools.js) in the same shape. */
export const GLYPHS = {
  instagram: {
    stroke: true,
    body: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none"/>',
  },
  linkedin: {
    body: '<path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9.5h4V21H3V9.5zM10 9.5h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.05c0-1.2-.02-2.75-1.68-2.75-1.68 0-1.94 1.31-1.94 2.66V21h-4V9.5z"/>',
  },
  cv: {
    stroke: true,
    body: '<path d="M7 2.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V4A1.5 1.5 0 0 1 7.5 2.5z"/><path d="M14 2.5v5h5"/><path d="M9.2 12.5h5.6M9.2 16.5h5.6"/>',
  },
  github: {
    body: '<path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.52.1.71-.23.71-.5v-1.78c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.95-.65.07-.64.07-.64 1.05.07 1.6 1.08 1.6 1.08.94 1.6 2.45 1.14 3.05.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.07-2.83-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.08a9.96 9.96 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.45.21 2.52.1 2.79.67.74 1.07 1.68 1.07 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.72.5A10.5 10.5 0 0 0 12 1.5z"/>',
  },
  behance: {
    body: '<path d="M9.4 5.6c1.1 0 1.96.21 2.6.62.63.4.94 1.04.94 1.92 0 .55-.13 1-.4 1.36-.27.36-.66.66-1.18.9.7.2 1.22.55 1.55 1.05.34.5.5 1.1.5 1.81 0 1.05-.4 1.85-1.18 2.4-.78.55-1.81.83-3.08.83H3V5.6h6.4zm-3.2 4.05h2.7c.55 0 .98-.12 1.27-.36.3-.24.45-.6.45-1.08 0-.42-.13-.74-.4-.96-.27-.22-.69-.33-1.27-.33H6.2v2.73zm0 5.2h3.05c.62 0 1.1-.13 1.43-.4.33-.27.5-.66.5-1.18 0-.5-.18-.9-.55-1.2-.37-.3-.88-.45-1.55-.45H6.2v3.23zM21 13.85h-5.6c.05.65.27 1.15.66 1.51.4.36.94.54 1.62.54.46 0 .87-.1 1.22-.31.36-.21.6-.5.74-.86h2.18c-.27.95-.81 1.7-1.61 2.23-.81.54-1.74.81-2.79.81-1.4 0-2.5-.42-3.32-1.27-.82-.85-1.23-1.97-1.23-3.36 0-1.36.42-2.47 1.26-3.33.84-.86 1.93-1.29 3.27-1.29 1.4 0 2.5.45 3.32 1.36.82.91 1.23 2.13 1.23 3.66v.31zm-2.36-1.45c-.05-.6-.25-1.06-.6-1.39-.34-.32-.81-.49-1.4-.49-.55 0-1.02.17-1.4.5-.4.34-.62.8-.69 1.38h4.09zM19.5 7H14.5V5.7h5V7z"/>',
  },
  email: {
    stroke: true,
    body: '<rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="m3.6 7.2 8.4 6 8.4-6"/>',
  },
}

/** A standalone SVG of the glyph in one ink. `strokeWidth` only matters for outline glyphs. */
export function glyphSvg(glyph, color, strokeWidth = 2.4) {
  const paint = glyph.stroke
    ? `fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"`
    : `fill="${color}"`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" color="${color}" ${paint}>${glyph.body}</svg>`
}

export function glyphUrl(glyph, color, strokeWidth) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(glyphSvg(glyph, color, strokeWidth))}`
}
