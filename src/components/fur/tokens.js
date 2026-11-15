/* The fur and botanical canvases cannot read CSS variables: this hands them the
   site tokens as plain colour strings, read once from :root (ACABADO §2: the
   only colours in a canvas are the tokens, read at start). */
let cache = null

const NAMES = ['mist', 'white', 'concrete-100', 'concrete-300', 'concrete-500', 'concrete-900', 'moss-200', 'moss-400', 'moss-700', 'bloom', 'bloom-deep', 'bloom-ink', 'flower-pink', 'flower-yellow', 'flower-violet', 'flower-white']

export function siteTokens() {
  if (cache) return cache
  const css = getComputedStyle(document.documentElement)
  const out = {}
  for (const n of NAMES) out[n.replace(/-(\d)/, '$1').replace('-', '')] = css.getPropertyValue(`--${n}`).trim()
  // keys: mist, white, concrete100…900, moss200, moss400, moss700, bloom, bloomdeep, bloomink, flowerpink, floweryellow, flowerviolet, flowerwhite
  cache = out
  return out
}

export function siteFont(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
