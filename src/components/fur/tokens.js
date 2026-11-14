/* The fur and botanical canvases cannot read CSS variables: this hands them the
   site tokens as plain colour strings, read once from :root (ACABADO §2: the
   only colours in a canvas are the tokens, read at start). */
let cache = null

const NAMES = ['mist', 'concrete-100', 'concrete-300', 'concrete-500', 'concrete-900', 'moss-400', 'moss-700', 'lichen-300', 'bloom', 'bloom-deep']

export function siteTokens() {
  if (cache) return cache
  const css = getComputedStyle(document.documentElement)
  const out = {}
  for (const n of NAMES) out[n.replace(/-(\d)/, '$1').replace('-', '')] = css.getPropertyValue(`--${n}`).trim()
  // keys: mist, concrete100, concrete300, concrete500, concrete900, moss400, moss700, lichen300, bloom, bloomdeep
  cache = out
  return out
}

export function siteFont(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
