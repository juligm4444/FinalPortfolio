/* GENERADO por scripts/port-vendor.mjs desde vendor/originkit/MohairCapsule.md — no editar a mano.
   Es el original sin tipos más los parches listados en ese script. */
/* eslint-disable */
import { useEffect, useRef, useState } from "react";
const REF_W = 1200;
const REF_H = 800;
const REF_ASPECT = REF_W / REF_H;
const MAX_DPR = 1.5;
const PIXEL_CAP = 26e5;
const PERSPECTIVE = 1e3;
const STEP = 1 / 120;
const MARGIN = 1;
const GRID_PITCH = 0.05;
const QUALITY_FLOOR = 0.6;
const TEXT_SIZE = 0.3;
const TEXT_MAX_W = 0.9;
const TEXT_MAX_H = 0.9;
const LINE_H = 1.12;
const RIM_H = 0.03;
const RIM_W = 0.2;
const DOME_H = 0.2;
const DOME_W0 = 0.34;
const DOME_W1 = 0.3;
const HOVER_GROW = 0.065;
const REST_PUFF = 0.8;
const LIGHT_FALLOFF = 0.3;
const HOVER_HYST = 0.02;
const LOCK_LEN0 = 0.06;
const LOCK_LEN1 = 0.032;
const STRAND_W = 0.9;
const STRAND_L = 22;
const CRIMP = 0.5;
const LETTER_FRAY = 5;
const SWIRL_AMP = 1.6;
const SWEEP = 0.75;
const SWELL_SIGMA = 0.45;
const SWELL_XY = 0.34;
const SWELL_Z = 0.3;
const FAR_SHRINK = 0.03;
const RIM_ZONE = 0.3;
const PRESS_SIGMA = 0.3;
const PRESS_Z = 0.36;
const PRESS_SQUASH = 0.03;
const MEM_W = 13;
const INF_W = 12;
const DWELL_SHARE = 0.22;
const DWELL_TAU = 0.6;
const WAKE_GAIN = 0.08;
const WAKE_MAX = 0.4;
const MEM_T = 3;
const SWAY_REST = 0.1;
const SWAY_ACTIVE = 0.14;
const SWAY_RATE = 1;
const SWAY_RATE_ACTIVE = 1.6;
const IDLE_DIVISOR = 4;
const IDLE_DIVISOR_MAX = 6;
const BRUSH_SIGMA = 0.3;
const BRUSH_GAIN = 0.55;
const BRUSH_MAX = 1.6;
const DEFAULTS = {
  link: "",
  background: "rgb(0, 0, 0)",
  textColor: "rgb(244, 247, 255)",
  buttonWidth: 500,
  buttonHeight: 200,
  radius: 86,
  furColor: "rgb(216, 46, 46)",
  furLength: 5,
  sway: 5
};
const DEFAULT_LABEL = "Explore";
const DEFAULT_FONT = { fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: "120px" };
const DEFAULT_PLACEMENT = { x: 0, y: 0, angle: 0, tilt: 0 };
const DEFAULT_RESPONSE = { reach: 0, puff: 5, bulge: 5, press: 5, wobble: 5, drag: 5, brush: 5, release: 0.7 };
const DEFAULT_ADVANCED = {
  lockSize: 5,
  swirl: 70,
  strands: 100,
  flyaways: 6,
  sheen: 100,
  tipLight: 100,
  lightAngle: -40,
  lightHeight: 45,
  shadow: 40,
  glow: 35
};
const SANS = '"Plus Jakarta Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
function clamp(x, a, b) {
  return x < a ? a : x > b ? b : x;
}
function num(v, d) {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : d;
}
function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = s + 1831565813 >>> 0;
    let t = s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function srgbToLin(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function resolveRGB(el, c) {
  const prev = el.style.color;
  el.style.color = "";
  el.style.color = c;
  const out = getComputedStyle(el).color;
  el.style.color = prev;
  const m = out.match(/[\d.]+/g);
  if (!m || m.length < 3) return [0, 0, 0];
  return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
}
function fontCss(font, px) {
  const f = { ...DEFAULT_FONT, ...font };
  const fam = String(f.fontFamily || "").trim();
  const family = !fam ? SANS : /[,"']/.test(fam) ? fam : `"${fam}", ${SANS}`;
  const weight = num(f.fontWeight, 800);
  const style = f.fontStyle === "italic" ? "italic" : "normal";
  return `${style} ${weight} ${px.toFixed(2)}px ${family}`;
}
const requestedFonts = /* @__PURE__ */ new Set();
function ensureFont(font, onReady) {
  const fonts = typeof document !== "undefined" ? document.fonts : void 0;
  const f = { ...DEFAULT_FONT, ...font };
  const fam = String(f.fontFamily || "").trim();
  const css = fontCss(font, 40);
  if (!fonts) return;
  if (!fam || /[,"']/.test(fam) || /^(serif|sans-serif|monospace|system-ui)$/i.test(fam)) {
    fonts.load(css, "E").then(onReady, onReady);
    return;
  }
  let registered = false;
  fonts.forEach((face) => {
    if (face.family.replace(/^["']|["']$/g, "") === fam) registered = true;
  });
  const weight = clamp(Math.round(num(f.fontWeight, 800) / 100) * 100, 100, 900);
  const italic = f.fontStyle === "italic" ? 1 : 0;
  const key = `${fam}|${weight}|${italic}`;
  if (registered || requestedFonts.has(key)) {
    fonts.load(css, "E").then(onReady, onReady);
    return;
  }
  requestedFonts.add(key);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fam).replace(/%20/g, "+")}:ital,wght@${italic},${weight}&display=swap`;
  link.onload = () => fonts.load(css, "E").then(onReady, onReady);
  link.onerror = onReady;
  onReady();
}
function labelSizeRef(font) {
  const v = parseFloat(String(font?.fontSize ?? ""));
  return Number.isFinite(v) && v > 0 ? v : TEXT_SIZE * DEFAULTS.buttonHeight;
}
function isExternal(href) {
  if (typeof window === "undefined") return /^https?:\/\//i.test(href);
  try {
    return new URL(href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}
function bakeNoise() {
  const N = 256;
  const rnd = mulberry(77);
  const w = new Float32Array(N * N);
  for (let i = 0; i < w.length; i++) w[i] = rnd();
  const out = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const k = j * N + i;
      const r = (w[k] + w[j * N + (i + 1) % N]) * 0.5;
      out[k * 4] = Math.round(clamp((r - 0.5) * 1.6 + 0.5, 0, 1) * 255);
      out[k * 4 + 1] = Math.floor(rnd() * 256);
      out[k * 4 + 2] = Math.floor(rnd() * 256);
      out[k * 4 + 3] = Math.floor(rnd() * 256);
    }
  }
  return out;
}
const VERT = `#version 300 es
void main() {
    vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;
const FRAG = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
uniform vec2 uCanvas;
uniform vec2 uOrigin;
uniform float uUpp;
uniform float uUcss;
uniform vec2 uHalf;
uniform float uRad;
uniform vec4 uGrid;      // origin.xy, span.xy
uniform float uDeform;   // largest in-plane displacement on the lattice, 0 at rest
uniform float uInflate;
uniform float uScale;
uniform float uPhase;    // sway clock, rad
uniform vec3 uFur;       // fur colour, linear
uniform vec3 uTip;       // tip and glint colour, linear
uniform vec3 uRoot;
uniform vec3 uInk;
uniform float uInkOn;
uniform vec3 uLight;
uniform vec4 uLock;      // lock cell, lock length (units), swirl (rad), strand contrast
uniform vec4 uLook;      // sheen, tip light, flyaway reach (units), sway (rad)
uniform vec2 uGround;    // shadow, glow
uniform sampler2D uGridTex;
uniform sampler2D uGridGrad;  // slope of the lattice height, per unit
uniform sampler2D uBrush;     // how far the fur is laid along a stroke
uniform sampler2D uNoise;
uniform sampler2D uLabel;
out vec4 outColor;

float sdRR(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec2 nRR(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    vec2 s = vec2(p.x < 0.0 ? -1.0 : 1.0, p.y < 0.0 ? -1.0 : 1.0);
    if (q.x > 0.0 && q.y > 0.0) return normalize(q) * s;
    return q.x > q.y ? vec2(s.x, 0.0) : vec2(0.0, s.y);
}

vec4 cubicW(float v) {
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    return vec4(x, y, z, 6.0 - x - y - z) * (1.0 / 6.0);
}

// Cubic B-spline lattice lookup in four bilinear taps: smooth enough that
// normals taken from it show no grid.
vec4 lattice(sampler2D tex, vec2 q) {
    vec2 size = vec2(textureSize(tex, 0));
    vec2 t = (q - uGrid.xy) / uGrid.zw * (size - 1.0);
    vec2 f = fract(t);
    t -= f;
    vec4 xc = cubicW(f.x);
    vec4 yc = cubicW(f.y);
    vec4 c = t.xxyy + vec2(-0.5, 1.5).xyxy + 0.5;
    vec4 s = vec4(xc.xz + xc.yw, yc.xz + yc.yw);
    vec4 o = (c + vec4(xc.yw, yc.yw) / s) / size.xxyy;
    vec4 s0 = texture(tex, o.xz);
    vec4 s1 = texture(tex, o.yz);
    vec4 s2 = texture(tex, o.xw);
    vec4 s3 = texture(tex, o.yw);
    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);
    return mix(mix(s3, s2, sx), mix(s1, s0, sx), sy);
}

// Pillow height from depth inside the outline: a quarter-round rim, and a
// dome over a widening shoulder as it inflates.
float pillow(float e) {
    float t0 = clamp(e / ${RIM_W.toFixed(4)}, 0.0, 1.0);
    float z = ${RIM_H.toFixed(4)} * sqrt(1.0 - (1.0 - t0) * (1.0 - t0));
    float w1 = max(0.05, ${DOME_W0.toFixed(4)} + ${DOME_W1.toFixed(4)} * uInflate);
    float t1 = clamp(e / w1, 0.0, 1.0);
    float u = 1.0 - t1;
    z += ${DOME_H.toFixed(4)} * uInflate * sqrt(1.0 - u * u * u);
    return z;
}

vec3 toSrgb(vec3 c) {
    c = max(c, 0.0);
    return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

// Integer hash (pcg4d): four independent uniforms per lock cell.
uvec4 pcg4(uvec4 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
    v ^= v >> 16u;
    v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
    return v;
}

vec4 rnd4(ivec2 c, uint salt) {
    return vec4(pcg4(uvec4(uvec2(c + 32768), salt, salt * 7u + 3u))) * (1.0 / 4294967296.0);
}

// The brush field, bilinear: it is smooth already.
vec2 brushAt(vec2 p) {
    vec2 size = vec2(textureSize(uBrush, 0));
    vec2 uv = ((p - uGrid.xy) / uGrid.zw * (size - 1.0) + 0.5) / size;
    return texture(uBrush, uv).xy;
}

// The lay of the fur: outward from the capsule's spine, as the reference's
// fur grows outward from the torus's core (on the spine itself it falls
// downward); swung by a slow swirl and the sway; then stroked by the brush.
vec2 layAt(vec2 p, float swing) {
    vec2 inner = max(uHalf - uRad, 0.0);
    vec2 v = p - clamp(p, -inner, inner);
    float l = length(v);
    vec2 o = l > 1e-4 ? v / l : vec2(0.0, 1.0);
    o = normalize(mix(vec2(0.0, 1.0), o, smoothstep(0.03, 0.2, l)) + 1e-4);
    float a = ${SWEEP.toFixed(3)} + uLock.z * (0.6 * sin(3.1 * p.x + 1.7 * sin(2.3 * p.y + 0.4)) + 0.4 * sin(4.3 * p.y - 2.1 * p.x + 1.3)) + swing;
    float ca = cos(a);
    float sa = sin(a);
    vec2 d = vec2(ca * o.x - sa * o.y, sa * o.x + ca * o.y);
    return normalize(d + brushAt(p) + 1e-4);
}

struct Lock {
    float depth;
    float cov;
    float t;      // 0 at the root, 1 at the tip
    float a;      // -1..1 across the lock
    float strand; // the hair under this pixel, 0..1
    float sid;    // which strand: constant along it
    vec2 d;
    vec4 h;
    ivec2 cell;
};

// One lock: a tapered, S-bent tuft of strands rooted at a jittered point in
// its grid cell, growing along the lay. Roots sit on the skin only.
Lock evalLock(ivec2 cell, vec2 q, float sdPix) {
    Lock k;
    k.cell = cell;
    k.cov = 0.0;
    vec4 h = rnd4(cell, 17u);
    vec2 root = (vec2(cell) + 0.15 + 0.7 * h.xy) * uLock.x;
    // Roots start a little inside the rim, so locks lie over the edge and no
    // row of dark roots traces the outline. Most candidates miss the pixel:
    // every test that can reject one comes before any texture tap.
    float depthIn = -sdRR(root, uHalf, uRad);
    if (depthIn < 0.025) return k;
    vec4 h2 = rnd4(cell, 91u);
    k.h = h2;
    float swing = uLook.w * sin(uPhase + h2.w * 6.2832 + root.x * 1.7);
    vec2 d = layAt(root, swing);
    k.d = d;
    vec2 n = vec2(-d.y, d.x);
    // Seen from the front, fur in the middle of the face stands toward the
    // eye and looks short and bushy; toward the edge it lies down and shows
    // its full length, as the reference's long sweeping rim locks do.
    float len = uLock.y * (0.75 + 0.5 * h.z) * mix(1.0, 0.75, smoothstep(0.06, 0.38, depthIn));
    vec2 v = q - root;
    float along = dot(v, d);
    float t = along / len;
    if (t < -0.2 || t > 1.02) return k;
    // S-bent: a lock curls one way, then its tip flicks back.
    float across = dot(v, n) - len * ((h2.x - 0.5) * 0.9 * t * t - (h2.y - 0.5) * 0.8 * t * t * t);
    // A tuft, not a spike: wide, with a blunt rounded tip its hairs spray from.
    float w = uLock.x * (0.6 + 0.45 * h.w) * pow(clamp(1.0 - t, 0.0, 1.0), 0.35) * smoothstep(-0.2, 0.15, t);
    k.t = t;
    k.a = across / max(w, 1e-5);
    if (abs(k.a) >= 1.0) return k;
    // A tuft is a bundle of 1 px hairs, not a solid. They fan out toward the
    // tip and crimp gently; each has its own brightness and its own length,
    // so the tip sprays into wisps and the gaps show the layer below. A
    // second, finer octave of short hairs is the soft cotton fuzz between.
    float alongPx = along / uUcss;
    float sx = (across / uUcss / (1.0 + 0.9 * clamp(t, 0.0, 1.0)) + ${CRIMP.toFixed(2)} * sin(alongPx * 0.17 + h.z * 6.2832)) / ${STRAND_W.toFixed(2)};
    float st = texture(uNoise, vec2(sx, alongPx / ${STRAND_L.toFixed(1)}) / 256.0 + h.zw).a;
    float sid = texture(uNoise, vec2(sx, 7.5) / 256.0 + h.wz).b;
    float fz = texture(uNoise, vec2(sx * 1.7, alongPx / ${(STRAND_L / 4).toFixed(2)}) / 256.0 + h.yx).r;
    k.strand = 0.45 * st + 0.3 * sid + 0.25 * fz;
    k.sid = sid;
    float env = pow(smoothstep(0.0, 1.0, 1.0 - abs(k.a)), 0.7);
    float fill = 0.5 + 0.5 * smoothstep(0.25, 0.65, st);
    float tEnd = 0.55 + 0.45 * sid;
    float cov = env * fill * (1.0 - smoothstep(tEnd - 0.25, tEnd, t)) * smoothstep(-0.2, -0.02, t);
    // Past the body's edge a tuft thins to its longest, finest hairs, so the
    // silhouette is wisps rather than spikes.
    float beyond = smoothstep(-0.01, 0.07, sdPix);
    cov *= mix(1.0, smoothstep(0.5, 0.8, st) * (0.4 + 0.6 * sid), beyond);
    k.cov = cov;
    // Upstream locks lie over the roots of downstream ones, like shingles.
    k.depth = -dot(root, d) / uLock.x + h2.z * 0.8;
    return k;
}

vec3 lockAlbedo(Lock k, float ink) {
    vec3 a = uFur * (0.86 + 0.28 * k.h.x);
    // The odd lighter lock, as in the reference.
    a = mix(a, uTip * 0.75, 0.22 * smoothstep(0.82, 1.0, k.h.y));
    return mix(a, uInk, ink);
}

// Hair lightens toward its tips, a little desaturated, as the reference's
// strands do: (59,93,164) tips over a (31,67,143) body.
vec3 tipped(vec3 albedo, float t, float ink) {
    return mix(albedo, uTip * 0.85, 0.25 * smoothstep(0.25, 1.0, t) * (1.0 - ink));
}

// A lock shades as a cylinder of hair lying along its lay, standing off the
// skin at the root and lying down toward the tip; strands glint where they
// run square to the half vector (Kajiya\u2013Kay).
vec3 shadeLock(Lock k, vec3 Nb, vec3 albedo, float illum, float ink) {
    float a = clamp(k.a, -1.0, 1.0);
    float tc = clamp(k.t, 0.0, 1.0);
    float lift = mix(0.85, 0.2, tc) + 0.4 * smoothstep(0.1, 0.4, -sdRR(vec2(0.0), uHalf, uRad));
    vec3 T = normalize(vec3(k.d * cos(lift), sin(lift)));
    vec3 B = vec3(-k.d.y, k.d.x, 0.0);
    vec3 U = normalize(cross(T, B));
    vec3 Nl = normalize(B * a * 0.85 + U * sqrt(max(0.0, 1.0 - a * a)) + (Nb - vec3(0.0, 0.0, 1.0)));
    float NoL = dot(Nl, uLight);
    // Hair scatters softly: wide wrap, gentle glints.
    float diff = clamp((NoL + 0.6) / 1.6, 0.0, 1.0);
    vec3 H = normalize(uLight + vec3(0.0, 0.0, 1.0));
    float TH = dot(T, H);
    float glint = pow(sqrt(max(0.0, 1.0 - TH * TH)), 16.0) * smoothstep(-0.3, 0.4, NoL);
    // Plush fur is soft: its roots and gaps sit at ~60% of the tips, as the
    // swatch's darkest shadows do, not near black.
    float rootTip = mix(0.66, 1.0 + 0.1 * uLook.y, smoothstep(0.0, 0.8, tc));
    float strand = 1.0 + uLock.w * 0.4 * (k.strand - 0.5);
    // Dyed letters stay bright enough to read: their fur shades gently.
    rootTip = mix(rootTip, 0.85 + 0.15 * rootTip, ink);
    strand = mix(strand, 1.0 + 0.3 * (strand - 1.0), ink);
    vec3 col = tipped(albedo, tc, ink) * (0.35 + 0.75 * diff) * rootTip * strand * illum;
    col += uTip * uLook.x * 0.1 * (1.0 - 0.7 * ink) * glint * rootTip * strand * illum;
    // Tuft edges sit a little in their neighbours' shade.
    col *= 0.88 + 0.12 * sqrt(max(0.0, 1.0 - a * a));
    // Dyed letters read as clean white fur: mostly their own lit colour,
    // with just enough strand to belong to the coat.
    col = mix(col, albedo * (0.72 + 0.35 * diff) * illum * (0.92 + 0.16 * (k.strand - 0.5)), 0.65 * ink);
    return col;
}

void main() {
    vec2 fc = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y);
    vec2 p = uOrigin + fc * uUpp;

    // Invert the displacement: find the cloth point q that landed here. One
    // fixed-point step serves the ground; the fur takes two more.
    vec2 q = p / uScale;
    vec4 D = vec4(0.0);
    if (uDeform > 0.0) {
        D = lattice(uGridTex, q);
        q = (p - D.xy) / uScale;
    }
    float aa = uUpp;
    vec3 dither = texelFetch(uNoise, ivec2(gl_FragCoord.xy) & 255, 0).rgb - 0.5;

    // Ground: a soft contact shadow under the fur, and a faint bounce.
    float reachOut = uLock.y * 1.2 + uLook.z;
    float lift = 0.035 + 0.05 * uInflate;
    // Soft and broad, mostly under the bottom: fur has no hard edge to cast.
    float dSh = max(sdRR(q - vec2(0.0, lift + 0.16), uHalf * vec2(0.92, 0.75), uRad * 0.8), 0.0);
    float shadow = uGround.x * 0.75 * exp(-dSh / (0.16 + 0.05 * uInflate));
    float sdOut = sdRR(q, uHalf, uRad);
    float dg = max(sdOut - reachOut * 0.5, 0.0) / 0.25;
    vec3 glow = toSrgb(uTip * uGround.y * 0.03 * exp(-dg * dg));
    // Both tails reach exactly zero before the canvas border.
    vec2 toEdge = min(p - uOrigin, uOrigin + uCanvas * uUpp - p);
    float win = smoothstep(0.0, 0.22, min(toEdge.x, toEdge.y));
    glow *= win;
    shadow *= win;

    // Pixels no fur can reach skip the rest.
    float far = reachOut + 2.0 * aa;
    if (sdOut - uDeform / uScale > far) {
        outColor = vec4(glow + dither / 255.0, shadow);
        return;
    }
    if (uDeform > 0.0) {
        for (int i = 0; i < 2; i++) {
            D = lattice(uGridTex, q);
            q = (p - D.xy) / uScale;
        }
    }
    float sd = sdRR(q, uHalf, uRad);
    if (sd > far) {
        outColor = vec4(glow + dither / 255.0, shadow);
        return;
    }

    // Body: the cushion's own shape, for the undercoat and the fur's tilt.
    float e = max(-sd, 0.0);
    float eps = max(uUpp * 1.5, 0.002);
    float z0 = pillow(e);
    float zx = pillow(max(-sdRR(q + vec2(eps, 0.0), uHalf, uRad), 0.0));
    float zy = pillow(max(-sdRR(q + vec2(0.0, eps), uHalf, uRad), 0.0));
    vec2 g = vec2(zx - z0, zy - z0) / eps;
    if (uDeform > 0.0) g += lattice(uGridGrad, q).xy;
    // Fur rests on a soft round mass: it takes the body's normal gentled,
    // never the sideways normal at the very rim.
    // The pillow's quarter-round rim is vertical at the seam; capping the
    // slope keeps that from shading a hairline dark arc round the outline.
    g *= 0.45 / max(1.0, length(g) * 0.45 / 0.9);
    vec3 Nb = normalize(vec3(-g, 1.0));
    vec2 lxy = normalize(uLight.xy + 1e-5);
    float illum = clamp(1.0 + ${LIGHT_FALLOFF.toFixed(3)} * dot(q, lxy), 0.4, 1.6);
    float bodyDiff = clamp((dot(Nb, uLight) + 0.3) / 1.3, 0.0, 1.0);

    // Dyed letters: the label colours whatever fur lies over it. Sampled in
    // place: the lay parts along the spine, right through the lettering, so
    // pulling the mask along it would split every letter there.
    vec2 F0 = layAt(q, 0.0);
    float ink = 0.0;
    float letterShade = 0.0;
    if (uInkOn > 0.5) {
        ink = texture(uLabel, q / (uHalf * 2.0) + 0.5).a;
        // The letters stand up out of the pile as raised tufts: a soft shadow
        // falls from them onto the fur on the side away from the light.
        letterShade = textureLod(uLabel, (q + uLight.xy * 0.035) / (uHalf * 2.0) + 0.5, 3.0).a;
    }

    // Gather the locks that can reach this pixel: walk back along the lay,
    // trying the 2\xD72 cells around each step, and keep the top two. Steps sit
    // under a cell apart whatever the fur length, and the walk follows the
    // lay as it curves, so long locks are not missed (a missed lock shows as
    // a blocky seam where the candidate set changes between pixels).
    Lock best1;
    best1.depth = -1e9;
    best1.cov = 0.0;
    best1.cell = ivec2(-99999);
    Lock best2 = best1;
    float reachBack = uLock.y * 1.2;
    int steps = int(clamp(ceil(reachBack / (0.85 * uLock.x)) + 1.0, 4.0, 10.0));
    float stepLen = reachBack / float(steps - 1);
    vec2 pk = q - F0 * uLock.y * 0.1;
    // (Trying fewer cells per step misses locks; the early-outs in evalLock
    // carry the cost instead.)
    for (int s = 0; s < 10; s++) {
        if (s >= steps) break;
        if (s > 0) pk -= layAt(pk, 0.0) * stepLen;
        ivec2 b = ivec2(floor(pk / uLock.x - 0.5));
        for (int j = 0; j < 4; j++) {
            ivec2 cell = b + ivec2(j & 1, j >> 1);
            if (cell == best1.cell || cell == best2.cell) continue;
            Lock L = evalLock(cell, q, sd);
            if (L.cov < 0.004) continue;
            if (L.depth > best1.depth) {
                best2 = best1;
                best1 = L;
            } else if (L.depth > best2.depth) {
                best2 = L;
            }
        }
    }

    // Undercoat: the dense, dark fur between the locks, inside the body.
    // Undercoat: dense short hair along the lay, dark where it is deep in the
    // pile, its edge feathering out rather than ending in a line.
    vec2 qp = q / uUcss;
    float us = texture(uNoise, vec2(dot(qp, vec2(-F0.y, F0.x)) / 1.1, dot(qp, F0) / 5.0) / 256.0 + 0.31).a;
    float body = smoothstep(0.02, -0.09, sd + 0.04 * (us - 0.5));
    // Soft and only a little darker than the tufts, as plush is; brighter
    // toward the rim, where the swept tufts part, so no line traces the edge.
    float rimLift = smoothstep(-0.14, 0.0, sd);
    float inkU = uInkOn > 0.5 ? texture(uLabel, (q + F0 * (us - 0.5) * ${LETTER_FRAY.toFixed(1)} * uUcss) / (uHalf * 2.0) + 0.5).a : 0.0;
    vec3 under = mix(uRoot * mix(0.85, 1.1, rimLift), uInk * 0.8, inkU) * (0.55 + 0.5 * bodyDiff) * illum * (0.8 + 0.4 * us);
    vec4 acc = vec4(under * body, body);
    // Letters made of the fur: each hair carries the dye a little up or down
    // its own length, so a letter's edge is hairs crossing it both ways.
    if (best2.cov > 0.0) {
        float i2 = uInkOn > 0.5 ? texture(uLabel, (q - best2.d * (best2.sid - 0.5) * ${(2 * LETTER_FRAY).toFixed(1)} * uUcss) / (uHalf * 2.0) + 0.5).a : 0.0;
        vec3 c2 = shadeLock(best2, Nb, lockAlbedo(best2, i2), illum, i2);
        acc = vec4(c2 * best2.cov, best2.cov) + acc * (1.0 - best2.cov);
    }
    if (best1.cov > 0.0) {
        float i1 = uInkOn > 0.5 ? texture(uLabel, (q - best1.d * (best1.sid - 0.5) * ${(2 * LETTER_FRAY).toFixed(1)} * uUcss) / (uHalf * 2.0) + 0.5).a : 0.0;
        vec3 c1 = shadeLock(best1, Nb, lockAlbedo(best1, i1), illum, i1);
        acc = vec4(c1 * best1.cov, best1.cov) + acc * (1.0 - best1.cov);
    }
    acc.rgb *= 1.0 - 0.4 * letterShade * (1.0 - ink);

    // A soft halo of fine fuzz round the body: the swatch's edges are cotton,
    // not cut.
    if (sd > -0.03 && sd < 0.06) {
        float halo = exp(-max(sd, 0.0) / 0.018) * smoothstep(-0.03, 0.0, sd);
        float fzz = texture(uNoise, qp / 1.3 / 256.0 + 0.77).a;
        float ha = halo * smoothstep(0.35, 0.9, fzz) * 0.45;
        vec3 hc = mix(uFur, uTip, 0.35) * (0.5 + 0.6 * bodyDiff) * illum;
        acc += vec4(hc * ha, ha) * (1.0 - acc.a);
    }

    // Flyaways: single long hairs past the locks, each rooted on the outline
    // (so they stay crisp round the caps), leaning, tapering to the tip.
    float flyReach = uLock.y * 0.7 + uLook.z;
    if (uLook.z > 0.0 && sd > -aa && sd < flyReach && acc.a < 0.999) {
        vec2 nH = nRR(q, uHalf, uRad);
        float dh = max(sd, 0.0);
        // Each flyaway leans and crimps a little along its length.
        vec2 tH = vec2(-nH.y, nH.x);
        vec2 root = q - nH * dh + tH * (dh * 0.45 + 0.8 * uUcss * sin(dh / uUcss * 0.22));
        vec4 hn = texture(uNoise, root / (uUcss * 1.2) / 256.0 + 0.53);
        float hl = flyReach * (0.15 + 0.85 * hn.g * hn.g);
        float hair = smoothstep(0.72, 0.88, hn.a) * (1.0 - smoothstep(0.25 * hl, hl, dh));
        vec3 hc = mix(uFur, uTip, 0.45) * (0.4 + 0.8 * bodyDiff) * illum;
        acc += vec4(hc * hair, hair) * 0.8 * (1.0 - acc.a);
    }

    float A = acc.a;
    vec3 rgb = toSrgb(A > 1e-4 ? acc.rgb / A : vec3(0.0));
    outColor = vec4(rgb * A + glow * (1.0 - A) + dither / 255.0, A + (1.0 - A) * shadow);
}`;
function makeLattice(hw, r) {
  const spanX = 2 * (hw + MARGIN);
  const spanY = 2 * (0.5 + MARGIN);
  const nx = clamp(Math.round(spanX / GRID_PITCH) + 1, 8, 160);
  const ny = clamp(Math.round(spanY / GRID_PITCH) + 1, 8, 96);
  const n = nx * ny;
  const L = {
    nx,
    ny,
    ox: -spanX / 2,
    oy: -spanY / 2,
    spanX,
    spanY,
    px: new Float32Array(n),
    py: new Float32Array(n),
    dirX: new Float32Array(n),
    dirY: new Float32Array(n),
    d: new Float32Array(n * 3),
    v: new Float32Array(n * 3),
    bx: new Float32Array(n),
    by: new Float32Array(n),
    gx: new Float32Array(nx * 3),
    gy: new Float32Array(ny * 3),
    tex: new Float32Array(n * 4),
    grad: new Float32Array(n * 2),
    brush: new Float32Array(n * 2),
    key: ""
  };
  const ix = Math.max(0, hw - r);
  const iy = Math.max(0, 0.5 - r);
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      const x = L.ox + spanX * i / (nx - 1);
      const y = L.oy + spanY * j / (ny - 1);
      L.px[k] = x;
      L.py[k] = y;
      const dx = x - clamp(x, -ix, ix);
      const dy = y - clamp(y, -iy, iy);
      const len = Math.hypot(dx, dy);
      const reachIn = clamp((len - (0.5 - RIM_ZONE)) / RIM_ZONE, 0, 1);
      const k2 = reachIn * reachIn * (3 - 2 * reachIn) / Math.max(len, 1e-3);
      L.dirX[k] = dx * k2;
      L.dirY[k] = dy * k2;
    }
  }
  return L;
}
function __OriginkitBase_MohairCapsule(props) {
  const {
    link = DEFAULTS.link,
    background = DEFAULTS.background,
    label: labelText = DEFAULT_LABEL,
    font,
    textColor = DEFAULTS.textColor,
    buttonWidth = DEFAULTS.buttonWidth,
    buttonHeight = DEFAULTS.buttonHeight,
    radius = DEFAULTS.radius,
    furColor = DEFAULTS.furColor,
    furLength = DEFAULTS.furLength,
    sway = DEFAULTS.sway,
    placement,
    response,
    advanced,
    onClick,
    style,
    hitRef,
    onFrame,
    fit,
    tipColor,
    rootColor
  } = props;
  const onFrameRef = useRef(null);
  onFrameRef.current = onFrame;
  const fitRef = useRef(fit);
  fitRef.current = fit;
  const pl = { ...DEFAULT_PLACEMENT, ...placement };
  const rs = { ...DEFAULT_RESPONSE, ...response };
  const adv = { ...DEFAULT_ADVANCED, ...advanced };
  const lines = String(labelText ?? "").split("\n").filter((l) => l.trim());
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(() => {
  });
  const pressRef = useRef(() => {
  });
  const [size, setSize] = useState({ w: REF_W, h: REF_H });
  const [fallback, setFallback] = useState(false);
  const S = fit ? REF_H : Math.min(size.h, size.w / REF_ASPECT);
  const u = S / REF_H;
  const bwRef = Math.max(60, buttonWidth);
  const bhRef = Math.max(24, buttonHeight);
  const rRef = clamp(radius, 0, Math.min(bwRef, bhRef) / 2);
  const bw = bwRef * u;
  const bh = bhRef * u;
  const m = MARGIN * bh;
  const cw = bw + 2 * m;
  const ch = bh + 2 * m;
  const cfg = { bwRef, bhRef, rRef, furColor, furLength, textColor, lines, font, pl, rs, adv, sway, tipColor, rootColor };
  const live = useRef({ cfg, key: "", w: size.w, h: size.h });
  const key = JSON.stringify(cfg);
  live.current.cfg = cfg;
  live.current.w = size.w;
  live.current.h = size.h;
  useEffect(() => {
    if (live.current.key !== key) {
      live.current.key = key;
      wakeRef.current();
    }
  });
  useEffect(() => {
    const root = rootRef.current;
    const hitEl = hitRef?.current ?? root;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const state = {
      hov: 0,
      relT: -1,
      relFrom: 0,
      dwell: 0,
      hovTarget: 0,
      cx: 0,
      cy: 0,
      pvx: 0,
      pvy: 0,
      press: 0,
      pressV: 0,
      pressTarget: 0,
      inf: 0,
      infV: 0,
      acc: 0,
      shown: 1,
      shownDirty: true,
      labelKey: "",
      colorKey: "",
      fur: [0, 0, 0],
      tip: [0, 0, 0],
      ink: [0, 0, 0],
      quality: 1,
      phase: 0,
      act: 0,
      idle: false,
      idleDiv: IDLE_DIVISOR,
      expectMs: 16.7,
      raiseLocked: false,
      lastRaiseAt: -1,
      lost: false
    };
    const pt = { has: false, x: 0, y: 0, dirty: false, down: false, focus: false, bx: 0, by: 0, lastBx: 0, lastBy: 0 };
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      if (r.width > 0 && r.height > 0) {
        setSize((s) => Math.abs(s.w - r.width) < 0.5 && Math.abs(s.h - r.height) < 0.5 ? s : { w: r.width, h: r.height });
        state.shownDirty = true;
        wakeRef.current();
      }
    });
    ro.observe(root);
    const glOpts = {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false
    };
    let gl = canvas.getContext("webgl2", glOpts);
    if (!gl) {
      setFallback(true);
      return () => ro.disconnect();
    }
    let lattice = null;
    let reduced = false;
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    reduced = !!mq?.matches;
    const onMq = () => {
      reduced = !!mq?.matches;
      wake();
    };
    mq?.addEventListener?.("change", onMq);
    let prog = null;
    let texGrid = null;
    let texGrad = null;
    let texBrush = null;
    let texNoise = null;
    let texLabel = null;
    let gridDims = "";
    const loc = {};
    const ucache = {};
    let compiled = false;
    let parallel = null;
    let vs = null;
    let fs = null;
    const labelCanvas = document.createElement("canvas");
    const build = () => {
      const g = gl;
      compiled = false;
      parallel = g.getExtension("KHR_parallel_shader_compile");
      vs = g.createShader(g.VERTEX_SHADER);
      fs = g.createShader(g.FRAGMENT_SHADER);
      prog = g.createProgram();
      if (!vs || !fs || !prog) return;
      g.shaderSource(vs, VERT);
      g.shaderSource(fs, FRAG);
      g.compileShader(vs);
      g.compileShader(fs);
      g.attachShader(prog, vs);
      g.attachShader(prog, fs);
      g.linkProgram(prog);
      gridDims = "";
      for (const k in ucache) delete ucache[k];
      const mk = (filter, wrap) => {
        const t = g.createTexture();
        g.bindTexture(g.TEXTURE_2D, t);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, filter);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, wrap);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, wrap);
        return t;
      };
      texGrid = mk(g.LINEAR, g.CLAMP_TO_EDGE);
      texGrad = mk(g.LINEAR, g.CLAMP_TO_EDGE);
      texBrush = mk(g.LINEAR, g.CLAMP_TO_EDGE);
      texNoise = mk(g.LINEAR, g.REPEAT);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA8, 256, 256, 0, g.RGBA, g.UNSIGNED_BYTE, bakeNoise());
      texLabel = mk(g.LINEAR_MIPMAP_LINEAR, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA8, 1, 1, 0, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array(4));
      state.labelKey = "";
    };
    const finishCompile = () => {
      const g = gl;
      if (compiled) return true;
      if (!prog || !vs || !fs) return false;
      if (parallel && !g.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) return false;
      if (!g.getProgramParameter(prog, g.LINK_STATUS)) {
        console.warn("MohairCapsule:", g.getShaderInfoLog(fs) || g.getProgramInfoLog(prog));
        state.lost = true;
        setFallback(true);
        return false;
      }
      g.useProgram(prog);
      const names = [
        "uCanvas",
        "uOrigin",
        "uUpp",
        "uUcss",
        "uHalf",
        "uRad",
        "uGrid",
        "uDeform",
        "uInflate",
        "uScale",
        "uPhase",
        "uActive",
        "uFur",
        "uTip",
        "uRoot",
        "uInk",
        "uInkOn",
        "uLight",
        "uLock",
        "uLook",
        "uGround",
        "uGridTex",
        "uBrush",
        "uNoise",
        "uLabel",
        "uGridGrad"
      ];
      for (const n of names) loc[n] = g.getUniformLocation(prog, n);
      g.uniform1i(loc.uGridTex, 0);
      g.uniform1i(loc.uBrush, 1);
      g.uniform1i(loc.uNoise, 2);
      g.uniform1i(loc.uLabel, 3);
      g.uniform1i(loc.uGridGrad, 4);
      g.disable(g.BLEND);
      compiled = true;
      return true;
    };
    const setU = (name, a, b, c, d) => {
      const g = gl;
      let v = ucache[name];
      if (!v) v = ucache[name] = new Float32Array([NaN, NaN, NaN, NaN]);
      const n = d !== void 0 ? 4 : c !== void 0 ? 3 : b !== void 0 ? 2 : 1;
      if (v[0] === a && (n < 2 || v[1] === b) && (n < 3 || v[2] === c) && (n < 4 || v[3] === d)) return;
      v[0] = a;
      if (b !== void 0) v[1] = b;
      if (c !== void 0) v[2] = c;
      if (d !== void 0) v[3] = d;
      const l = loc[name];
      if (n === 1) g.uniform1f(l, a);
      else if (n === 2) g.uniform2f(l, a, b);
      else if (n === 3) g.uniform3f(l, a, b, c);
      else g.uniform4f(l, a, b, c, d);
    };
    build();
    let fontTick = 0;
    const onFontReady = () => {
      fontTick++;
      wake();
    };
    const onFontsDone = () => onFontReady();
    document.fonts?.addEventListener?.("loadingdone", onFontsDone);
    const drawLabel = (bwPx, bhPx, scale) => {
      const g = gl;
      const c = live.current.cfg;
      const lk = JSON.stringify([c.lines, c.font, Math.round(bwPx * scale), Math.round(bhPx * scale), fontTick]);
      if (lk === state.labelKey) return;
      if (!state.labelKey || !state.labelKey.includes(JSON.stringify(c.font ?? null))) ensureFont(c.font, onFontReady);
      state.labelKey = lk;
      const W2 = Math.max(1, Math.min(2048, Math.round(bwPx * scale)));
      const H2 = Math.max(1, Math.min(1024, Math.round(bhPx * scale)));
      labelCanvas.width = W2;
      labelCanvas.height = H2;
      const ctx = labelCanvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, W2, H2);
      const n = c.lines.length;
      if (n) {
        let fs2 = Math.min(labelSizeRef(c.font) * (H2 / c.bhRef), H2 * TEXT_MAX_H / (n * LINE_H));
        ctx.font = fontCss(c.font, fs2);
        const ls = c.font?.letterSpacing;
        const ctxLs = ctx;
        const lsEm = typeof ls === "string" && ls.endsWith("em") ? parseFloat(ls) : typeof ls === "number" ? ls / 16 : 0;
        const applyLs = () => {
          if ("letterSpacing" in ctxLs) ctxLs.letterSpacing = `${(num(lsEm, 0) * fs2).toFixed(2)}px`;
        };
        applyLs();
        let widest = 0;
        for (const l of c.lines) widest = Math.max(widest, ctx.measureText(l).width);
        if (widest > W2 * TEXT_MAX_W) {
          fs2 *= W2 * TEXT_MAX_W / widest;
          ctx.font = fontCss(c.font, fs2);
          applyLs();
        }
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        const ms = c.lines.map((l) => ctx.measureText(l));
        const top = ms[0].actualBoundingBoxAscent || fs2 * 0.72;
        const bottom = (n - 1) * fs2 * LINE_H + (ms[n - 1].actualBoundingBoxDescent || 0);
        let y = H2 / 2 - (bottom - top) / 2;
        for (let i = 0; i < n; i++) {
          const mi = ms[i];
          const left = mi.actualBoundingBoxLeft || 0;
          const right = mi.actualBoundingBoxRight || mi.width;
          ctx.fillText(c.lines[i], W2 / 2 - (right - left) / 2, y);
          y += fs2 * LINE_H;
        }
      }
      g.activeTexture(g.TEXTURE3);
      g.bindTexture(g.TEXTURE_2D, texLabel);
      g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA8, g.RGBA, g.UNSIGNED_BYTE, labelCanvas);
      g.generateMipmap(g.TEXTURE_2D);
    };
    const onMove = (e) => {
      pt.x = e.clientX;
      pt.y = e.clientY;
      pt.has = true;
      pt.dirty = true;
      wake();
    };
    const onLeave = () => {
      pt.has = false;
      pt.down = false;
      wake();
    };
    const onDown = (e) => {
      onMove(e);
      pt.down = true;
    };
    const onUp = (e) => {
      pt.down = false;
      if (e.pointerType === "touch") pt.has = false;
      wake();
    };
    const onScroll = () => {
      if (pt.has) {
        pt.dirty = true;
        wake();
      }
    };
    hitEl.addEventListener("pointermove", onMove);
    hitEl.addEventListener("pointerdown", onDown);
    hitEl.addEventListener("pointerup", onUp);
    hitEl.addEventListener("pointercancel", onLeave);
    hitEl.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    const onRootClick = (e) => {
      const hit = (hitRef?.current ?? root.querySelector("[data-mc-hit]"));
      if (!hit || state.hovTarget === 0 || hit.contains(e.target)) return;
      hit.click();
    };
    root.addEventListener("click", onRootClick);
    const btn = (hitRef?.current ?? root.querySelector("[data-mc-hit]"));
    const onFocus = () => {
      pt.focus = btn?.matches(":focus-visible") ?? false;
      wake();
    };
    const onBlur = () => {
      pt.focus = false;
      wake();
    };
    btn?.addEventListener("focus", onFocus);
    btn?.addEventListener("blur", onBlur);
    let pulseUntil = 0;
    pressRef.current = () => {
      pulseUntil = performance.now() + 140;
      wake();
    };
    let raf = 0;
    let running = false;
    let visible = true;
    let pageVisible = !document.hidden;
    let last = 0;
    let tickCount = 0;
    let drawnFrames = 0;
    const gaps = new Float32Array(15);
    let gapN = 0;
    const lates = new Float32Array(9);
    let lateN = 0;
    let slowFrames = 0;
    let fastFrames = 0;
    let lastRaf = 0;
    function wake() {
      if (running || !visible || !pageVisible || state.lost) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    }
    wakeRef.current = wake;
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible) wake();
    });
    io.observe(root);
    const onVis = () => {
      pageVisible = !document.hidden;
      if (pageVisible) wake();
    };
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e) => {
      e.preventDefault();
      state.lost = true;
      running = false;
      cancelAnimationFrame(raf);
    };
    const onRestored = () => {
      state.lost = false;
      gl = canvas.getContext("webgl2", glOpts);
      if (!gl) return;
      build();
      wake();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    const median = (a, n) => {
      const k = Math.min(n, a.length);
      const tmp = medTmp;
      for (let i = 0; i < k; i++) tmp[i] = a[i];
      for (let i = 1; i < k; i++) {
        const v = tmp[i];
        let j = i - 1;
        while (j >= 0 && tmp[j] > v) {
          tmp[j + 1] = tmp[j];
          j--;
        }
        tmp[j + 1] = v;
      }
      return tmp[k >> 1];
    };
    const medTmp = new Float32Array(16);
    const dampScale = () => reduced ? 1.4 : Math.exp(-0.13 * (clamp(live.current.cfg.rs.wobble, 0, 10) - 5));
    const stepLattice = (L) => {
      const c = live.current.cfg;
      const bulge = clamp(c.rs.bulge, 0, 10) / 5;
      const pressK = clamp(c.rs.press, 0, 10) / 5;
      const dragK = reduced ? 0 : clamp(c.rs.drag, 0, 10) / 5 * 3.8;
      const brushK = reduced ? 0 : clamp(c.rs.brush, 0, 10) / 5;
      const wl = MEM_W;
      const memK = wl * wl;
      const damp = 2 * wl * dampScale();
      const h = L.spanX / (L.nx - 1);
      const hy = L.spanY / (L.ny - 1);
      const Tx = MEM_T / (h * h);
      const Ty = MEM_T / (hy * hy);
      const inv2s = 1 / (2 * SWELL_SIGMA * SWELL_SIGMA);
      const inv2p = 1 / (2 * PRESS_SIGMA * PRESS_SIGMA);
      const inv2r = 1 / (2 * BRUSH_SIGMA * BRUSH_SIGMA);
      const brushDecay = 1 - Math.exp(-STEP / Math.max(0.1, c.rs.release));
      const wake2 = 1 + Math.min(WAKE_MAX, WAKE_GAIN * Math.hypot(state.pvx, state.pvy)) * (clamp(c.rs.drag, 0, 10) / 5);
      const amp = ((1 - DWELL_SHARE) * state.hov * state.hov + DWELL_SHARE * state.dwell) * bulge * wake2;
      const pr = state.press * pressK;
      const { nx, ny, d, v, bx, by, dirX, dirY, gx, gy } = L;
      const pvx = clamp(state.pvx, -12, 12);
      const pvy = clamp(state.pvy, -12, 12);
      const dvx = pvx * dragK * state.hov;
      const dvy = pvy * dragK * state.hov;
      const sbx = brushK * state.hov * pvx * BRUSH_GAIN;
      const sby = brushK * state.hov * pvy * BRUSH_GAIN;
      const stroking = sbx !== 0 || sby !== 0;
      const driven = amp > 1e-5 || pr > 1e-5;
      const active = driven || stroking || dvx !== 0 || dvy !== 0;
      if (active) {
        for (let i = 0; i < nx; i++) {
          const t = L.ox + L.spanX * i / (nx - 1) - state.cx;
          const t2 = t * t;
          gx[i * 3] = Math.exp(-t2 * inv2s);
          gx[i * 3 + 1] = Math.exp(-t2 * inv2p);
          gx[i * 3 + 2] = Math.exp(-t2 * inv2r);
        }
        for (let j = 0; j < ny; j++) {
          const t = L.oy + L.spanY * j / (ny - 1) - state.cy;
          const t2 = t * t;
          gy[j * 3] = Math.exp(-t2 * inv2s);
          gy[j * 3 + 1] = Math.exp(-t2 * inv2p);
          gy[j * 3 + 2] = Math.exp(-t2 * inv2r);
        }
      }
      for (let j = 1; j < ny - 1; j++) {
        for (let i = 1; i < nx - 1; i++) {
          const k = j * nx + i;
          let tx = 0;
          let ty = 0;
          let tz = 0;
          let gs = 0;
          let gr = 0;
          if (active) {
            gs = gx[i * 3] * gy[j * 3];
            gr = gx[i * 3 + 2] * gy[j * 3 + 2];
            if (driven) {
              const gp = gx[i * 3 + 1] * gy[j * 3 + 1];
              const out = amp * (SWELL_XY * gs - FAR_SHRINK * (1 - gs)) + pr * gp * 0.04;
              tx = dirX[k] * out;
              ty = dirY[k] * out;
              tz = amp * gs * SWELL_Z - pr * gp * PRESS_Z;
            }
          }
          const k3 = k * 3;
          const kl = k3 - 3;
          const kr = k3 + 3;
          const ku = k3 - nx * 3;
          const kd = k3 + nx * 3;
          let di = d[k3];
          v[k3] += (memK * (tx - di) + Tx * (d[kl] + d[kr] - 2 * di) + Ty * (d[ku] + d[kd] - 2 * di) - damp * v[k3] + dvx * gs) * STEP;
          di = d[k3 + 1];
          v[k3 + 1] += (memK * (ty - di) + Tx * (d[kl + 1] + d[kr + 1] - 2 * di) + Ty * (d[ku + 1] + d[kd + 1] - 2 * di) - damp * v[k3 + 1] + dvy * gs) * STEP;
          di = d[k3 + 2];
          v[k3 + 2] += (memK * (tz - di) + Tx * (d[kl + 2] + d[kr + 2] - 2 * di) + Ty * (d[ku + 2] + d[kd + 2] - 2 * di) - damp * v[k3 + 2]) * STEP;
          let nbx = bx[k] + sbx * gr * STEP * 8;
          let nby = by[k] + sby * gr * STEP * 8;
          nbx -= nbx * brushDecay;
          nby -= nby * brushDecay;
          const bl = Math.hypot(nbx, nby);
          if (bl > BRUSH_MAX) {
            nbx *= BRUSH_MAX / bl;
            nby *= BRUSH_MAX / bl;
          }
          bx[k] = nbx;
          by[k] = nby;
        }
      }
      for (let k = 0; k < nx * ny; k++) {
        const k3 = k * 3;
        d[k3] += v[k3] * STEP;
        d[k3 + 1] += v[k3 + 1] * STEP;
        d[k3 + 2] += v[k3 + 2] * STEP;
      }
    };
    const clothOut = [0, 0];
    const clothPoint = (x, y) => {
      const L = lattice;
      const sc = 1 + HOVER_GROW * state.inf;
      let qx = x / sc;
      let qy = y / sc;
      if (L) {
        for (let it = 0; it < 3; it++) {
          const fx = clamp((qx - L.ox) / L.spanX * (L.nx - 1), 0, L.nx - 1.001);
          const fy = clamp((qy - L.oy) / L.spanY * (L.ny - 1), 0, L.ny - 1.001);
          const i = Math.floor(fx);
          const j = Math.floor(fy);
          const u2 = fx - i;
          const w = fy - j;
          const k = j * L.nx + i;
          const d = L.d;
          const n3 = L.nx * 3;
          const dx = (1 - w) * ((1 - u2) * d[k * 3] + u2 * d[k * 3 + 3]) + w * ((1 - u2) * d[k * 3 + n3] + u2 * d[k * 3 + n3 + 3]);
          const dy = (1 - w) * ((1 - u2) * d[k * 3 + 1] + u2 * d[k * 3 + 4]) + w * ((1 - u2) * d[k * 3 + n3 + 1] + u2 * d[k * 3 + n3 + 4]);
          qx = (x - dx) / sc;
          qy = (y - dy) / sc;
        }
      }
      clothOut[0] = qx;
      clothOut[1] = qy;
      return clothOut;
    };
    const tick = (now) => {
      raf = 0;
      if (!running) return;
      if (lastRaf) {
        gaps[gapN % gaps.length] = now - lastRaf;
        gapN++;
      }
      lastRaf = now;
      tickCount++;
      const period = gapN >= 5 ? median(gaps, gapN) : 16.7;
      const every = Math.max(1, Math.floor(16.7 / Math.max(period, 1) + 0.1)) * (state.idle ? state.idleDiv : 1);
      state.expectMs = 16.7 * (state.idle ? state.idleDiv : 1);
      if (tickCount % every !== 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const mode = frame(now);
      state.idle = mode === 2;
      if (mode) raf = requestAnimationFrame(tick);
      else {
        running = false;
        lastRaf = 0;
        gapN = 0;
      }
    };
    const frame = (now) => {
      const g = gl;
      if (!g || g.isContextLost()) return 0;
      if (!finishCompile()) return state.lost ? 0 : 1;
      const L0 = live.current;
      const c = L0.cfg;
      const W2 = L0.w;
      const H2 = L0.h;
      const Su = fitRef.current ? REF_H : Math.min(H2, W2 / REF_ASPECT);
      const uu = Su / REF_H;
      const bhPx = c.bhRef * uu;
      const bwPx = c.bwRef * uu;
      const hw = c.bwRef / c.bhRef / 2;
      const rr = c.rRef / c.bhRef;
      const mPx = MARGIN * bhPx;
      const cssW = bwPx + 2 * mPx;
      const cssH = bhPx + 2 * mPx;
      const dt = last ? Math.min(0.1, (now - last) / 1e3) : 1 / 60;
      last = now;
      if (state.shownDirty || drawnFrames % 30 === 0) {
        state.shownDirty = false;
        const r = root.getBoundingClientRect();
        state.shown = W2 > 0 ? r.width / W2 : 1;
      }
      const pl0 = c.pl;
      const P = PERSPECTIVE * uu;
      if (pt.has && pt.dirty) {
        pt.dirty = false;
        const r = root.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          const lx = (pt.x - r.left) / r.width * W2;
          const ly = (pt.y - r.top) / r.height * H2;
          const X = lx - (W2 / 2 + pl0.x / 100 * W2);
          const Y = ly - (H2 / 2 + pl0.y / 100 * H2);
          const t = clamp(pl0.tilt, -89, 89) * Math.PI / 180;
          const ct = Math.cos(t);
          const st = Math.sin(t);
          const yr = Y / Math.max(1e-3, ct + Y * st / P);
          const xr = X * (1 - yr * st / P);
          const a2 = pl0.angle * Math.PI / 180;
          const ca = Math.cos(a2);
          const sa = Math.sin(a2);
          pt.bx = (xr * ca + yr * sa) / bhPx;
          pt.by = (-xr * sa + yr * ca) / bhPx;
        }
      }
      const inside = (x, y) => {
        const qx = Math.abs(x) - hw + rr;
        const qy = Math.abs(y) - 0.5 + rr;
        return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - rr;
      };
      const reach = clamp(c.rs.reach, 0, 10) * 0.03;
      let target = 0;
      let tx = state.cx;
      let ty = state.cy;
      if (pt.has) {
        const sdp = inside(...clothPoint(pt.bx, pt.by));
        target = sdp <= reach + (state.hovTarget > 0 ? HOVER_HYST : 0) ? 1 : 0;
        tx = pt.bx;
        ty = pt.by;
      } else if (pt.focus) {
        target = 1;
        tx = 0;
        ty = 0;
      }
      state.hovTarget = target;
      const pressing = pt.down && pt.has && target > 0 || now < pulseUntil;
      const wantCursor = target > 0 && pt.has ? "pointer" : "";
      if (root.style.cursor !== wantCursor) root.style.cursor = wantCursor;
      state.pressTarget = pressing ? 1 : 0;
      state.acc = Math.min(state.acc + dt, 0.1);
      while (state.acc >= STEP) {
        state.acc -= STEP;
        if (state.hovTarget > state.hov) {
          state.hov += (state.hovTarget - state.hov) * (1 - Math.exp(-STEP / 0.05));
          state.relT = -1;
        } else if (state.hov > 0) {
          if (state.relT < 0) {
            state.relT = 0;
            state.relFrom = state.hov;
          }
          state.relT += STEP;
          const u2 = Math.min(1, state.relT / Math.max(0.05, c.rs.release));
          state.hov = state.relFrom * (1 - u2 * u2 * (3 - 2 * u2));
        }
        if (state.hovTarget > 0) state.dwell += (state.hov - state.dwell) * (1 - Math.exp(-STEP / DWELL_TAU));
        state.dwell = Math.min(state.dwell, state.hov);
        const kc = 1 - Math.exp(-STEP / 0.05);
        const ncx = state.cx + (tx - state.cx) * kc;
        const ncy = state.cy + (ty - state.cy) * kc;
        const kv = 1 - Math.exp(-STEP / 0.06);
        state.pvx += ((ncx - state.cx) / STEP - state.pvx) * kv;
        state.pvy += ((ncy - state.cy) / STEP - state.pvy) * kv;
        state.cx = ncx;
        state.cy = ncy;
        const wp = 2 * Math.PI * (state.pressTarget > state.press ? 6 : 3.2);
        const zp = Math.min(1, 0.55 * dampScale());
        state.pressV += (wp * wp * (state.pressTarget - state.press) - 2 * zp * wp * state.pressV) * STEP;
        state.press += state.pressV * STEP;
        const puff = clamp(c.rs.puff, 0, 10) / 5;
        const it = ((1 - DWELL_SHARE) * state.hov + DWELL_SHARE * state.dwell) * puff - state.press * 0.35 * (clamp(c.rs.press, 0, 10) / 5);
        const wi = INF_W;
        state.infV += (wi * wi * (it - state.inf) - 2 * wi * dampScale() * state.infV) * STEP;
        state.inf += state.infV * STEP;
        const act = Math.min(1, Math.max(state.hov, Math.abs(state.inf)));
        state.act = act;
        const swayRate = reduced ? 0 : clamp(c.sway, 0, 10) / 5 * (SWAY_RATE + SWAY_RATE_ACTIVE * act);
        state.phase = (state.phase + swayRate * STEP) % (Math.PI * 2);
        if (lattice) stepLattice(lattice);
      }
      const lk = `${hw.toFixed(4)}|${rr.toFixed(4)}`;
      if (!lattice || lattice.key !== lk) {
        lattice = makeLattice(hw, rr);
        lattice.key = lk;
      }
      const L = lattice;
      const tolD = 0.25 / Math.max(bhPx, 1);
      const tolV = 0.5 / Math.max(bhPx, 1);
      let maxV = 0;
      let maxD = 0;
      let maxXY = 0;
      const n = L.nx * L.ny;
      for (let k = 0; k < n * 3; k++) {
        const a2 = Math.abs(L.v[k]);
        if (a2 > maxV) maxV = a2;
        const b = Math.abs(L.d[k]);
        if (b > maxD) maxD = b;
        if (k % 3 !== 2 && b > maxXY) maxXY = b;
      }
      let maxB = 0;
      for (let k = 0; k < n; k++) {
        const b = Math.abs(L.bx[k]) + Math.abs(L.by[k]);
        if (b > maxB) maxB = b;
      }
      const springsQuiet = Math.abs(state.hov - state.hovTarget) < 1e-3 && Math.abs(state.press - state.pressTarget) < 2e-3 && Math.abs(state.pressV) < 0.01 && Math.abs(state.infV) < 0.01 && Math.abs(state.pvx) + Math.abs(state.pvy) < 0.01;
      const latticeQuiet = maxV < tolV && maxB < 0.01;
      let settled = springsQuiet && latticeQuiet;
      if (settled && state.hovTarget === 0 && state.pressTarget === 0) {
        if (maxD < tolD * 4 && Math.abs(state.inf) < 4e-3) {
          L.d.fill(0);
          L.v.fill(0);
          L.bx.fill(0);
          L.by.fill(0);
          maxB = 0;
          maxD = 0;
          maxXY = 0;
          state.inf = 0;
          state.infV = 0;
          state.press = 0;
          state.pressV = 0;
          state.hov = 0;
        } else settled = false;
      }
      const deformed = maxD > 1e-6;
      const brushed = maxB > 1e-4;
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const shown = clamp(state.shown, 1, 2);
      let scale = Math.min(MAX_DPR, dpr * shown) * state.quality;
      const cap = Math.sqrt(PIXEL_CAP / Math.max(1, cssW * cssH));
      scale = Math.max(1, Math.min(scale, cap));
      const pw = Math.max(1, Math.round(cssW * scale));
      const ph = Math.max(1, Math.round(cssH * scale));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      g.viewport(0, 0, pw, ph);
      const ck = `${c.furColor}|${c.textColor}`;
      if (ck !== state.colorKey) {
        state.colorKey = ck;
        const f = resolveRGB(root, c.furColor).map(srgbToLin);
        const t = resolveRGB(root, c.textColor).map(srgbToLin);
        state.fur = f;
        state.ink = t;
        const mx = Math.max(f[0], f[1], f[2], 1e-4);
        state.tip = c.tipColor ? resolveRGB(root, c.tipColor).map(srgbToLin) : [f[0] / mx * 0.55 + 0.1, f[1] / mx * 0.9 + 0.12, f[2] / mx * 0.9 + 0.1];
        state.root = c.rootColor ? resolveRGB(root, c.rootColor).map(srgbToLin) : f.map((v) => v * 0.68);
      }
      drawLabel(bwPx, bhPx, Math.min(3, scale * 1.25));
      const Lt = L.tex;
      const Lg = L.grad;
      const hx = L.spanX / (L.nx - 1);
      const hy = L.spanY / (L.ny - 1);
      const D3 = L.d;
      const Lb = L.brush;
      for (let j = 0; j < L.ny; j++) {
        for (let i = 0; i < L.nx; i++) {
          const k = j * L.nx + i;
          const il = i > 0 ? k - 1 : k;
          const ir = i < L.nx - 1 ? k + 1 : k;
          const ju = j > 0 ? k - L.nx : k;
          const jd = j < L.ny - 1 ? k + L.nx : k;
          const sx = 1 / (hx * (ir - il || 1));
          const sy = 1 / (hy * ((jd - ju) / L.nx || 1));
          const exx = (D3[ir * 3] - D3[il * 3]) * sx;
          const eyy = (D3[jd * 3 + 1] - D3[ju * 3 + 1]) * sy;
          const exy = 0.5 * ((D3[jd * 3] - D3[ju * 3]) * sy + (D3[ir * 3 + 1] - D3[il * 3 + 1]) * sx);
          const dz = D3[k * 3 + 2];
          Lt[k * 4] = D3[k * 3];
          Lt[k * 4 + 1] = D3[k * 3 + 1];
          Lt[k * 4 + 2] = dz;
          Lt[k * 4 + 3] = Math.min(1, 2.6 * Math.sqrt(exx * exx + eyy * eyy + 2 * exy * exy) + 2.2 * Math.abs(dz));
          Lg[k * 2] = (D3[ir * 3 + 2] - D3[il * 3 + 2]) * sx;
          Lg[k * 2 + 1] = (D3[jd * 3 + 2] - D3[ju * 3 + 2]) * sy;
          Lb[k * 2] = L.bx[k];
          Lb[k * 2 + 1] = L.by[k];
        }
      }
      g.activeTexture(g.TEXTURE0);
      g.bindTexture(g.TEXTURE_2D, texGrid);
      const gd = `${L.nx}x${L.ny}`;
      if (gd !== gridDims) {
        gridDims = gd;
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA16F, L.nx, L.ny, 0, g.RGBA, g.FLOAT, Lt);
        g.activeTexture(g.TEXTURE4);
        g.bindTexture(g.TEXTURE_2D, texGrad);
        g.texImage2D(g.TEXTURE_2D, 0, g.RG16F, L.nx, L.ny, 0, g.RG, g.FLOAT, Lg);
        g.activeTexture(g.TEXTURE1);
        g.bindTexture(g.TEXTURE_2D, texBrush);
        g.texImage2D(g.TEXTURE_2D, 0, g.RG16F, L.nx, L.ny, 0, g.RG, g.FLOAT, Lb);
      } else if (deformed || brushed || !settled) {
        g.activeTexture(g.TEXTURE1);
        g.bindTexture(g.TEXTURE_2D, texBrush);
        g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, L.nx, L.ny, g.RG, g.FLOAT, Lb);
        g.activeTexture(g.TEXTURE0);
        g.bindTexture(g.TEXTURE_2D, texGrid);
        g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, L.nx, L.ny, g.RGBA, g.FLOAT, Lt);
        g.activeTexture(g.TEXTURE4);
        g.bindTexture(g.TEXTURE_2D, texGrad);
        g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, L.nx, L.ny, g.RG, g.FLOAT, Lg);
      }
      g.activeTexture(g.TEXTURE4);
      g.bindTexture(g.TEXTURE_2D, texGrad);
      g.activeTexture(g.TEXTURE1);
      g.bindTexture(g.TEXTURE_2D, texBrush);
      g.activeTexture(g.TEXTURE2);
      g.bindTexture(g.TEXTURE_2D, texNoise);
      g.activeTexture(g.TEXTURE3);
      g.bindTexture(g.TEXTURE_2D, texLabel);
      const a = c.adv;
      const upp = 1 / (bhPx * scale);
      setU("uCanvas", pw, ph);
      setU("uOrigin", -cssW / 2 / bhPx, -cssH / 2 / bhPx);
      setU("uUpp", upp);
      setU("uUcss", 1 / bhPx);
      setU("uHalf", hw, 0.5);
      setU("uRad", rr);
      setU("uGrid", L.ox, L.oy, L.spanX, L.spanY);
      setU("uDeform", deformed ? Math.max(maxXY * 1.42, 1e-5) : 0);
      setU("uInflate", REST_PUFF + Math.max(-0.5, state.inf));
      setU("uPhase", state.phase);
      setU("uActive", state.act);
      setU("uScale", 1 + HOVER_GROW * state.inf - PRESS_SQUASH * Math.max(0, state.press) * (clamp(c.rs.press, 0, 10) / 5));
      setU("uFur", state.fur[0], state.fur[1], state.fur[2]);
      setU("uTip", state.tip[0], state.tip[1], state.tip[2]);
      setU("uRoot", state.root[0], state.root[1], state.root[2]);
      setU("uInk", state.ink[0], state.ink[1], state.ink[2]);
      setU("uInkOn", c.lines.length ? 1 : 0);
      const la = (a.lightAngle - pl0.angle) * Math.PI / 180;
      const le = clamp(a.lightHeight, 1, 89) * Math.PI / 180;
      setU("uLight", Math.sin(la) * Math.cos(le), -Math.cos(la) * Math.cos(le), Math.sin(le));
      const lockLen = LOCK_LEN0 + LOCK_LEN1 * clamp(c.furLength, 1, 10);
      const lockCell = Math.max(0.02, a.lockSize / 100, lockLen / 3);
      setU("uLock", lockCell, lockLen, a.swirl / 100 * SWIRL_AMP, Math.max(0, a.strands) / 100);
      setU("uLook", a.sheen / 100, a.tipLight / 100, Math.max(0, a.flyaways) / 100, (SWAY_REST + SWAY_ACTIVE * state.act) * (reduced ? 0 : Math.min(1, clamp(c.sway, 0, 10) / 5)));
      setU("uGround", a.shadow / 100, a.glow / 100);
      g.drawArrays(g.TRIANGLES, 0, 3);
      drawnFrames++;
      onFrameRef.current?.(canvas, { settled: settled && !pt.has && !pt.down, over: pt.has, image: "ok", cssW: canvas.clientWidth, cssH: canvas.clientHeight });
      const creeping = settled && !reduced && c.sway > 0 && state.act <= 0.05;
      lates[lateN % lates.length] = dt * 1e3 / Math.max(8, state.expectMs);
      lateN++;
      if (lateN > 30 && (!settled || creeping)) {
        const med = median(lates, lateN);
        if (creeping && med > 1.4 && state.idleDiv < IDLE_DIVISOR_MAX) {
          state.idleDiv++;
          lateN = 0;
        } else if (med > (creeping ? 1.1 : 1.55)) {
          slowFrames++;
          fastFrames = 0;
          if (slowFrames > 20 && state.quality > QUALITY_FLOOR) {
            state.quality = Math.max(QUALITY_FLOOR, state.quality * 0.85);
            slowFrames = 0;
            if (drawnFrames - state.lastRaiseAt < 120) state.raiseLocked = true;
          }
        } else if (med < 1.14) {
          fastFrames++;
          slowFrames = 0;
          if (fastFrames > 120 && state.quality < 1 && !state.raiseLocked) {
            state.quality = Math.min(1, state.quality / 0.85);
            state.lastRaiseAt = drawnFrames;
            fastFrames = 0;
          }
        }
      }
      if (!settled) return 1;
      if (reduced || c.sway <= 0) return 0;
      return state.act > 0.05 ? 1 : 2;
    };
    wake();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mq?.removeEventListener?.("change", onMq);
      document.removeEventListener("visibilitychange", onVis);
      document.fonts?.removeEventListener?.("loadingdone", onFontsDone);
      hitEl.removeEventListener("pointermove", onMove);
      hitEl.removeEventListener("pointerdown", onDown);
      hitEl.removeEventListener("pointerup", onUp);
      hitEl.removeEventListener("pointercancel", onLeave);
      hitEl.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("click", onRootClick);
      window.removeEventListener("scroll", onScroll, { capture: true });
      btn?.removeEventListener("focus", onFocus);
      btn?.removeEventListener("blur", onBlur);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      wakeRef.current = () => {
      };
      const g = gl;
      if (g && !g.isContextLost()) {
        g.deleteTexture(texGrid);
        g.deleteTexture(texGrad);
        g.deleteTexture(texBrush);
        g.deleteTexture(texNoise);
        g.deleteTexture(texLabel);
        g.deleteProgram(prog);
        setTimeout(() => { if (!canvas.isConnected) g.getExtension("WEBGL_lose_context")?.loseContext(); }, 0);
        g.deleteShader(vs);
        g.deleteShader(fs);
      }
    };
  }, []);
  const W = size.w;
  const H = size.h;
  const p = pl;
  const stageTransform = `translate(${(p.x / 100 * W).toFixed(2)}px, ${(p.y / 100 * H).toFixed(2)}px) perspective(${(PERSPECTIVE * u).toFixed(1)}px) rotateX(${clamp(p.tilt, -89, 89)}deg) rotate(${p.angle}deg)`;
  const label = lines.join(" ") || "Button";
  const hitStyle = {
    position: "absolute",
    left: m,
    top: m,
    width: bw,
    height: bh,
    borderRadius: rRef * u,
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    outlineOffset: 4,
    WebkitTapHighlightColor: "transparent",
    display: "block",
    // Fallback when WebGL2 is unavailable: a flat fur-coloured pill.
    ...fallback ? {
      background: furColor,
      color: textColor,
      font: fontCss(font, Math.min(labelSizeRef(font) * u, bh * TEXT_MAX_H)),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none"
    } : null
  };
  const press = () => {
    pressRef.current();
    onClick?.();
  };
  const href = link.trim();
  const ext = href ? isExternal(href) : false;
  return <div
    ref={rootRef}
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
      aspectRatio: `${REF_W} / ${REF_H}`,
      overflow: "hidden",
      background: "transparent",
      touchAction: "pan-y",
      pointerEvents: hitRef ? "none" : void 0,
      ...style
    }}
  ><div
    ref={stageRef}
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: cw,
      height: ch,
      marginLeft: -cw / 2,
      marginTop: -ch / 2,
      transform: stageTransform,
      pointerEvents: "none"
    }}
  ><canvas
    ref={canvasRef}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: fallback ? "none" : "block" }}
  />{hitRef ? null : href ? <a
    data-mc-hit=""
    href={href}
    target={ext ? "_blank" : void 0}
    rel={ext ? "noopener noreferrer" : void 0}
    aria-label={label}
    onClick={press}
    style={{ ...hitStyle, pointerEvents: "auto" }}
  >{fallback ? label : null}</a> : <button data-mc-hit="" type="button" aria-label={label} onClick={press} style={{ ...hitStyle, pointerEvents: "auto" }}>{fallback ? label : null}</button>}</div></div>;
}
const __originkitPresetProps = {
  "font": {
    "fontFamily": "Plus Jakarta Sans",
    "variant": "Regular",
    "fontWeight": 800,
    "fontSize": "56px",
    "lineHeight": "1.5em",
    "letterSpacing": "0em",
    "textAlign": "left"
  },
  "placement": {
    "x": 0,
    "y": 0,
    "angle": 0,
    "tilt": 0
  },
  "response": {
    "reach": 0,
    "puff": 5,
    "bulge": 5,
    "press": 5,
    "wobble": 5,
    "drag": 5,
    "brush": 5,
    "release": 0.7
  },
  "advanced": {
    "lockSize": 5,
    "swirl": 70,
    "strands": 100,
    "flyaways": 6,
    "sheen": 100,
    "tipLight": 100,
    "lightAngle": -40,
    "lightHeight": 45,
    "shadow": 40,
    "glow": 35
  }
};
export default function MohairCapsuleCanvas(props) {
  return <__OriginkitBase_MohairCapsule {...__originkitPresetProps} {...props} />;
}
