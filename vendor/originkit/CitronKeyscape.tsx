/* eslint-disable */
// Citron Keyscape — Originkit

// Delivered by Originkit · stack: nextjs
"use client";

const RenderTarget = {
  current: () => "preview",
  hasRestrictions: () => false,
  canvas: "canvas",
  export: "export",
  preview: "preview",
  thumbnail: "thumbnail",
};

"use client"
import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import * as THREE from "three"

/* ------------------------------------------------------------------ *
 *  CitronLegend
 *
 *  A bed of oversized keycaps in a dark studio, seen from above at an
 *  angle: black caps with dot-matrix legends, white caps with dark ones,
 *  and in the middle a raised citron cap that glows from inside, a mark
 *  printed on its top and the caption down its front face. Its light
 *  spills green onto its neighbours; the caps nearest the lens fall out
 *  of focus; a soft beam hangs in the haze above.
 *
 *  Built after a "Coming Soon / create your edge" teaser poster
 *  (736 x 920). Measured off it and kept as the defaults:
 *    - the camera, fitted to the poster's legend centres and hero corners
 *      (6 px rms): the grid turned 47 deg to the lens, looked down on at
 *      42.6 deg through a 21 deg lens; the hero stands 70% of a cap
 *      height proud. The poster twists it 9.6 deg on its stem; here it
 *      sits square with the grid like every other cap (Hero Turn
 *      restores the twist);
 *    - words cycle so the ring round the hero reads as the poster's:
 *      "create" behind, "edge" left and right-front, "your" right-behind
 *      and left-front, with black/lime, white/black and black/white caps,
 *      each word set to the same width in dots;
 *    - the mark (a steep bar with a block either side), the caption's
 *      size and place, and the smear's extent were traced off the hero's
 *      faces unwarped out of the poster through that camera;
 *    - the hero and the ring behind it are sharp, the caps in front blur
 *      hard, and the bed beyond falls into the dark under a lime-tinted
 *      beam.
 *
 *  HOW IT IS MADE
 *    Plain three.js. Each cap is one smooth lofted mesh: rounded-square
 *    rings tapering up the walls, a rolled top edge and a shallow dished
 *    top. All the caps for one word share an InstancedMesh. Printing is
 *    done in the material, from the cap's own object-space position, so
 *    the legends sit on the dish and the caption on the wall without UVs.
 *    The hero adds an emissive term that is strongest low on its walls,
 *    the way a translucent cap lit from beneath glows, and a point light
 *    inside it throws that colour on the caps around.
 *    One spotlight with soft shadows does the lighting; a generated
 *    studio gives the black caps their glossy edges. Post is hand-rolled:
 *    depth of field gathered at half resolution, a three-level bloom, fog
 *    into Background, the beam and the glow hanging behind the hero, lens
 *    fringing and a prism flare at the edges, vignette and a fixed grain.
 *    Focus and fog both read one number the scene writes to its alpha: how
 *    far a point stands in front of or behind the hero along the ground
 *    (see NEAR_BAND), which is what keeps the whole hero sharp while the
 *    caps in front of it blur, as in the poster.
 *
 *  Interaction
 *    Hover   the cap under the pointer dips; the view leans toward it.
 *    Press   it goes all the way down and springs back; the hero flares.
 *
 *  Frames are paced: 60 fps while anything moves, 30 fps for the idle
 *  breathing, none at all once it has settled with Speed at 0.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 736
 * @framerIntrinsicHeight 920
 * ------------------------------------------------------------------ */

/* ----------------------------------------------------------- types */

export interface CitronLegendCaption {
    show: boolean
    lines: string[]
}

export interface CitronLegendColors {
    /** The hero cap, its glow, and the ink of the first word. */
    accent: string
    /** White caps, and the ink on black caps of the third word. */
    light: string
    /** Black caps, and the ink on white caps. */
    dark: string
}

export interface CitronLegendAdvanced {
    heroLift: number
    heroTurn: number
    keyGap: number
    dish: number
    yaw: number
    tilt: number
    lens: number
    blur: number
    exposure: number
    haze: number
    fringe: number
    vignette: number
    grain: number
}

export interface CitronLegendProps {
    /** Legends printed on the caps round the hero, cycled across the grid. */
    words?: string[]
    /** A logo printed on the hero's top in place of the X mark (its own colours). */
    logo?: string
    /** The dark the caps fall away into. */
    background?: string
    /** Lines printed down the hero's front face. */
    caption?: Partial<CitronLegendCaption>
    /** Typeface of the caption; its size is fitted to the face. */
    font?: CSSProperties
    /** Ink of the caption, the mark and the smeared print. */
    textColor?: string
    /** %: how big the caps draw; lower shows more of the bed. */
    scale?: number
    colors?: Partial<CitronLegendColors>
    /** 0-10: how brightly the hero glows and spills onto its neighbours. */
    glow?: number
    /** 0-10: how far the view leans toward the pointer. */
    parallax?: number
    /** 0-10: how far a cap travels under the pointer. */
    press?: number
    /** 0-10: idle breathing of the glow and drift of the view; 0 holds it still. */
    speed?: number
    advanced?: Partial<CitronLegendAdvanced>
    style?: CSSProperties
}

/* ----------------------------------------------------------- defaults */

const DEFAULT_WORDS = ["create", "your", "edge"]

const DEFAULT_CAPTION: CitronLegendCaption = { show: true, lines: ["Coming", "Soon"] }

const DEFAULT_FONT = {
    // The poster's caption is a tight, tall grotesk; Inter Tight is the
    // nearest face Framer ships.
    fontFamily: "Inter Tight",
    variant: "Semibold",
    fontWeight: 600,
    fontSize: 24,
    lineHeight: "1.12em",
    letterSpacing: "-0.03em",
}

const DEFAULT_COLORS: CitronLegendColors = {
    accent: "#D2F53A",
    light: "#E2E2E2",
    dark: "#121212",
}

const DEFAULTS = {
    background: "#0B0B0B",
    textColor: "#111111",
    scale: 100,
    glow: 10,
    parallax: 10,
    press: 10,
    speed: 3,
}

const DEFAULT_ADVANCED: CitronLegendAdvanced = {
    heroLift: 70,
    heroTurn: 0,
    keyGap: 7,
    dish: 3,
    yaw: 47,
    tilt: 42.6,
    lens: 21,
    blur: 100,
    exposure: 100,
    haze: 100,
    fringe: 100,
    vignette: 55,
    grain: 4,
}

/* ----------------------------------------------------------- constants */

/** Caps either side of the hero, each way. 13 x 13 covers the bed down to 30% Scale. */
const GRID = 6
/** Cap height, and how much narrower the top is than the base, per side (pitch = 1). */
const CAP_H = 0.5
const TAPER = 0.095
/** Corner radius of the walls at the base and the top, and of the rolled top edge. */
const R_BASE = 0.09
const R_TOP = 0.075
const EDGE_R = 0.04
/** Half the frame's height at the hero, in pitches, at 100% Scale: the poster's framing.
 *  Fitted with the defaults' yaw, tilt, lens and lift to the poster's legend centres and
 *  hero corners (6 px rms at 736 x 920). */
const VIEW_HALF = 1.45
/** The poster sets the hero low: its aim point sits this far below centre, in NDC. */
const AIM_SHIFT = 0.115
/** The poster's aspect; a wider frame keeps its height and shows more bed at the sides. */
const REF_ASPECT = 736 / 920
/** Where the lens points: a little below the hero's top, as the poster sits. */
const AIM_DROP = 0.1
/**
 * Focus is measured along the ground, not in view depth: the signed distance
 * of a point's footprint from the hero's, along the lens's heading. In view
 * depth the hero's high top sits as near the lens as the tops of the caps in
 * front of it, so no focus distance keeps the one sharp and blurs the other
 * the way the poster does. On the ground the hero spans +-0.47, the caps in
 * front start beyond that and the ring behind sits at +1.4.
 */
const NEAR_BAND = 0.45
const FAR_BAND = 1.6
/** Blur circle per pitch outside the band, as a share of the frame height. */
const APERTURE = 0.0435
/** Far caps blur this much less than near ones: the poster's short focus throw. */
const FAR_BLUR = 0.35
/** Ground pitches the focus distance is encoded over in the scene's alpha. */
const FOCUS_RANGE = 16
/** Ground pitches behind the hero where the bed starts to fade into Background. */
const FOG_START = 1.2
/** Pitches a cap travels at Press 10. */
const PRESS_TRAVEL = 0.2
/** Dot-matrix legends: the poster sets every word to the same width (a
 *  4-letter word gets bigger dots than a 6-letter one), as a share of the
 *  cap top, with the dots capped for very short words; and the raster the
 *  dots come from. */
const LEGEND_WIDTH = 0.75
const DOT_MAX = 0.04
const DOT_FONT = '16px "Courier New", Courier, monospace'
/** The caption's cap height on the hero's front wall, in pitches, as the
 *  poster sets it; a wide face is held to the wall's width instead. */
const CAPTION_CAP = 0.17
const FALLBACK_FAMILY = '"Helvetica Neue", Helvetica, Arial, sans-serif'
/** Most device pixels the scene is drawn at; larger frames render below DPR. */
const MAX_PIXELS = 2.4e6
const DEG = Math.PI / 180

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const num = (x: unknown, fallback: number) => (typeof x === "number" && isFinite(x) ? x : fallback)
/** Reads a File control's URL or an image control's { src } alike. */
const srcOf = (v: unknown): string =>
    typeof v === "string" ? v : v && typeof v === "object" && typeof (v as { src?: unknown }).src === "string" ? (v as { src: string }).src : ""
const familyOf = (f: CSSProperties) => (f.fontFamily ? `${f.fontFamily}, ${FALLBACK_FAMILY}` : FALLBACK_FAMILY)
const emOf = (v: unknown, fallback: number) => {
    if (typeof v === "number") return v
    if (typeof v === "string") {
        const n = parseFloat(v)
        if (isFinite(n)) return v.trim().endsWith("px") ? n / 24 : v.trim().endsWith("%") ? n / 100 : n
    }
    return fallback
}

/** Seeded so the smeared print is the same on every render and every machine. */
function mulberry(seed: number) {
    return () => {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/* ----------------------------------------------------------- geometry */

interface CapShape {
    /** Half-width at the base and at the top of the wall. */
    base: number
    top: number
    height: number
    dish: number
    /** Extra straight wall below the base (the hero's raised stem). */
    skirt: number
}

/** Half-width of a cap's wall at height y (object space). */
const wallHalf = (s: CapShape, y: number) => lerp(s.base, s.top, clamp(y / (s.height - EDGE_R)))

/**
 * One smooth lofted mesh: rounded-square rings up the tapered wall, round
 * the rolled edge and in across the dished top to the centre. Every ring
 * shares the same perimeter samples, so the whole cap is one grid and the
 * normals are smooth everywhere, corners and rim included.
 */
function capGeometry(s: CapShape): THREE.BufferGeometry {
    const ARC = 10
    const SIDE = 5
    type Pt = { sx: number; sz: number; c: number; s: number }
    const corners: [number, number][] = [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1],
    ]
    const samples: { a: Pt; b: Pt; t: number }[] = []
    for (let k = 0; k < 4; k++) {
        const [sx, sz] = corners[k]
        const [nx, nz] = corners[(k + 1) % 4]
        for (let q = 0; q <= ARC; q++) {
            const ang = (k + q / ARC) * (Math.PI / 2)
            const p = { sx, sz, c: Math.cos(ang), s: Math.sin(ang) }
            samples.push({ a: p, b: p, t: 0 })
        }
        const endAng = (k + 1) * (Math.PI / 2)
        const a = { sx, sz, c: Math.cos(endAng), s: Math.sin(endAng) }
        const b = { sx: nx, sz: nz, c: Math.cos(endAng), s: Math.sin(endAng) }
        for (let q = 1; q <= SIDE; q++) samples.push({ a, b, t: q / (SIDE + 1) })
    }
    const M = samples.length
    const rings: [number, number, number][] = [] // half-width, corner radius, y
    if (s.skirt > 0) rings.push([s.base, R_BASE, -s.skirt], [s.base, R_BASE, -s.skirt * 0.5])
    const ys = s.height - EDGE_R
    for (let q = 0; q <= 5; q++) {
        const t = q / 5
        rings.push([lerp(s.base, s.top, t), lerp(R_BASE, R_TOP, t), t * ys])
    }
    for (let q = 1; q <= 6; q++) {
        const f = (q / 6) * (Math.PI / 2)
        const inset = EDGE_R * (1 - Math.cos(f))
        rings.push([s.top - inset, Math.max(0.01, R_TOP - inset), ys + EDGE_R * Math.sin(f)])
    }
    const h0 = s.top - EDGE_R
    const r0 = R_TOP - EDGE_R
    for (let q = 1; q <= 10; q++) {
        const f = 1 - q / 10
        rings.push([h0 * f, Math.max(0.001, r0 * f), s.height - s.dish * (1 - f * f)])
    }
    const pos = new Float32Array(rings.length * M * 3)
    let o = 0
    const at = (p: Pt, h: number, r: number): [number, number] => [p.sx * (h - r) + r * p.c, p.sz * (h - r) + r * p.s]
    for (const [h, r, y] of rings) {
        const rr = Math.min(r, h)
        for (const sm of samples) {
            const [ax, az] = at(sm.a, h, rr)
            const [bx, bz] = at(sm.b, h, rr)
            pos[o++] = lerp(ax, bx, sm.t)
            pos[o++] = y
            pos[o++] = lerp(az, bz, sm.t)
        }
    }
    const idx: number[] = []
    for (let k = 0; k < rings.length - 1; k++) {
        for (let m = 0; m < M; m++) {
            const a = k * M + m
            const b = k * M + ((m + 1) % M)
            const c = a + M
            const d = b + M
            idx.push(a, c, b, b, c, d)
        }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    geo.computeBoundingSphere()
    return geo
}

/* ----------------------------------------------------------- printing */

/** Spliced into MeshPhysicalMaterial: prints from object-space position,
 *  the hero's inner glow, contact shadow low on the walls, and linear
 *  depth written to alpha for the depth of field. */
const PRINT_HEAD = /* glsl */ `
varying vec3 vObjP;
varying vec3 vObjN;
uniform sampler2D uTopMap;
uniform float uTopHalf;
uniform vec3 uTopInk;
uniform float uTopTint;
uniform float uInkGlow;
uniform float uRange;
varying float vFocusD;
uniform float uAo;
uniform float uCapH;
#ifdef HERO
uniform sampler2D uFrontMap;
uniform sampler2D uSideMap;
uniform vec3 uFaceInk;
uniform float uFaceHalf;
uniform float uFaceTop;
uniform float uFaceBottom;
uniform vec3 uGlowColor;
#endif
`

const PRINT_BODY = /* glsl */ `
float printA = 0.0;
float smearA = 0.0;
vec3 printInk = vec3(0.0);
{
    vec3 on = normalize(vObjN);
    float topW = smoothstep(0.8, 0.96, on.y);
    vec4 t = texture2D(uTopMap, vObjP.xz / (2.0 * uTopHalf) + 0.5);
    vec3 ink = mix(t.rgb, uTopInk, uTopTint);
    float a = t.a * topW;
    diffuseColor.rgb = mix(diffuseColor.rgb, ink, a);
    printA = a;
    printInk = ink;
    #ifdef HERO
    float v = (uFaceTop - vObjP.y) / (uFaceTop - uFaceBottom);
    // clamp-to-edge would smear the canvas's first row up over the roll
    float inV = step(0.0, v) * step(v, 1.0);
    vec4 f = texture2D(uFrontMap, vec2(vObjP.x / (2.0 * uFaceHalf) + 0.5, v));
    // the walls lean back and their normals bend into the rolled edge, so
    // the fade is loose enough to print right up to the roll
    float fa = f.a * smoothstep(0.45, 0.75, on.z) * inV;
    vec4 s = texture2D(uSideMap, vec2(-vObjP.z / (2.0 * uFaceHalf) + 0.5, v));
    float sa = s.a * smoothstep(0.45, 0.75, on.x) * inV;
    diffuseColor.rgb = mix(diffuseColor.rgb, uFaceInk, fa);
    // the smear is a paler, glossier print of the cap's own colour
    diffuseColor.rgb = mix(diffuseColor.rgb, min(diffuseColor.rgb * 1.7, vec3(1.0)), sa);
    printA = max(printA, fa);
    smearA = sa;
    #endif
}
`

const EMIT_BODY = /* glsl */ `
totalEmissiveRadiance += printInk * uInkGlow * printA;
#ifdef HERO
{
    vec3 on = normalize(vObjN);
    float wall = 1.0 - smoothstep(0.45, 0.9, on.y);
    float low = 1.0 - smoothstep(uFaceBottom, uFaceTop + 0.08, vObjP.y);
    // lit from beneath: the walls glow low down and the light thins out
    // toward the top, which takes the key light instead
    float g = mix(0.05, 1.0, wall * low * low * low);
    totalEmissiveRadiance += uGlowColor * (g * (1.0 - printA) + smearA * 1.4);
}
#endif
`

const AO_BODY = /* glsl */ `
{
    float ao = mix(1.0 - uAo, 1.0, smoothstep(-0.05, uCapH * 0.8, vObjP.y));
    outgoingLight = (outgoingLight - totalEmissiveRadiance) * ao + totalEmissiveRadiance;
}
`

const FOCUS_VERTEX = /* glsl */ `
{
    vec4 fp = vec4(transformed, 1.0);
    #ifdef USE_INSTANCING
    fp = instanceMatrix * fp;
    #endif
    fp = modelMatrix * fp;
    vFocusD = dot(fp.xz, uFwd);
}
`

const DEPTH_TAIL = /* glsl */ `
gl_FragColor.a = clamp(0.5 + vFocusD / (2.0 * uRange), 0.002, 1.0);
`

function hookMaterial(mat: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial, uniforms: Record<string, THREE.IUniform>, kind: "key" | "hero" | "plate") {
    if (kind === "hero") mat.defines = { HERO: "" }
    mat.customProgramCacheKey = () => "citron-" + kind
    mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, uniforms)
        sh.vertexShader = sh.vertexShader
            .replace("#include <common>", "#include <common>\nuniform vec2 uFwd;\nvarying float vFocusD;")
            .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\n" + FOCUS_VERTEX)
        if (kind === "plate") {
            sh.fragmentShader = sh.fragmentShader
                .replace("#include <common>", "#include <common>\nuniform float uRange;\nvarying float vFocusD;")
                .replace("#include <opaque_fragment>", "#include <opaque_fragment>\n" + DEPTH_TAIL)
            return
        }
        sh.vertexShader = sh.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec3 vObjP;\nvarying vec3 vObjN;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjP = position;\nvObjN = normal;")
        sh.fragmentShader = sh.fragmentShader
            .replace("#include <common>", "#include <common>\n" + PRINT_HEAD)
            .replace("#include <map_fragment>", "#include <map_fragment>\n" + PRINT_BODY)
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n" + EMIT_BODY)
            .replace("#include <opaque_fragment>", AO_BODY + "\n#include <opaque_fragment>\n" + DEPTH_TAIL)
    }
}

/** A legend as the poster prints it: the word rasterised small, then
 *  every lit pixel stamped as a rounded dot. White on clear; the
 *  material tints it. */
function paintWord(ctx: CanvasRenderingContext2D, scratch: CanvasRenderingContext2D, N: number, word: string) {
    ctx.clearRect(0, 0, N, N)
    const w = word.trim()
    if (!w) return
    scratch.font = DOT_FONT
    const tw = Math.ceil(scratch.measureText(w).width) + 2
    const th = 22
    scratch.canvas.width = tw
    scratch.canvas.height = th
    scratch.font = DOT_FONT
    scratch.fillStyle = "#fff"
    scratch.textBaseline = "alphabetic"
    scratch.fillText(w, 1, 15)
    const px = scratch.getImageData(0, 0, tw, th).data
    // fitted and centred on the ink, not the advance: Courier's letters sit
    // well inside their cells
    let x0 = tw
    let x1 = 0
    let y0 = th
    let y1 = 0
    for (let y = 0; y < th; y++)
        for (let x = 0; x < tw; x++)
            if (px[(y * tw + x) * 4 + 3] >= 96) {
                x0 = Math.min(x0, x)
                x1 = Math.max(x1, x + 1)
                y0 = Math.min(y0, y)
                y1 = Math.max(y1, y + 1)
            }
    if (x1 <= x0) return
    const pitch = Math.min((N * LEGEND_WIDTH) / (x1 - x0), N * DOT_MAX)
    const ox = N / 2 - ((x0 + x1) / 2) * pitch
    // centre on the x-height band (rows 7-15 of the raster), so descenders hang below as in print
    const oy = N / 2 - 11 * pitch
    const d = pitch * 0.9
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
            if (px[(y * tw + x) * 4 + 3] < 96) continue
            const cx = ox + x * pitch + (pitch - d) / 2
            const cy = oy + y * pitch + (pitch - d) / 2
            ctx.roundRect(cx, cy, d, d, d * 0.42)
        }
    }
    ctx.fill()
}

/** The poster's mark: a steep bar with a block either side of it, lower
 *  left and upper right. Corners traced off the poster's hero top,
 *  unwarped through the fitted camera, in cap-top half-widths (x right,
 *  y toward the front face). */
const MARK: [number, number][][] = [
    [[-0.41, -0.85], [0.07, -0.74], [0.4, 0.72], [0.0, 0.69]],
    [[-0.69, -0.18], [-0.21, -0.05], [-0.32, 0.63], [-0.8, 0.5]],
    [[0.37, -0.68], [0.76, -0.65], [0.65, 0.03], [0.26, 0.0]],
]

/** The poster's hero is twisted 9.6° on its stem and its mark was traced in
 *  that frame. Ours sits square with the grid, so the mark is turned back by
 *  the same amount: it then lies across the top as the poster's does on
 *  screen, and runs with the cap's own edges like the caption below it. */
const MARK_TURN = -9.6 * DEG
/** How far the centred mark reaches across the top, in half-widths: the
 *  poster's spans nearly the whole flat of the face, short of the roll. */
const MARK_REACH = 0.86

function paintMark(ctx: CanvasRenderingContext2D, N: number) {
    const h = N / 2
    const c = Math.cos(MARK_TURN)
    const s = Math.sin(MARK_TURN)
    const polys = MARK.map((poly) => poly.map(([x, y]) => [c * x - s * y, s * x + c * y]))
    // centred on its own bounds, so the mark sits in the middle of the face
    let x0 = Infinity
    let x1 = -Infinity
    let y0 = Infinity
    let y1 = -Infinity
    for (const poly of polys)
        for (const [x, y] of poly) {
            x0 = Math.min(x0, x)
            x1 = Math.max(x1, x)
            y0 = Math.min(y0, y)
            y1 = Math.max(y1, y)
        }
    const cx = (x0 + x1) / 2
    const cy = (y0 + y1) / 2
    const k = (h * MARK_REACH) / Math.max(x1 - cx, y1 - cy)
    ctx.save()
    ctx.setTransform(k, 0, 0, k, h - cx * k, h - cy * k)
    ctx.fillStyle = "#fff"
    for (const poly of polys) {
        ctx.beginPath()
        poly.forEach(([x, y], n) => (n ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.closePath()
        ctx.fill()
    }
    ctx.restore()
}

/** Caption down the hero's front face, left-aligned under the rolled edge
 *  and kept clear of the wall's rounded corners, sized to fit. */
function paintCaption(ctx: CanvasRenderingContext2D, CW: number, CH: number, shape: CapShape, lines: string[], font: CSSProperties) {
    ctx.clearRect(0, 0, CW, CH)
    if (!lines.length) return
    const k = CW / (2 * shape.base) // canvas px per world unit
    const faceTop = shape.height - EDGE_R
    const faceH = faceTop + shape.skirt
    // Measured off the poster's front wall: the first line's capitals start
    // just under the rolled edge, 0.05 in from the wall's left side, and run
    // to within 0.06 of its right.
    const top = 0.012
    const inset = 0.05
    const right = 0.06
    const family = familyOf(font)
    const weight = font.fontWeight || 700
    const style = font.fontStyle || "normal"
    const lh = emOf(font.lineHeight, 1.2)
    const ls = emOf(font.letterSpacing, 0)
    ctx.font = `${style} ${weight} 100px ${family}`
    // the face's own cap height, so any font hangs from the edge the same way
    const capK = clamp((ctx.measureText("H").actualBoundingBoxAscent || 72) / 100, 0.5, 0.9)
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width / 100 + Math.max(0, l.length - 1) * ls))
    const room = 2 * wallHalf(shape, faceTop - top) - inset - right
    const roomH = faceH - top - 0.05
    const size = Math.min(CAPTION_CAP / capK, room / Math.max(widest, 1e-3), roomH / (lines.length * lh))
    const px = size * k
    ctx.font = `${style} ${weight} ${px}px ${family}`
    ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${ls * px}px`
    ctx.fillStyle = "#fff"
    ctx.textBaseline = "alphabetic"
    lines.forEach((l, i) => {
        const yTopWorld = faceTop - top - i * lh * size
        const base = yTopWorld - size * capK
        const x = (shape.base - wallHalf(shape, yTopWorld) + inset) * k
        ctx.fillText(l, x, (faceTop - base) * (CH / faceH))
    })
}

/** The smeared print on the hero's right wall: a scanned label dragged
 *  sideways into vertical streaks, lighter than the shaded wall, broken
 *  into bands and fading downward. Spans the poster's: the front 7-76% of
 *  the wall, from the rolled edge to 0.28 below it. */
function paintSmear(ctx: CanvasRenderingContext2D, CW: number, CH: number, shape: CapShape) {
    ctx.clearRect(0, 0, CW, CH)
    const rnd = mulberry(7)
    const faceTop = shape.height - EDGE_R
    const faceH = faceTop + shape.skirt
    const yPx = (y: number) => ((faceTop - y) / faceH) * CH
    const x0 = CW * 0.07
    const x1 = CW * 0.76
    const yA = yPx(faceTop - 0.01)
    const yB = yPx(faceTop - 0.2)
    const col = Math.max(2, Math.round(CW / 160))
    for (let x = x0; x < x1; x += col * (1 + rnd() * 0.8)) {
        const edge = clamp((Math.min(x - x0, x1 - x) / (x1 - x0)) * 10)
        const base = (0.35 + 0.65 * rnd()) * edge
        let y = yA + rnd() * 10
        while (y < yB) {
            const run = 6 + rnd() * 30
            if (rnd() > 0.25) {
                ctx.fillStyle = `rgba(255,255,255,${(base * (0.5 + 0.5 * rnd())).toFixed(3)})`
                ctx.fillRect(x, y, col * (0.45 + 0.4 * rnd()), run)
            }
            y += run + rnd() * 6
        }
        // the drag: a fading tail below the print
        const tail = (yB - yA) * (0.2 + 0.6 * rnd())
        const g = ctx.createLinearGradient(0, yB, 0, yB + tail)
        g.addColorStop(0, `rgba(255,255,255,${(base * 0.5).toFixed(3)})`)
        g.addColorStop(1, "rgba(255,255,255,0)")
        ctx.fillStyle = g
        ctx.fillRect(x, yB, col * 0.6, tail)
    }
}

/** A generated studio for reflections: a broad soft box overhead, a
 *  strip to the back-right (the poster's haze) and a faint one left. */
function buildStudio(renderer: THREE.WebGLRenderer) {
    const env = new THREE.Scene()
    env.background = new THREE.Color(0x020202)
    const panel = (w: number, h: number, c: number, x: number, y: number, z: number) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }))
        m.position.set(x, y, z)
        m.lookAt(0, 0, 0)
        env.add(m)
        return m
    }
    const parts = [
        panel(6, 6, 0xb8b8b8, -1, 8, 2),
        panel(2, 7, 0x8a8a8a, 6, 4, -5),
        panel(1.5, 6, 0x262626, -7, 3, 1),
        panel(10, 2, 0x1a1a1a, 0, 1, -8),
    ]
    const pmrem = new THREE.PMREMGenerator(renderer)
    const rt = pmrem.fromScene(env, 0.03)
    pmrem.dispose()
    parts.forEach((m) => {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
    })
    return rt
}

/* ----------------------------------------------------------- post */

const QUAD_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

/** Half-resolution colour with its signed circle of confusion (negative
 *  in front of the hero), from the ground distance carried in the scene's
 *  alpha. */
const COC_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uScene;
uniform float uRange;
uniform float uAperture;
uniform float uNear;
uniform float uFarBand;
uniform float uFarK;
uniform float uMax;
void main() {
    vec4 s = texture2D(uScene, vUv);
    float d = s.a < 0.001 ? uRange : (s.a - 0.5) * 2.0 * uRange;
    float c = d < 0.0 ? -max(0.0, -d - uNear) : max(0.0, d - uFarBand) * uFarK;
    gl_FragColor = vec4(s.rgb, clamp(c * uAperture, -uMax, uMax));
}
`

/** Scatter-as-gather bokeh on a golden-angle spiral: a sample lends its
 *  colour where its own circle reaches this pixel, and a sample behind
 *  the centre may not spread wider than the centre does, so sharp caps
 *  keep their edges while blurred near caps spill over them. Alpha is
 *  the widest circle that landed here, for the composite's blend. */
const BOKEH_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uMax;
void main() {
    vec4 c0 = texture2D(uTex, vUv);
    float cs = abs(c0.a);
    vec3 col = c0.rgb;
    float tot = 1.0;
    float reach = cs;
    float r = 0.6;
    float ang = 0.0;
    for (int i = 0; i < 200; i++) {
        if (r >= uMax) break;
        ang += 2.39996323;
        vec4 s = texture2D(uTex, vUv + vec2(cos(ang), sin(ang)) * uTexel * r);
        float ss = abs(s.a);
        if (s.a > c0.a) ss = min(ss, cs * 2.0);
        float m = smoothstep(r - 0.5, r + 0.5, ss);
        col += mix(col / tot, s.rgb, m);
        tot += 1.0;
        reach = max(reach, m * ss);
        r += 0.6 / r;
    }
    gl_FragColor = vec4(col / tot, reach);
}
`

/** Bright pass with a 4-tap Karis-weighted downsample and a soft knee. */
const BRIGHT_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uThreshold;
vec3 tap(vec2 o, inout float wsum) {
    vec3 c = texture2D(uTex, vUv + uTexel * o).rgb;
    float w = 1.0 / (1.0 + max(c.r, max(c.g, c.b)));
    wsum += w;
    return c * w;
}
void main() {
    float ws = 0.0;
    vec3 c = tap(vec2(-0.5, -0.5), ws) + tap(vec2(0.5, -0.5), ws)
           + tap(vec2(-0.5, 0.5), ws) + tap(vec2(0.5, 0.5), ws);
    c /= ws;
    float l = max(c.r, max(c.g, c.b));
    float knee = 0.25;
    float soft = clamp(l - uThreshold + knee, 0.0, 2.0 * knee);
    soft = soft * soft / (4.0 * knee + 1e-4);
    float w = max(soft, l - uThreshold) / max(l, 1e-4);
    gl_FragColor = vec4(c * w, 1.0);
}
`

/** 9-tap Gaussian in five fetches, one axis at a time. */
const BLUR_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uStep;
void main() {
    vec2 o1 = uStep * 1.3846153846;
    vec2 o2 = uStep * 3.2307692308;
    vec3 c = texture2D(uTex, vUv).rgb * 0.2270270270;
    c += (texture2D(uTex, vUv + o1).rgb + texture2D(uTex, vUv - o1).rgb) * 0.3162162162;
    c += (texture2D(uTex, vUv + o2).rgb + texture2D(uTex, vUv - o2).rgb) * 0.0702702703;
    gl_FragColor = vec4(c, 1.0);
}
`

/** Lens and film: depth-of-field blend, bloom, ACES, then — in display
 *  space, so Background shows exactly as picked — fog into it, the beam
 *  and haze, lateral fringing toward the edges, vignette and grain. */
const COMPOSITE_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uDof;
uniform sampler2D uBloomA;
uniform sampler2D uBloomB;
uniform sampler2D uBloomC;
uniform float uDofOn;
uniform float uBloom;
uniform float uExposure;
uniform float uRange;
uniform float uFogStart;
uniform float uFog;
uniform float uHaze;
uniform float uFringe;
uniform float uVignette;
uniform float uGrain;
uniform float uAspect;
uniform float uShimmer;
uniform vec3 uBg;
uniform vec3 uTint;
uniform vec3 uAccent;
uniform vec2 uHero;

vec3 RRTAndODTFit(vec3 v) {
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return a / b;
}
vec3 aces(vec3 c) {
    const mat3 IN = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
    const mat3 OUT = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
    c = OUT * RRTAndODTFit(IN * (c / 0.6));
    return clamp(c, 0.0, 1.0);
}
vec3 toSRGB(vec3 c) {
    return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
float hash(float x) { return fract(sin(x * 127.1) * 43758.5453); }
float vnoise(float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
}

// One lens sample: the scene as displayed, before film.
vec3 lens(vec2 uv) {
    vec4 s = texture2D(uScene, uv);
    vec4 d = texture2D(uDof, uv);
    vec3 c = mix(s.rgb, d.rgb, uDofOn * smoothstep(0.35, 1.3, d.a));
    c += (texture2D(uBloomA, uv).rgb * 0.8 + texture2D(uBloomB, uv).rgb * 0.5 + texture2D(uBloomC, uv).rgb * 0.35) * uBloom;
    // tone-mapped on the brightest channel, so the citron keeps its hue
    // instead of washing toward white the way per-channel ACES does
    c *= uExposure;
    float m = max(c.r, max(c.g, c.b));
    c = toSRGB(m > 1e-5 ? c * (aces(vec3(m)).r / m) : c);
    float ground = (s.a - 0.5) * 2.0 * uRange;
    float fog = s.a < 0.001 ? 1.0 : 1.0 - exp(-max(0.0, ground - uFogStart) * uFog);
    // the beam: a soft column of light from above, streaked like light
    // through slats, and a grey haze toward the top-right corner
    float far = mix(0.3, 1.0, fog);
    vec2 q = vec2((uv.x - 0.5) * uAspect, uv.y);
    // a real beam widens as it rises off the hero and fades at both ends
    // instead of cutting off flat against the frame's top edge
    float riseH = clamp(uv.y - uHero.y, 0.0, 1.0);
    float coneWidth = 0.22 + 0.26 * riseH;
    float rise = smoothstep(uHero.y - 0.04, uHero.y + 0.12, uv.y) * (1.0 - smoothstep(0.82, 1.08, uv.y));
    float column = exp(-pow((uv.x - uHero.x - 0.05) / coneWidth, 2.0)) * rise;
    float streak = 0.6 + 0.4 * vnoise(uv.x * 46.0 + uShimmer) * vnoise(uv.x * 13.0 - uShimmer * 0.4 + 7.0);
    float corner = exp(-length((q - vec2(0.5 * uAspect + 0.08, 0.72)) * vec2(1.0, 0.8)) / 0.3);
    // the column rises out of the hero's glow, so it starts in its colour
    vec3 tint = mix(uTint, uAccent, 0.55 * smoothstep(0.9, 0.0, uv.y - uHero.y));
    vec3 beam = tint * (column * streak * 0.085 + corner * 0.06) * uHaze * far;
    return mix(c, uBg, fog) + beam;
}

void main() {
    vec2 cc = (vUv - 0.5) * vec2(uAspect, 1.0);
    // 1 at the corners whatever the frame's shape, so a wide frame fringes no harder
    float rr = dot(cc, cc) / (0.25 * (uAspect * uAspect + 1.0));
    vec2 shift = (vUv - 0.5) * rr * uFringe;
    vec3 c = vec3(lens(vUv + shift).r, lens(vUv).g, lens(vUv - shift).b);
    // the prism flare the poster's lens throws on the right edge
    float px = exp(-pow((vUv.x - 0.99) / 0.03, 2.0)) * exp(-pow((vUv.y - 0.27) / 0.13, 2.0));
    vec3 rainbow = 0.5 + 0.5 * cos(6.2832 * (vUv.y * 3.0 + vec3(0.0, 0.33, 0.67)));
    c += rainbow * px * uFringe * 9.0;
    c *= 1.0 - uVignette * smoothstep(0.15, 0.95, dot(cc, cc));
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    c += g * uGrain;
    gl_FragColor = vec4(c, 1.0);
}
`

/* ----------------------------------------------------------- layout */

/**
 * Which word a cap carries. The poster's ring round the hero is point-
 * symmetric ("your" behind-right and in front-left, "edge" left and
 * front-right, "create" on both diagonals), which no single repeating
 * stripe can be, so caps are classed by the parity of their column and
 * row: odd/odd, even/odd, odd/even, even/even. Further out the cycle
 * steps on every second ring, so a longer list still shows every word.
 */
function wordClass(i: number, j: number) {
    const oi = Math.abs(i) % 2
    const oj = Math.abs(j) % 2
    const c = oi && oj ? 0 : !oi && oj ? 1 : oi && !oj ? 2 : 3
    const m = Math.floor(Math.abs(i) / 2) + Math.floor(Math.abs(j) / 2)
    return { c, m }
}

/* ----------------------------------------------------------- component */

interface Picture {
    img: HTMLImageElement
    state: "loading" | "ready" | "failed"
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 736
 * @framerIntrinsicHeight 920
 */
function __OriginkitBase_CitronLegend({
    words = ["A","B","C","D","E","F"],
    logo = "https://cdn.brandfetch.io/idAnDTFapY/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    background = DEFAULTS.background,
    caption,
    font = {"variant":"Semibold","fontSize":24,"textAlign":"left","fontFamily":"Inter Tight","fontWeight":600,"lineHeight":"1.12em","letterSpacing":"-0.03em"},
    textColor = DEFAULTS.textColor,
    scale = DEFAULTS.scale,
    colors,
    glow = DEFAULTS.glow,
    parallax = DEFAULTS.parallax,
    press = DEFAULTS.press,
    speed = DEFAULTS.speed,
    advanced,
    style,
}: CitronLegendProps) {
    const cap = { ...DEFAULT_CAPTION, ...caption }
    const palette = { ...DEFAULT_COLORS, ...colors }
    const adv = { ...DEFAULT_ADVANCED, ...advanced }

    const hostRef = useRef<HTMLDivElement>(null)
    const [ready, setReady] = useState(false)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    // Live prop mirror: the loop reads it, so a control change never rebuilds the GL context.
    const live = { words, logo, background, cap, font, textColor, scale, palette, glow, parallax, press, speed, adv, isCanvas }
    const propsRef = useRef(live)
    propsRef.current = live
    const dirtyRef = useRef(true)
    dirtyRef.current = true

    useEffect(() => {
        const host = hostRef.current
        if (!host) return

        let renderer: THREE.WebGLRenderer
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" })
        } catch {
            return
        }
        renderer.setPixelRatio(1)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        // Shadows are redrawn only when a cap moves, not every frame.
        renderer.shadowMap.autoUpdate = false
        const canvas = renderer.domElement
        canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block"
        host.appendChild(canvas)

        const floatOk = renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float")
        const type = floatOk ? THREE.HalfFloatType : THREE.UnsignedByteType
        const postOpts = { type, depthBuffer: false, stencilBuffer: false }
        const rtScene = new THREE.WebGLRenderTarget(1, 1, { type, samples: 4 })
        const rtCoc = new THREE.WebGLRenderTarget(1, 1, postOpts)
        const rtDof = new THREE.WebGLRenderTarget(1, 1, postOpts)
        const rts = Array.from({ length: 6 }, () => new THREE.WebGLRenderTarget(1, 1, postOpts))
        const [rtA, rtB, rtC, rtD, rtE, rtF] = rts

        /* ---- scene */

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(DEFAULT_ADVANCED.lens, 1, 0.1, 80)
        const env = buildStudio(renderer)
        scene.environment = env.texture
        scene.environmentIntensity = 0.35

        // Key light high and to the left of the lens: tops bright, the
        // hero's front wall lit, right-facing walls in shade.
        const spot = new THREE.SpotLight(0xffffff, 7.5, 0, 12 * DEG, 1, 0)
        spot.position.set(-1.1, 6.2, 2.6)
        spot.castShadow = true
        spot.shadow.mapSize.set(2048, 2048)
        spot.shadow.bias = -0.0004
        spot.shadow.normalBias = 0.012
        spot.shadow.radius = 4
        spot.shadow.camera.near = 2
        spot.shadow.camera.far = 14
        scene.add(spot, spot.target)
        // Cool back light from the hazy top-right, for rims on the far edges.
        const rim = new THREE.DirectionalLight(0xe8eef5, 0.55)
        rim.position.set(3.5, 4, -5)
        scene.add(rim)
        // The hero's inner glow thrown onto its neighbours.
        const glowLight = new THREE.PointLight(0xd2f53a, 1, 0, 2)
        const glowLow = new THREE.PointLight(0xd2f53a, 1, 0, 2)
        scene.add(glowLight, glowLow)

        const uRange = { value: FOCUS_RANGE }
        const uFwd = { value: new THREE.Vector2() }
        const uAo = { value: 0.72 }
        const uCapH = { value: CAP_H }

        const plateMat = new THREE.MeshStandardMaterial({ color: 0x070707, roughness: 0.85 })
        hookMaterial(plateMat, { uRange, uFwd }, "plate")
        const plate = new THREE.Mesh(new THREE.PlaneGeometry(60, 60).rotateX(-Math.PI / 2), plateMat)
        plate.receiveShadow = true
        scene.add(plate)

        /* ---- caps */

        const maxAniso = renderer.capabilities.getMaxAnisotropy()
        const makeTex = (cv: HTMLCanvasElement) => {
            const t = new THREE.CanvasTexture(cv)
            t.flipY = false
            t.colorSpace = THREE.SRGBColorSpace
            t.anisotropy = maxAniso
            t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
            return t
        }
        const makeCanvas = (w: number, h: number) => {
            const cv = document.createElement("canvas")
            cv.width = w
            cv.height = h
            return cv
        }
        const scratch = makeCanvas(8, 8).getContext("2d", { willReadFrequently: true })

        const N = 2 * GRID + 1
        const COUNT = N * N
        const HERO = GRID * N + GRID
        const gi = (g: number) => Math.floor(g / N) - GRID
        const gj = (g: number) => (g % N) - GRID
        const pressPos = new Float32Array(COUNT)
        const pressVel = new Float32Array(COUNT)
        const lastY = new Float32Array(COUNT).fill(NaN)

        let shape: CapShape = { base: 0.465, top: 0.37, height: CAP_H, dish: 0.015, skirt: 0 }
        let heroShape: CapShape = { ...shape, skirt: 0.3 }
        let keyGeo = capGeometry(shape)
        let heroGeo = capGeometry(heroShape)
        let shapeKey = ""

        const heroTopCv = makeCanvas(1024, 1024)
        const heroFrontCv = makeCanvas(1024, 1024)
        const heroSideCv = makeCanvas(1024, 1024)
        const heroTopTex = makeTex(heroTopCv)
        const heroFrontTex = makeTex(heroFrontCv)
        const heroSideTex = makeTex(heroSideCv)
        const heroU = {
            uTopMap: { value: heroTopTex },
            uTopHalf: { value: shape.top },
            uTopInk: { value: new THREE.Color() },
            uTopTint: { value: 1 },
            uInkGlow: { value: 0 },
            uFrontMap: { value: heroFrontTex },
            uSideMap: { value: heroSideTex },
            uFaceInk: { value: new THREE.Color() },
            uFaceHalf: { value: shape.base },
            uFaceTop: { value: CAP_H - EDGE_R },
            uFaceBottom: { value: -0.3 },
            uGlowColor: { value: new THREE.Color() },
            uRange,
            uFwd,
            uAo: { value: 0.35 },
            uCapH,
        }
        const heroMat = new THREE.MeshPhysicalMaterial({ roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35 })
        hookMaterial(heroMat, heroU, "hero")
        const hero = new THREE.Mesh(heroGeo, heroMat)
        hero.castShadow = true
        hero.receiveShadow = true
        scene.add(hero)

        interface Combo {
            mesh: THREE.InstancedMesh
            mat: THREE.MeshPhysicalMaterial
            uni: Record<string, THREE.IUniform>
            style: number
            cells: number[]
        }
        let combos: Combo[] = []
        let wordTex: THREE.CanvasTexture[] = []
        let wordsKey = ""
        const blankCv = makeCanvas(4, 4)
        const blankTex = makeTex(blankCv)

        const buildCaps = (list: string[]) => {
            combos.forEach((c) => {
                scene.remove(c.mesh)
                c.mesh.dispose()
                c.mat.dispose()
            })
            wordTex.forEach((t) => t.dispose())
            wordTex = list.map((w) => {
                const cv = makeCanvas(512, 512)
                const ctx = cv.getContext("2d")
                if (ctx && scratch) paintWord(ctx, scratch, 512, w)
                return makeTex(cv)
            })
            const n = list.length
            const byKey = new Map<string, { style: number; word: number; cells: number[] }>()
            for (let g = 0; g < COUNT; g++) {
                if (g === HERO) continue
                const { c, m } = wordClass(gi(g), gj(g))
                const word = n ? (c + 4 * m) % n : -1
                const style = (n ? word : c) % 3
                const k = `${style}:${word}`
                if (!byKey.has(k)) byKey.set(k, { style, word, cells: [] })
                byKey.get(k)?.cells.push(g)
            }
            combos = [...byKey.values()].map(({ style, word, cells }) => {
                const uni: Record<string, THREE.IUniform> = {
                    uTopMap: { value: word >= 0 ? wordTex[word] : blankTex },
                    uTopHalf: { value: shape.top },
                    uTopInk: { value: new THREE.Color() },
                    uTopTint: { value: 1 },
                    uInkGlow: { value: 0 },
                    uRange,
                    uFwd,
                    uAo,
                    uCapH,
                }
                // Black caps are glossy PBT with a satin clearcoat; white caps a softer ABS.
                const mat =
                    style === 1
                        ? new THREE.MeshPhysicalMaterial({ roughness: 0.5, clearcoat: 0.15, clearcoatRoughness: 0.4 })
                        : new THREE.MeshPhysicalMaterial({ roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.28 })
                hookMaterial(mat, uni, "key")
                const mesh = new THREE.InstancedMesh(keyGeo, mat, cells.length)
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh.frustumCulled = false
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
                scene.add(mesh)
                return { mesh, mat, uni, style, cells }
            })
            lastY.fill(NaN)
        }

        /* ---- hero prints */

        // bumped when a font or a logo finishes loading, so the hero re-prints
        let printVersion = 0
        const onFonts = () => {
            printVersion++
        }
        document.fonts?.addEventListener?.("loadingdone", onFonts)
        let printKey = ""
        let lastBake = -1e9
        let wantFont = ""
        // Logos load once per URL. CORS is asked for because the print is a
        // WebGL texture: a picture that refuses it cannot be drawn there, so
        // it fails and the mark stays.
        const pictures = new Map<string, Picture>()
        const picture = (url: string): Picture => {
            const hit = pictures.get(url)
            if (hit) return hit
            const img = new window.Image()
            const pic: Picture = { img, state: "loading" }
            img.crossOrigin = "anonymous"
            img.onload = () => {
                pic.state = "ready"
                printVersion++
            }
            img.onerror = () => {
                pic.state = "failed"
            }
            img.src = url
            pictures.set(url, pic)
            return pic
        }

        /** Re-prints the hero when its words, font, logo or shape change;
         *  throttled so dragging a slider does not queue bakes. */
        const bakeHero = (now: number) => {
            const p = propsRef.current
            const f = p.font as CSSProperties
            const lines = p.cap.show ? (p.cap.lines ?? []).map((l) => String(l)).filter((l) => l.trim()) : []
            const url = srcOf(p.logo)
            const pic = url ? picture(url) : null
            const key = JSON.stringify([lines, f.fontFamily, f.fontWeight, f.fontStyle, f.lineHeight, f.letterSpacing, url, pic?.state, shapeKey, printVersion])
            if (key === printKey) return false
            if (now - lastBake < 120) return false
            lastBake = now
            printKey = key
            const fontStr = `${f.fontStyle || "normal"} ${f.fontWeight || 600} 100px ${familyOf(f)}`
            if (fontStr !== wantFont) {
                wantFont = fontStr
                document.fonts?.load(fontStr).then(onFonts, () => {})
            }
            const tctx = heroTopCv.getContext("2d")
            if (tctx) {
                tctx.clearRect(0, 0, 1024, 1024)
                if (pic && pic.state === "ready") {
                    // Contained, never stretched: a logo is shown whole.
                    const iw = pic.img.naturalWidth || 1
                    const ih = pic.img.naturalHeight || iw
                    const box = 1024 * 0.66
                    const k = box / Math.max(iw, ih)
                    tctx.drawImage(pic.img, 512 - (iw * k) / 2, 512 - (ih * k) / 2, iw * k, ih * k)
                    heroU.uTopTint.value = 0
                } else {
                    paintMark(tctx, 1024)
                    heroU.uTopTint.value = 1
                }
                heroTopTex.needsUpdate = true
            }
            const ch = Math.round((1024 * (heroShape.height - EDGE_R + heroShape.skirt)) / (2 * heroShape.base))
            if (heroFrontCv.height !== ch) {
                heroFrontCv.height = ch
                heroSideCv.height = ch
                // resized canvases need fresh textures
                heroFrontTex.dispose()
                heroSideTex.dispose()
            }
            const fctx = heroFrontCv.getContext("2d")
            if (fctx) paintCaption(fctx, 1024, ch, heroShape, lines, f)
            const sctx = heroSideCv.getContext("2d")
            if (sctx) {
                // the smear is a dragged copy of the label, so it goes with the caption
                if (lines.length) paintSmear(sctx, 1024, ch, heroShape)
                else sctx.clearRect(0, 0, 1024, ch)
            }
            heroFrontTex.needsUpdate = true
            heroSideTex.needsUpdate = true
            return true
        }

        /* ---- post */

        const postScene = new THREE.Scene()
        const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        const quadGeo = new THREE.PlaneGeometry(2, 2)
        const shader = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
            new THREE.ShaderMaterial({ vertexShader: QUAD_VERTEX, fragmentShader, uniforms, depthTest: false, depthWrite: false })
        const coc = shader(COC_FRAGMENT, {
            uScene: { value: rtScene.texture },
            uRange,
            uAperture: { value: 10 },
            uNear: { value: NEAR_BAND },
            uFarBand: { value: FAR_BAND },
            uFarK: { value: FAR_BLUR },
            uMax: { value: 14 },
        })
        const bokeh = shader(BOKEH_FRAGMENT, {
            uTex: { value: rtCoc.texture },
            uTexel: { value: new THREE.Vector2() },
            uMax: { value: 14 },
        })
        const bright = shader(BRIGHT_FRAGMENT, {
            uTex: { value: rtScene.texture },
            uTexel: { value: new THREE.Vector2() },
            uThreshold: { value: 1.4 },
        })
        const blur = shader(BLUR_FRAGMENT, { uTex: { value: null }, uStep: { value: new THREE.Vector2() } })
        const composite = shader(COMPOSITE_FRAGMENT, {
            uScene: { value: rtScene.texture },
            uDof: { value: rtDof.texture },
            uBloomA: { value: rtA.texture },
            uBloomB: { value: rtD.texture },
            uBloomC: { value: rtF.texture },
            uDofOn: { value: 1 },
            uBloom: { value: 0.5 },
            uExposure: { value: 1 },
            uRange,
            uFogStart: { value: FOG_START },
            uFog: { value: 1.6 },
            uHaze: { value: 1 },
            uFringe: { value: 0.006 },
            uVignette: { value: 0.4 },
            uGrain: { value: 0.04 },
            uAspect: { value: 1 },
            uShimmer: { value: 0 },
            uBg: { value: new THREE.Vector3() },
            uTint: { value: new THREE.Vector3(0.85, 0.87, 0.82) },
            uAccent: { value: new THREE.Vector3() },
            uHero: { value: new THREE.Vector2(0.5, 0.5) },
        })
        const quad = new THREE.Mesh(quadGeo, composite)
        quad.frustumCulled = false
        postScene.add(quad)
        const pass = (mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) => {
            quad.material = mat
            renderer.setRenderTarget(target)
            renderer.render(postScene, postCam)
        }

        /* ---- size */

        let W = 1
        let H = 1
        let quality = 1
        const resize = () => {
            const r = host.getBoundingClientRect()
            W = Math.max(1, Math.round(host.clientWidth || r.width))
            H = Math.max(1, Math.round(host.clientHeight || r.height))
            let dpr = Math.min(window.devicePixelRatio || 1, 2)
            if (W * H * dpr * dpr > MAX_PIXELS) dpr = Math.sqrt(MAX_PIXELS / (W * H))
            dpr *= quality
            const cw = Math.max(1, Math.round(W * dpr))
            const chh = Math.max(1, Math.round(H * dpr))
            renderer.setSize(cw, chh, false)
            rtScene.setSize(cw, chh)
            rtCoc.setSize(Math.max(1, cw >> 1), Math.max(1, chh >> 1))
            rtDof.setSize(Math.max(1, cw >> 1), Math.max(1, chh >> 1))
            // Bloom at a half, a quarter and an eighth.
            rts.forEach((rt, i) => {
                const sh = (i >> 1) + 1
                rt.setSize(Math.max(1, cw >> sh), Math.max(1, chh >> sh))
            })
            camera.aspect = W / H
            composite.uniforms.uAspect.value = W / H
            needs = true
        }
        let needs = true
        const ro = new ResizeObserver(resize)
        ro.observe(host)
        resize()

        /* ---- input */

        const pt = { cx: 0, cy: 0, u: 0.5, v: 0.5, over: false, down: false, moved: false }
        const onMove = (e: PointerEvent) => {
            pt.cx = e.clientX
            pt.cy = e.clientY
            pt.over = true
            pt.moved = true
        }
        const onDown = (e: PointerEvent) => {
            onMove(e)
            pt.down = true
        }
        const onUp = (e: PointerEvent) => {
            pt.down = false
            // a lifted finger leaves nothing hovering
            if (e.pointerType === "touch") pt.over = false
            pt.moved = true
        }
        const onLeave = () => {
            pt.over = false
            pt.down = false
            pt.moved = true
        }
        const onScroll = () => {
            if (pt.over) pt.moved = true
        }
        host.addEventListener("pointermove", onMove)
        host.addEventListener("pointerdown", onDown)
        host.addEventListener("pointerup", onUp)
        host.addEventListener("pointercancel", onLeave)
        host.addEventListener("pointerleave", onLeave)
        window.addEventListener("scroll", onScroll, { passive: true, capture: true })

        let visible = true
        const io =
            typeof IntersectionObserver === "function"
                ? new IntersectionObserver((es) => {
                      visible = es.some((e) => e.isIntersecting)
                  })
                : null
        io?.observe(host)
        const reduce = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null

        /* ---- hover hit test */

        const ray = new THREE.Raycaster()
        const ndc = new THREE.Vector2()
        const P = new THREE.Vector3()
        const capY = (g: number, lift: number, sunk: number) =>
            (g === HERO ? lift : 0) - pressPos[g] * sunk
        /** Marches the pointer's ray down through the bed and returns the
         *  first cap it enters, walls included; -1 for none. */
        const pick = (lift: number, sunk: number, twist: number) => {
            const ct = Math.cos(twist)
            const st = Math.sin(twist)
            ndc.set(pt.u * 2 - 1, 1 - pt.v * 2)
            ray.setFromCamera(ndc, camera)
            const o = ray.ray.origin
            const d = ray.ray.direction
            if (d.y >= -1e-4) return -1
            const yTop = CAP_H + lift + 0.05
            const t0 = (o.y - yTop) / -d.y
            const t1 = o.y / -d.y
            const STEPS = 40
            for (let s = 0; s <= STEPS; s++) {
                P.copy(d).multiplyScalar(lerp(t0, t1, s / STEPS)).add(o)
                const i = Math.round(P.x)
                const j = Math.round(P.z)
                if (Math.abs(i) > GRID || Math.abs(j) > GRID) continue
                const g = (i + GRID) * N + (j + GRID)
                const sh = g === HERO ? heroShape : shape
                const y = P.y - capY(g, lift, sunk)
                if (y > sh.height || y < -sh.skirt) continue
                const hw = y < 0 ? sh.base : wallHalf(sh, y)
                // the hero is turned on its stem: test it in its own frame
                const lx = g === HERO ? ct * P.x - st * P.z : P.x - i
                const lz = g === HERO ? st * P.x + ct * P.z : P.z - j
                if (Math.abs(lx) < hw && Math.abs(lz) < hw) return g
            }
            return -1
        }

        /* ---- loop */

        const M4 = new THREE.Matrix4()
        const accent = new THREE.Color()
        const light = new THREE.Color()
        const dark = new THREE.Color()
        const bg = new THREE.Color()
        const accSRGB = new THREE.Color()
        let raf = 0
        let last = -1
        let lastDraw = -1e9
        let gapEma = 16
        let lastQualityDrop = 0
        let clock = 0
        let leanX = 0
        let leanY = 0
        let hover = -1
        let flare = 0
        let announced = false

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            const dt = last < 0 ? 0 : Math.min(0.05, (now - last) / 1000)
            last = now
            if (!visible && announced) return
            const p = propsRef.current
            const A = p.adv
            const still = !!(reduce && reduce.matches) || p.isCanvas

            if (dirtyRef.current) {
                dirtyRef.current = false
                needs = true
                renderer.shadowMap.needsUpdate = true
            }

            /* shape and caps, rebuilt only when what feeds them changes */
            const gap = clamp(num(A.keyGap, DEFAULT_ADVANCED.keyGap), 1, 30) / 100
            const lift = (clamp(num(A.heroLift, DEFAULT_ADVANCED.heroLift), 0, 150) / 100) * CAP_H
            const dish = (clamp(num(A.dish, DEFAULT_ADVANCED.dish), 0, 10) / 100) * CAP_H
            const sk = [gap, lift, dish].join()
            if (sk !== shapeKey) {
                shapeKey = sk
                const base = 0.5 - gap / 2
                shape = { base, top: base - TAPER, height: CAP_H, dish, skirt: 0 }
                heroShape = { ...shape, skirt: lift + 0.12 }
                keyGeo.dispose()
                heroGeo.dispose()
                keyGeo = capGeometry(shape)
                heroGeo = capGeometry(heroShape)
                hero.geometry = heroGeo
                combos.forEach((c) => {
                    c.mesh.geometry = keyGeo
                    c.uni.uTopHalf.value = shape.top
                })
                heroU.uTopHalf.value = shape.top
                heroU.uFaceHalf.value = shape.base
                heroU.uFaceTop.value = CAP_H - EDGE_R
                heroU.uFaceBottom.value = -heroShape.skirt
                lastY.fill(NaN)
            }
            const list = (Array.isArray(p.words) ? p.words : DEFAULT_WORDS).map((w) => String(w ?? ""))
            const wk = JSON.stringify(list)
            if (wk !== wordsKey) {
                wordsKey = wk
                buildCaps(list)
                needs = true
            }
            if (bakeHero(now)) needs = true

            /* pointer: the rect is read once per frame, only when it moved */
            if (pt.moved) {
                pt.moved = false
                const r = host.getBoundingClientRect()
                pt.u = clamp((pt.cx - r.left) / Math.max(1, r.width), -0.2, 1.2)
                pt.v = clamp((pt.cy - r.top) / Math.max(1, r.height), -0.2, 1.2)
                needs = true
            }

            /* camera: the poster's view, leaning toward the pointer */
            const par = clamp(num(p.parallax, DEFAULTS.parallax), 0, 10) / 10
            const tx = pt.over ? (pt.u - 0.5) * 2 : 0
            const ty = pt.over ? (pt.v - 0.5) * 2 : 0
            const kl = 1 - Math.exp(-dt * 3.2) // secondary motion: a slower ease than the press
            const leanTX = tx * par * 6 * DEG
            const leanTY = -ty * par * 3.5 * DEG
            leanY += (leanTX - leanY) * kl
            leanX += (leanTY - leanX) * kl
            const leaning = Math.abs(leanTX - leanY) > 1e-4 || Math.abs(leanTY - leanX) > 1e-4

            const sp = still ? 0 : clamp(num(p.speed, DEFAULTS.speed), 0, 10) / 10
            const idle = sp > 0

            /* press springs: quick and a little bouncy, like a real switch */
            const sunk = (clamp(num(p.press, DEFAULTS.press), 0, 10) / 10) * PRESS_TRAVEL
            const lens = clamp(num(A.lens, DEFAULT_ADVANCED.lens), 10, 70)
            if (camera.fov !== lens) {
                camera.fov = lens
            }
            camera.updateProjectionMatrix()
            const sc = clamp(num(p.scale, DEFAULTS.scale), 30, 100) / 100
            const yaw = num(A.yaw, DEFAULT_ADVANCED.yaw) * DEG + leanY + (idle ? Math.sin(clock * 0.21) * 1.4 * DEG : 0)
            const tilt = clamp(num(A.tilt, DEFAULT_ADVANCED.tilt) * DEG + leanX, 10 * DEG, 88 * DEG)
            const dist =
                (VIEW_HALF * Math.max(1, REF_ASPECT / (W / H))) / Math.tan((lens * DEG) / 2) / sc
            const aimY = CAP_H + lift - AIM_DROP
            camera.position.set(Math.sin(yaw) * Math.cos(tilt) * dist, aimY + Math.sin(tilt) * dist, Math.cos(yaw) * Math.cos(tilt) * dist)
            camera.lookAt(0, aimY, 0)
            uFwd.value.set(-Math.sin(yaw), -Math.cos(yaw))
            camera.updateMatrixWorld()
            camera.projectionMatrix.elements[9] += AIM_SHIFT
            camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
            const twist = num(A.heroTurn, DEFAULT_ADVANCED.heroTurn) * DEG
            hero.rotation.y = twist

            hover = pt.over && sunk > 0 ? pick(lift, sunk, twist) : -1
            let springing = false
            const sdt = dt / 2
            for (let g = 0; g < COUNT; g++) {
                const target = g === hover ? (pt.down ? 1 : 0.35) : 0
                if (target === 0 && pressPos[g] === 0 && pressVel[g] === 0) continue
                for (let s = 0; s < 2; s++) {
                    const a = 900 * (target - pressPos[g]) - 30 * pressVel[g]
                    pressVel[g] += a * sdt
                    pressPos[g] += pressVel[g] * sdt
                }
                if (Math.abs(target - pressPos[g]) < 1e-3 && Math.abs(pressVel[g]) < 1e-2) {
                    pressPos[g] = target
                    pressVel[g] = 0
                } else springing = true
            }
            const flareT = hover === HERO && pt.down ? 1 : 0
            flare += (flareT - flare) * (1 - Math.exp(-dt * (flareT ? 14 : 4)))
            const flaring = Math.abs(flareT - flare) > 1e-3

            /* pacing: 60 fps while anything moves, 30 for idle breathing, none once settled */
            const active = springing || leaning || flaring
            const interval = active ? 1000 / 60 : idle ? 1000 / 30 : Infinity
            if (!needs && now - lastDraw < interval - 2) return
            const gapMs = now - lastDraw
            if (active && gapMs < 100) {
                gapEma += (gapMs - gapEma) * 0.1
                // running long: draw fewer pixels, down to 60%
                if (gapEma > 26 && quality > 0.6 && now - lastQualityDrop > 1500) {
                    quality = Math.max(0.6, quality - 0.1)
                    lastQualityDrop = now
                    gapEma = 16
                    resize()
                }
            }
            if (idle) clock += Math.min(0.1, gapMs / 1000) * (0.4 + sp * 1.2)
            lastDraw = now
            needs = false

            /* caps */
            let moved = false
            for (const c of combos) {
                let any = false
                c.cells.forEach((g, k) => {
                    const y = capY(g, lift, sunk)
                    if (y !== lastY[g]) {
                        lastY[g] = y
                        any = true
                    }
                    M4.makeTranslation(gi(g), y, gj(g))
                    c.mesh.setMatrixAt(k, M4)
                })
                if (any) {
                    c.mesh.instanceMatrix.needsUpdate = true
                    moved = true
                }
            }
            const hy = capY(HERO, lift, sunk)
            if (hy !== lastY[HERO]) {
                lastY[HERO] = hy
                moved = true
            }
            hero.position.set(0, hy, 0)
            if (moved) renderer.shadowMap.needsUpdate = true

            /* colours and light, read live */
            const pal = p.palette
            accent.set(pal.accent)
            light.set(pal.light)
            dark.set(pal.dark)
            for (const c of combos) {
                c.mat.color.copy(c.style === 1 ? light : dark)
                ;(c.uni.uTopInk.value as THREE.Color).copy(c.style === 0 ? accent : c.style === 1 ? dark : light)
                c.uni.uInkGlow.value = c.style === 0 ? 0.35 : 0
            }
            heroMat.color.copy(accent)
            ;(heroU.uTopInk.value as THREE.Color).set(p.textColor)
            ;(heroU.uFaceInk.value as THREE.Color).set(p.textColor)
            const gl = clamp(num(p.glow, DEFAULTS.glow), 0, 10) / 10
            const breathe = idle ? 1 + 0.1 * Math.sin(clock * 1.3) : 1
            const glowK = gl * breathe * (1 + 0.8 * flare)
            ;(heroU.uGlowColor.value as THREE.Color).copy(accent).multiplyScalar(0.75 * glowK)
            glowLight.color.copy(accent)
            glowLow.color.copy(accent)
            glowLight.intensity = 0.65 * glowK
            glowLow.intensity = 0.35 * glowK
            glowLight.position.set(0, hy + CAP_H * 0.45, 0)
            glowLow.position.set(0, 0.12, 0)
            // centred a little behind the hero: the ring behind is lit, the caps in front fall off
            spot.target.position.set(-0.4, 0, -0.4)

            /* scene */
            renderer.setRenderTarget(rtScene)
            renderer.setClearColor(0x000000, 0)
            renderer.clear()
            renderer.render(scene, camera)

            /* depth of field */
            const blurK = clamp(num(A.blur, DEFAULT_ADVANCED.blur), 0, 300) / 100
            const halfH = rtCoc.height
            const dofOn = floatOk && blurK > 0
            composite.uniforms.uDofOn.value = dofOn ? 1 : 0
            if (dofOn) {
                const maxC = Math.max(2, halfH * 0.028 * Math.max(1, blurK))
                // a pulled-back lens draws the bed smaller, and its blur with it
                coc.uniforms.uAperture.value = APERTURE * halfH * blurK * sc
                coc.uniforms.uMax.value = maxC
                bokeh.uniforms.uMax.value = maxC
                ;(bokeh.uniforms.uTexel.value as THREE.Vector2).set(1 / rtCoc.width, 1 / rtCoc.height)
                pass(coc, rtCoc)
                pass(bokeh, rtDof)
            }

            /* bloom */
            ;(bright.uniforms.uTexel.value as THREE.Vector2).set(1 / rtScene.width, 1 / rtScene.height)
            pass(bright, rtA)
            const step = blur.uniforms.uStep.value as THREE.Vector2
            const levels: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget, THREE.WebGLRenderTarget][] = [
                [rtA, rtB, rtA],
                [rtA, rtC, rtD],
                [rtD, rtE, rtF],
            ]
            levels.forEach(([src, mid, dst], i) => {
                blur.uniforms.uTex.value = src.texture
                step.set((i === 0 ? 1 : 2) / src.width, 0)
                pass(blur, mid)
                blur.uniforms.uTex.value = mid.texture
                step.set(0, 1 / mid.height)
                pass(blur, dst)
            })

            /* composite */
            bg.set(p.background).convertLinearToSRGB()
            const acc = accSRGB.copy(accent).convertLinearToSRGB()
            ;(composite.uniforms.uAccent.value as THREE.Vector3).set(acc.r, acc.g, acc.b)
            P.set(0, hy + CAP_H, 0).project(camera)
            ;(composite.uniforms.uHero.value as THREE.Vector2).set(P.x * 0.5 + 0.5, P.y * 0.5 + 0.5)
            ;(composite.uniforms.uBg.value as THREE.Vector3).set(bg.r, bg.g, bg.b)
            composite.uniforms.uBloom.value = 0.15 + 0.5 * gl * (1 + 0.6 * flare)
            composite.uniforms.uExposure.value = clamp(num(A.exposure, DEFAULT_ADVANCED.exposure), 20, 300) / 100
            composite.uniforms.uFog.value = 1.6 * sc
            composite.uniforms.uHaze.value = clamp(num(A.haze, DEFAULT_ADVANCED.haze), 0, 300) / 100
            composite.uniforms.uFringe.value = (0.008 * clamp(num(A.fringe, DEFAULT_ADVANCED.fringe), 0, 300)) / 100
            composite.uniforms.uVignette.value = clamp(num(A.vignette, DEFAULT_ADVANCED.vignette), 0, 100) / 100
            composite.uniforms.uGrain.value = clamp(num(A.grain, DEFAULT_ADVANCED.grain), 0, 30) / 100
            composite.uniforms.uShimmer.value = clock * 0.35
            pass(composite, null)

            if (!announced) {
                announced = true
                setReady(true)
            }
        }
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            document.fonts?.removeEventListener?.("loadingdone", onFonts)
            host.removeEventListener("pointermove", onMove)
            host.removeEventListener("pointerdown", onDown)
            host.removeEventListener("pointerup", onUp)
            host.removeEventListener("pointercancel", onLeave)
            host.removeEventListener("pointerleave", onLeave)
            window.removeEventListener("scroll", onScroll, { capture: true })
            io?.disconnect()
            ro.disconnect()
            combos.forEach((c) => {
                c.mesh.dispose()
                c.mat.dispose()
            })
            wordTex.forEach((t) => t.dispose())
            ;[keyGeo, heroGeo, quadGeo, plate.geometry].forEach((g) => g.dispose())
            ;[heroMat, plateMat, coc, bokeh, bright, blur, composite].forEach((m) => m.dispose())
            ;[heroTopTex, heroFrontTex, heroSideTex, blankTex].forEach((t) => t.dispose())
            ;[rtScene, rtCoc, rtDof, ...rts].forEach((rt) => rt.dispose())
            env.dispose()
            spot.dispose()
            renderer.dispose()
            renderer.forceContextLoss()
            canvas.remove()
        }
    }, [])

    return (
        <div
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background,
            }}
        >
            <div
                ref={hostRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: ready || isCanvas ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    touchAction: "pan-y",
                    userSelect: "none",
                }}
            />
        </div>
    )
}

const __originkitPresetProps = {
  "background": "#0B0B0B",
  "textColor": "#111111",
  "scale": 100,
  "glow": 10,
  "parallax": 10,
  "press": 10,
  "speed": 3
};

export default function CitronLegend(props: Record<string, unknown>) {
  return <__OriginkitBase_CitronLegend {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
