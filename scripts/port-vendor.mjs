/* npm run port:vendor — V3: los componentes de pelo y el Botanical parten de los
   originales de vendor/, no de adaptaciones hechas a mano.

   Este script toma cada original (vendor/originkit/*.tsx|md, sin modificar),
   le quita los tipos con esbuild y aplica una lista corta y explícita de
   parches. Cada parche debe coincidir exactamente N veces o el script falla,
   así que la diferencia con el original es esta lista y nada más:

   - Fondo transparente (el sitio no pone cajas detrás de nada).
   - El control real (<a>/<button>) lo pone el sitio: el componente escucha el
     puntero en ese elemento (`hitRef`) y no captura eventos por su cuenta.
   - `onFrame`: aviso tras cada cuadro dibujado, para sacar la imagen de reposo
     y saber cuándo la pieza volvió a quedar quieta.
   - Color solo por props (tokens leídos por el sitio): los hex del original se
     convierten a rgb() y nunca se usan.
   - Nada de red: sin Google Fonts ni imágenes de CDN por defecto.
   - El contexto WebGL se suelta al desmontar.

   Salida: src/components/fur/*.jsx y src/components/botanical/*.js (generados; no editar a mano). */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const hexToRgb = (code) =>
  code.replace(/(["'`])#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\1/g, (_, q, h) => {
    const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    const n = [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16))
    return `${q}rgb(${n.join(', ')})${q}`
  })

/* Releases the context only on a real unmount: under StrictMode the effect is
   torn down and re-run on the same canvas, which must keep its context. */
const LOSE = (gl, canvas) =>
  `setTimeout(() => { if (!${canvas}.isConnected) ${gl}.getExtension("WEBGL_lose_context")?.loseContext(); }, 0);`

const PORTS = [
  {
    from: 'vendor/originkit/PlushTile.tsx',
    to: 'src/components/fur/PlushTileCanvas.jsx',
    loader: 'tsx',
    patches: [
      ['"use client";\n', ''],
      // no network default artwork
      [/ {2}image = \{ "alt": "", "src": "https:\/\/cdn\.brandfetch\.io[^}]*\},\n/, '  image = null,\n'],
      // site-owned control, rest-frame callback, moss tips
      ['  style\n}) {\n  const rootRef', '  style,\n  hitRef,\n  pointerSeed,\n  onFrame,\n  tipColor,\n  tipMix = 0\n}) {\n  const rootRef'],
      ['  const cfg = {\n', '  const cfg = {\n    onFrame,\n    tipColor,\n    tipMix,\n'],
      // transparent ground: the studio pass paints nothing
      ['      alpha: false,\n', '      alpha: true,\n'],
      ['    o = vec4(toSrgb(col) + (n - 0.5) / 255.0, 1.0);', '    o = vec4(0.0);'],
      // pointer on the real control
      ['    const ptr = { cx: 0, cy: 0, u: 0.5, v: 0.5, over: false, moved: false };\n',
        '    const hit = hitRef?.current ?? root;\n    const ptr = { cx: 0, cy: 0, u: 0.5, v: 0.5, over: false, moved: false };\n    if (pointerSeed) {\n      ptr.cx = pointerSeed.x;\n      ptr.cy = pointerSeed.y;\n      ptr.over = true;\n      ptr.moved = true;\n    }\n'],
      [/root\.(add|remove)EventListener\("pointer/g, 'hit.$1EventListener("pointer', 12],
      // moss-400 tips on the base fur; the artwork's hairs keep their own colour
      ['uniform float uJitter, uTipFade, uRootShade, uSheen, uRim, uCount, uDepth;',
        'uniform float uJitter, uTipFade, uRootShade, uSheen, uRim, uCount, uDepth;\nuniform vec3 uTip, uFurC;\nuniform float uTipMix;'],
      ['    vec3 alb = texture(uArt, artUv(P0.xy)).rgb * (1.0 + (hj - 0.5) * 2.0 * uJitter) * aC.w * layer;',
        '    vec3 alb0 = texture(uArt, artUv(P0.xy)).rgb;\n    float isFur = 1.0 - clamp(distance(alb0, uFurC) * 5.0, 0.0, 1.0);\n    alb0 = mix(alb0, uTip, uTipMix * isFur * smoothstep(0.25, 1.0, s));\n    vec3 alb = alb0 * (1.0 + (hj - 0.5) * 2.0 * uJitter) * aC.w * layer;'],
      ['      U_ST.f1("uCrimpK", clampN(adv2.crimp, 0, 100, DEFAULT_ADVANCED.crimp) / 100);\n',
        '      U_ST.f1("uCrimpK", clampN(adv2.crimp, 0, 100, DEFAULT_ADVANCED.crimp) / 100);\n      const tp = parseColor(c.tipColor, FUR_FALLBACK);\n      U_ST.f3("uTip", lin(tp[0]), lin(tp[1]), lin(tp[2]));\n      U_ST.f3("uFurC", lin(fc[0]), lin(fc[1]), lin(fc[2]));\n      U_ST.f1("uTipMix", c.tipColor ? clampN(c.tipMix, 0, 1, 0) : 0);\n'],
      // rest-frame callback
      ['      if (active || breezeK > 0) wake();\n',
        '      c.onFrame?.(canvas, { settled: !(active || breezeK > 0), over: ptr.over, image: imgState, cssW, cssH });\n      if (active || breezeK > 0) wake();\n'],
      ['      programs.forEach((p) => gl.deleteProgram(p));\n', `      programs.forEach((p) => gl.deleteProgram(p));\n      ${LOSE('gl', 'canvas')}\n`],
      ['...style, overflow: "hidden", background, touchAction: "pan-y" }}',
        '...style, overflow: "hidden", background: "transparent", touchAction: "pan-y", pointerEvents: hitRef ? "none" : undefined }}'],
      ['export default function PlushTile(props)', 'export default function PlushTileCanvas(props)'],
    ],
  },
]

const only = process.argv.slice(2)
for (const port of PORTS) {
  if (only.length && !only.some((o) => port.to.includes(o))) continue
  const src = await readFile(resolve(root, port.from), 'utf8')
  let { code } = await transform(src, { loader: port.loader, jsx: 'preserve', target: 'es2022' })
  for (const [find, put, count = 1] of port.patches) {
    const n = typeof find === 'string' ? code.split(find).length - 1 : (code.match(new RegExp(find.source, find.flags.includes('g') ? find.flags : find.flags + 'g')) ?? []).length
    if (n !== count) {
      console.error(`port:vendor: ${port.from}\n  parche con ${n} coincidencias (esperaba ${count}):\n  ${String(find).slice(0, 140)}`)
      process.exit(1)
    }
    code = typeof find === 'string' ? code.split(find).join(put) : code.replace(find, put)
  }
  code = hexToRgb(code)
  const header =
    `/* GENERADO por scripts/port-vendor.mjs desde ${port.from} — no editar a mano.\n` +
    `   Es el original sin tipos más los parches listados en ese script. */\n/* eslint-disable */\n`
  const out = resolve(root, port.to)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, header + code)
  console.log(`port:vendor: ${port.from} → ${port.to} (${port.patches.length} parches)`)
}
