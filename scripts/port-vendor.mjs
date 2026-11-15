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

/* Mohair Capsule and Velour Bolster share one structure (Mohair is a variation of
   Velour), so they take the same patches. `fit` lays the button out at its real
   pixel size (u = 1) instead of scaling it inside the 1200×800 reference frame. */
const buttonPatches = (hit, name) => [
  ['"use client";\n', ''],
  ['    onClick,\n    style\n  } = props;\n',
    '    onClick,\n    style,\n    hitRef,\n    onFrame,\n    fit\n  } = props;\n  const onFrameRef = useRef(null);\n  onFrameRef.current = onFrame;\n'],
  ['  onFrameRef.current = onFrame;\n', '  onFrameRef.current = onFrame;\n  const fitRef = useRef(fit);\n  fitRef.current = fit;\n'],
  ['      const Su = Math.min(H2, W2 / REF_ASPECT);', '      const Su = fitRef.current ? REF_H : Math.min(H2, W2 / REF_ASPECT);'],
  ['  const S = Math.min(size.h, size.w / REF_ASPECT);\n  const u = S / REF_H;',
    '  const S = fit ? REF_H : Math.min(size.h, size.w / REF_ASPECT);\n  const u = S / REF_H;'],
  ['    const root = rootRef.current;\n', '    const root = rootRef.current;\n    const hitEl = hitRef?.current ?? root;\n'],
  [/root\.(add|remove)EventListener\("pointer/g, 'hitEl.$1EventListener("pointer', 10],
  [`root.querySelector("[data-${hit}-hit]")`, `(hitRef?.current ?? root.querySelector("[data-${hit}-hit]"))`, 2],
  [`{href ? <a\n    data-${hit}-hit=""`, `{hitRef ? null : href ? <a\n    data-${hit}-hit=""`],
  ['      drawnFrames++;\n',
    '      drawnFrames++;\n      onFrameRef.current?.(canvas, { settled: settled && !pt.has && !pt.down, over: pt.has, image: "ok", cssW: canvas.clientWidth, cssH: canvas.clientHeight });\n'],
  ['  document.head.appendChild(link);', '  onReady();'],
  ['      background,\n', '      background: "transparent",\n'],
  ['      touchAction: "pan-y",\n', '      touchAction: "pan-y",\n      pointerEvents: hitRef ? "none" : void 0,\n'],
  ['        g.deleteProgram(prog);\n', `        g.deleteProgram(prog);\n        ${LOSE('g', 'canvas')}\n`],
  [`export default function ${name}(props)`, `export default function ${name}Canvas(props)`],
]
PORTS.push(
  {
    from: 'vendor/originkit/MohairCapsule.md',
    to: 'src/components/fur/MohairCapsuleCanvas.jsx',
    loader: 'tsx',
    patches: [
      ...buttonPatches('mc', 'MohairCapsule'),
      // V3 §C.2: roots in --concrete-500 and glints in --mist, not derived from the fur hue
      ['    fit\n  } = props;\n', '    fit,\n    tipColor,\n    rootColor\n  } = props;\n'],
      ['  const cfg = { bwRef, bhRef, rRef, furColor, furLength, textColor, lines, font, pl, rs, adv, sway };',
        '  const cfg = { bwRef, bhRef, rRef, furColor, furLength, textColor, lines, font, pl, rs, adv, sway, tipColor, rootColor };'],
      ['uniform vec3 uTip;       // tip and glint colour, linear', 'uniform vec3 uTip;       // tip and glint colour, linear\nuniform vec3 uRoot;'],
      ['    vec3 under = mix(uFur * mix(0.55, 0.8, rimLift),', '    vec3 under = mix(uRoot * mix(0.85, 1.1, rimLift),'],
      ['        "uTip",\n', '        "uTip",\n        "uRoot",\n'],
      ['        state.tip = [f[0] / mx * 0.55 + 0.1, f[1] / mx * 0.9 + 0.12, f[2] / mx * 0.9 + 0.1];\n',
        '        state.tip = c.tipColor ? resolveRGB(root, c.tipColor).map(srgbToLin) : [f[0] / mx * 0.55 + 0.1, f[1] / mx * 0.9 + 0.12, f[2] / mx * 0.9 + 0.1];\n        state.root = c.rootColor ? resolveRGB(root, c.rootColor).map(srgbToLin) : f.map((v) => v * 0.68);\n'],
      ['      setU("uTip", state.tip[0], state.tip[1], state.tip[2]);\n', '      setU("uTip", state.tip[0], state.tip[1], state.tip[2]);\n      setU("uRoot", state.root[0], state.root[1], state.root[2]);\n'],
    ],
  },
  { from: 'vendor/originkit/VelourBolster.tsx', to: 'src/components/fur/VelourBolsterCanvas.jsx', loader: 'tsx', patches: buttonPatches('vb', 'VelourBolster') },
)

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
