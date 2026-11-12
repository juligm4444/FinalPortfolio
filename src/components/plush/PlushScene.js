/* Plush Tile — scene. Adapted from vendor/originkit/PlushTile.tsx (kept unmodified).

   Not a plush toy any more: short moss (and, around the Herbario's slabs, taller
   grass) that grows over a stone tile. Differences from the original:
   - One canvas for the whole site. It is moved into whichever tile is active
     (the dock's, the Herbario's); a tile at rest is plain stone with its logo
     engraved in SVG, no WebGL. PlushHost (host.js) owns the lifecycle.
   - Fur is no longer an upholstered cushion over a red studio. There is no
     studio, wall, floor or shadow pass: the canvas is transparent and only the
     hairs (and the dark skin under the moss) are drawn, over the page.
   - The artwork texture is generated here from the tokens: its colour is moss
     (--moss-700 → --moss-400, a few --mist glints) and its ALPHA is where the
     moss grows (edges inward, so the engraved logo stays readable). The prep
     pass thins hair roots by that alpha.
   - Short, matte, dense: length is set in CSS px, lighting is the page's own
     (--mist key, --moss-400 bounce), sheen and crimp are low, no tilt or
     parallax (the fur must stay registered to the stone below).
   - Growth is driven by the host (grow on activate, retract on leave) instead of
     a one-off entrance; the loop stops entirely once the fur is gone.
   - No image loading, no Framer props, no hex: every colour is read from the
     CSS tokens. The context is released explicitly on dispose. */

// Canvas room around the tile, as a share of the tile, on every side. The slot in
// PlushTile.css is inset by the same amount (-40%).
export const MARGIN = 0.4
const TILE_FRAC = 1 / (1 + 2 * MARGIN) // tile half-extent in the frame's units

const D2R = Math.PI / 180
// Strands per square CSS pixel of tile at density 1.
const STRANDS_PER_PX = 0.5
const MAX_STRANDS = 60000
// Segments per hair, drawn as two half-strands so every tip lands over every root.
const SEG = 4
const HALF_SEG = SEG / 2
const GRID = 24
const ART = 256
const FLOW = 64
const PIXEL_BUDGET = 1_200_000

/** What each use looks like. Lengths are CSS px so a 48px dock tile and a 160px slab both read. */
const MODES = {
    // Dock: a short dense moss skin creeping in from the edges.
    moss: { dens: 3.0, lenPx: 3.4, lift: 7, frizz: 3, rimShare: 0.2, width: 1.0, clump: 0.2, edge: 5.2, floor: 0.1 },
    // Herbario: grass standing round the slab, little on the slab itself.
    grass: { dens: 1.4, lenPx: 14, lift: 6, frizz: 4, rimShare: 0.6, width: 1.1, clump: 0.3, edge: 9.0, floor: 0.01 },
}
const LOOK = {
    corner: 0.08, // matches --radius-slab on a small tile
    puff: 1.5,
    lens: 20,
    lightAngle: 100,
    lightHeight: 40,
    keyFalloff: 75,
    sheen: 0.1,
    crimp: 0.1,
    rootShade: 0.5,
    depthShade: 0.45,
    undercoat: 0.4,
    rimLight: 0.5,
    colorJitter: 0.3,
    tipFade: 0.2,
    bounce: 0.35,
    breeze: 0.2,
    reach: 8,
    strength: 1.4,
}

const lin = (c) => Math.pow(c, 2.2)

/** A design token as sRGB 0–1, resolved by the browser (works for any colour syntax). */
function tokenRGB(name) {
    const el = document.createElement("span")
    el.style.display = "none"
    el.style.color = `var(${name})`
    document.body.appendChild(el)
    const m = getComputedStyle(el).color.match(/[\d.]+/g)
    el.remove()
    if (!m || m.length < 3) return [0.5, 0.5, 0.5]
    return [+m[0] / 255, +m[1] / 255, +m[2] / 255]
}

// ── CPU textures ──

function hash2(x, y, s) {
    let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 982451653)) | 0
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
function vnoise(x, y, s) {
    const i = Math.floor(x)
    const j = Math.floor(y)
    const fx = x - i
    const fy = y - j
    const u = fx * fx * (3 - 2 * fx)
    const v = fy * fy * (3 - 2 * fy)
    const a = hash2(i, j, s)
    const b = hash2(i + 1, j, s)
    const c = hash2(i, j + 1, s)
    const d = hash2(i + 1, j + 1, s)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const fbm = (x, y, s) => 0.55 * vnoise(x, y, s) + 0.3 * vnoise(x * 2.1, y * 2.1, s + 1) + 0.15 * vnoise(x * 4.3, y * 4.3, s + 2)

/**
 * Albedo (moss) in RGB and coverage (where it grows) in alpha, as raw bytes: going
 * through a 2D canvas would premultiply and wreck the colour wherever coverage is low.
 */
function buildArt(mode, seed, tok) {
    const M = MODES[mode]
    const out = new Uint8Array(ART * ART * 4)
    const [dr, dg, db] = tok.moss700
    const [lr, lg, lb] = tok.moss400
    const [mr, mg, mb] = tok.mist
    const s = seed * 17 + 3
    for (let y = 0; y < ART; y++) {
        for (let x = 0; x < ART; x++) {
            const u = ((x + 0.5) / ART) * 2 - 1
            const v = ((y + 0.5) / ART) * 2 - 1
            const t = 1 - Math.max(Math.abs(u), Math.abs(v)) // 0 at the edge, 1 at the centre
            const n = fbm(u * 3 + 11, v * 3 - 7, s)
            const n2 = fbm(u * 7 - 3, v * 7 + 5, s + 5)
            const n3 = vnoise(u * 19, v * 19, s + 9)
            let cov = (0.97 * Math.exp(-t * M.edge) + M.floor) * (0.4 + 1.2 * n)
            cov = Math.max(0, Math.min(1, cov))
            let k = Math.max(0, Math.min(1, 0.15 + 0.9 * n2))
            let r = dr + (lr - dr) * k
            let g = dg + (lg - dg) * k
            let b = db + (lb - db) * k
            if (n3 > 0.8) {
                // A few pale glints where the moss is dry.
                const w = Math.min(0.35, (n3 - 0.8) * 2.2)
                r += (mr - r) * w
                g += (mg - g) * w
                b += (mb - b) * w
            }
            const i = (y * ART + x) * 4
            out[i] = Math.round(r * 255)
            out[i + 1] = Math.round(g * 255)
            out[i + 2] = Math.round(b * 255)
            out[i + 3] = Math.round(cov * 255)
        }
    }
    return out
}

/** Hair lies combed outward from the centre with a little gravity (the original's flat-art whorl). */
function buildFlow() {
    const n = FLOW
    const out = new Uint8Array(n * n * 4)
    for (let y = 0; y < n; y++)
        for (let x = 0; x < n; x++) {
            const cx = (x + 0.5) / n - 0.5
            const cy = (y + 0.5) / n - 0.5
            const rl = Math.hypot(cx, cy) + 1e-6
            const k = Math.min(1, rl * 5) / rl
            let bx = cx * k
            let by = cy * k + 0.1 + 0.9 * Math.max(0, 1 - rl * 4)
            const bl = Math.hypot(bx, by) + 1e-6
            bx /= bl
            by /= bl
            const i = (y * n + x) * 4
            out[i] = Math.round((bx * 0.5 + 0.5) * 255)
            out[i + 1] = Math.round((by * 0.5 + 0.5) * 255)
            out[i + 2] = 0 // no appliqué relief: the stone is flat
            out[i + 3] = Math.round(Math.min(1, bl / 0.6) * 255)
        }
    return out
}

// ── shaders ──

const COMMON = /* glsl */ `
uniform vec2 uHalf;
uniform float uCorner, uBevel, uDome;
uniform mat3 uRot;
uniform float uCam;
uniform vec2 uFrame, uRollCS, uOff;

// Signed distance to the rounded-square footprint, and its gradient.
float sdTile(vec2 p, out vec2 g) {
    vec2 sp = vec2(p.x < 0.0 ? -1.0 : 1.0, p.y < 0.0 ? -1.0 : 1.0);
    vec2 q = abs(p) - uHalf + uCorner;
    if (q.x > 0.0 && q.y > 0.0) { float l = length(q); g = q / l * sp; return l - uCorner; }
    g = q.x > q.y ? vec2(sp.x, 0.0) : vec2(0.0, sp.y);
    return max(q.x, q.y) - uCorner;
}
// Cushion: round bevel off the footprint edge plus a shallow dome.
vec3 surf(vec2 p, out vec3 n) {
    vec2 g; float d = sdTile(p, g);
    float e = max(-d, 0.0);
    float q = clamp(e / uBevel, 0.02, 1.0);
    float r = 1.0 - q;
    float rr = sqrt(1.0 - r * r);
    float z = uBevel * rr;
    float dz = r / rr;
    float span = min(uHalf.x, uHalf.y);
    float c = clamp(e / span, 0.0, 1.0);
    z += uDome * (1.0 - (1.0 - c) * (1.0 - c));
    dz += uDome * 2.0 * (1.0 - c) / span;
    n = normalize(vec3(g * dz, 1.0));
    return vec3(p, z);
}
// Tile-local point → NDC: turn, perspective, roll about the content centre, then offset.
vec2 toNdc(vec3 local) {
    vec3 w = uRot * local;
    vec2 xy = w.xy * (uCam / (uCam - w.z));
    xy = vec2(uRollCS.x * xy.x + uRollCS.y * xy.y, -uRollCS.y * xy.x + uRollCS.x * xy.y);
    return xy / uFrame + uOff;
}
vec3 toSrgb(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }
`

const SHADE = /* glsl */ `
uniform sampler2D uArt;  // sRGB texture: samples arrive linear
uniform vec3 uLight, uBounceC, uKeyC;
uniform vec2 uDown;
uniform float uKeyLow, uKey, uFade;
float keyGrad(vec3 P0) {
    // Softbox above the tile: brighter toward the light's side of the tile.
    vec2 ld = uLight.xy;
    float l = length(ld);
    float k = l > 1e-3 ? dot((uRot * P0).xy, ld / l) / max(uHalf.x, uHalf.y) : 0.0;
    // The cushion's lower roll sits in its own shadow above the floor.
    return mix(uKeyLow, 1.0, smoothstep(-1.15, 0.7, k)) * mix(0.5, 1.0, smoothstep(-1.1, -0.7, k));
}
vec2 artUv(vec2 p) { return vec2(p.x / uHalf.x, -p.y / uHalf.y) * 0.5 + 0.5; }
`

const UNDER_VERT = /* glsl */ `#version 300 es
precision highp float;
${COMMON}
${SHADE}
uniform float uUnder;
out vec2 vP;
out vec3 vCol;
out float vCov;
const int G = ${GRID};
void main() {
    int cell = gl_VertexID / 6;
    int k = gl_VertexID % 6;
    ivec2 off = k == 0 ? ivec2(0, 0) : k == 1 || k == 4 ? ivec2(1, 0) : k == 2 || k == 3 ? ivec2(0, 1) : ivec2(1, 1);
    vec2 g = vec2(ivec2(cell % G, cell / G) + off) / float(G);
    vec2 p = (g * 2.0 - 1.0) * uHalf;
    vec3 N;
    vec3 P = surf(p, N);
    vec3 Nw = normalize(uRot * N);
    vec4 art = texture(uArt, artUv(p));
    vec3 alb = art.rgb;
    vCov = art.a; // the moss only skins where it grows: the stone shows elsewhere
    float lam = max(dot(Nw, uLight), 0.0) * 0.75 + 0.25;
    vCol = alb * uUnder * vec3(1.0, 0.85, 0.7) * (uKeyC * lam * keyGrad(P) * uKey + uBounceC * max(dot(Nw.xy, uDown), 0.0) * 0.5);
    vP = p;
    gl_Position = vec4(toNdc(P), 0.0, 1.0);
}`

const UNDER_FRAG = /* glsl */ `#version 300 es
precision highp float;
${COMMON}
uniform float uPx;
uniform float uFade;
in vec2 vP;
in vec3 vCol;
in float vCov;
out vec4 o;
void main() {
    vec2 g;
    // Slightly inside the footprint, so the rim's hair halo covers its edge.
    float d = sdTile(vP, g) + 0.012 * min(uHalf.x, uHalf.y);
    float a = (1.0 - smoothstep(-uPx, uPx, d)) * uFade * vCov;
    o = vec4(toSrgb(vCol) * a, a);
}`

const HASH = /* glsl */ `
uint hashu(uint x) { x ^= x >> 16; x *= 0x7feb352du; x ^= x >> 15; x *= 0x846ca68bu; x ^= x >> 16; return x; }
float h01(uint x) { return float(hashu(x) >> 8) * (1.0 / 16777216.0); }
`

/**
 * Per-hair setup, run once per change through transform feedback (in a unit
 * tile, so the entrance and Scale only rescale it): root, surface frame, lie
 * direction, tuft pull. The per-frame strand shader just reads it back.
 */
const PREP_VERT = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
${COMMON}
${HASH}
uniform sampler2D uFlow;
uniform sampler2D uArt;  // alpha = where the moss grows
uniform float uLift, uSpread, uClump, uCs, uRimFrac, uEmboss;
uniform uint uSeed;
out vec4 oA; // root, crimp phase
out vec4 oB; // normal, lift
out vec4 oC; // lie direction, tuft brightness
out vec4 oD; // tuft pull, length factor (0 = no hair)
void main() {
    uint id = uint(gl_VertexID);
    uint hb = hashu(id + uSeed * 7919u) * 16u;
    float h0 = h01(hb), h1 = h01(hb + 1u), h2 = h01(hb + 2u), h3 = h01(hb + 3u);
    float h4 = h01(hb + 4u), h5 = h01(hb + 5u), h7 = h01(hb + 7u);
    vec2 g;
    vec2 p;
    float alive = 1.0;
    bool rim = h0 < uRimFrac;
    if (rim) {
        // Rim roots: march from the centre out to the edge along a random heading,
        // then sink a little way in, so the halo rings the whole silhouette.
        float an = h1 * 6.2831853;
        vec2 dir = vec2(cos(an), sin(an));
        float t = 0.0;
        for (int i = 0; i < 6; i++) t -= sdTile(dir * t, g);
        p = dir * t;
        sdTile(p, g);
        p -= g * (h2 * h2 * 0.45 * uBevel);
    } else {
        // Interior roots on the R2 low-discrepancy sequence: even cover at any count,
        // and a lower Density is a prefix of a higher one.
        uint k = id + uSeed * 100003u;
        vec2 r2 = vec2(float(k * 3242174889u + 2147483648u), float(k * 2447445414u + 2147483648u)) * (1.0 / 4294967296.0);
        p = (r2 * 2.0 - 1.0) * uHalf;
        if (sdTile(p, g) > 0.0) alive = 0.0;
        // Moss grows from the edges inward: thin the roots by the coverage map.
        vec2 uv0 = vec2(p.x / uHalf.x, -p.y / uHalf.y) * 0.5 + 0.5;
        if (h01(hb + 6u) > texture(uArt, uv0).a) alive = 0.0;
    }
    vec3 N;
    vec3 P0 = surf(p, N);
    vec2 uv = vec2(p.x / uHalf.x, -p.y / uHalf.y) * 0.5 + 0.5;

    // Appliqué: the artwork's pile stands proud of the base fur, so its upper
    // edges catch the softbox and its lower edges fall into shade.
    const float TX = 1.0 / float(${FLOW});
    float hC = texture(uFlow, uv).b;
    float hx = (texture(uFlow, uv + vec2(TX, 0.0)).b - texture(uFlow, uv - vec2(TX, 0.0)).b) / (4.0 * TX * uHalf.x);
    float hy = -(texture(uFlow, uv + vec2(0.0, TX)).b - texture(uFlow, uv - vec2(0.0, TX)).b) / (4.0 * TX * uHalf.y);
    float inside = smoothstep(0.0, uBevel, -sdTile(p, g));
    P0.z += uEmboss * hC * inside;
    N = normalize(N - vec3(hx, hy, 0.0) * uEmboss * inside);

    // Lie direction from the flow field, projected onto the surface, fanned a little.
    vec2 fl = texture(uFlow, uv).rg * 2.0 - 1.0;
    vec3 t3 = vec3(fl.x, -fl.y, 0.0);
    vec3 T = t3 - N * dot(t3, N);
    float tl = length(T);
    T = tl > 0.05 ? T / tl : normalize(cross(N, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
    float fan = (h3 - 0.5) * uSpread;
    T = T * cos(fan) + cross(N, T) * sin(fan);

    // Tufts: hairs gather toward the nearest clump centre, so their tips meet and
    // dark partings open between clumps, as in real plush.
    vec2 ci = floor(p / uCs);
    vec2 best = p;
    float bd = 1e9;
    uint cid = 0u;
    for (int j = -1; j <= 1; j++)
        for (int i = -1; i <= 1; i++) {
            ivec2 cc = ivec2(ci) + ivec2(i, j);
            uint hh = hashu(uint(cc.x + 8192) * 73856093u ^ uint(cc.y + 8192) * 19349663u ^ (uSeed * 83492791u));
            vec2 pt = (vec2(cc) + vec2(h01(hh), h01(hh ^ 0x9e3779b9u))) * uCs;
            float d2 = dot(pt - p, pt - p);
            if (d2 < bd) { bd = d2; best = pt; cid = hh; }
        }
    vec3 pull = vec3(best - p, 0.0);
    pull = (pull - N * dot(pull, N)) * (rim ? 0.3 * uClump : uClump);
    float tuft = 1.0 + (h01(cid ^ 0x5bd1e995u) - 0.5) * 0.3;

    // At the whorl's source hair stands up in a crown instead of parting to the skin.
    float crown = mix(3.0, 1.0, texture(uFlow, uv).a);
    float lift = (rim ? max(uLift, 1.4) : uLift * crown) * (0.6 + 0.8 * h4);
    oA = vec4(P0, h7 * 6.2831853);
    oB = vec4(N, lift);
    oC = vec4(T, tuft);
    oD = vec4(pull, alive * (0.55 + 0.9 * h5));
    gl_Position = vec4(0.0);
}`

const PREP_FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 o;
void main() { o = vec4(0.0); }`

const STRAND_VERT = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
${COMMON}
${SHADE}
${HASH}
layout(location = 0) in vec4 aA;
layout(location = 1) in vec4 aB;
layout(location = 2) in vec4 aC;
layout(location = 3) in vec4 aD;
uniform vec2 uRes;
uniform vec3 uGrav;
uniform vec4 uBrush;  // local xy, radius, strength
uniform float uLen, uFrizz, uGrow, uTime, uBreeze, uWidth;
uniform float uJitter, uTipFade, uRootShade, uSheen, uRim, uCount, uDepth;
uniform uint uSeed;
uniform int uSegBase;
out vec4 vCol;
out float vDist;
out float vHalf;
out vec2 vCrimp;  // position along the hair, glint phase
const int SEG = ${SEG};

void main() {
    if (aD.w <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); vCol = vec4(0.0); vDist = 0.0; vHalf = 0.0; vCrimp = vec2(0.0); return; }
    int seg = (gl_VertexID >> 1) + uSegBase;
    float side = (gl_VertexID & 1) == 0 ? -1.0 : 1.0;
    float s = float(seg) / float(SEG);
    uint id = uint(gl_InstanceID);
    uint hb = hashu(id ^ (uSeed * 0x2545F491u) ^ 0xA511E9B3u);
    float hj = float(hb & 1023u) / 1023.0;
    float hw = float((hb >> 10) & 1023u) / 1023.0;
    float hc = float((hb >> 20) & 1023u) / 1023.0;

    float a = uHalf.x;
    vec3 P0 = aA.xyz * a;
    vec3 N = aB.xyz;
    vec3 T = aC.xyz;
    vec3 B = cross(N, T);
    float lift = aB.w;
    float ph0 = aA.w;
    float curlF = 2.0 + 4.0 * hc;
    vec3 pull = aD.xyz * a;
    // Halo hairs (lift > 1.2 marks the rim) are the short, fine fringe round the silhouette.
    bool rimHair = lift > 1.2;
    float L = uLen * aD.w * uGrow * (rimHair ? 0.75 : 1.0);

    // Finger through the fur: strands near the cursor lean away from it and flatten.
    vec2 dv = P0.xy - uBrush.xy;
    float dd = dot(dv, dv);
    float fb = uBrush.w * exp(-dd / (uBrush.z * uBrush.z));
    vec3 bp = vec3(dv * inversesqrt(dd + 1e-6), 0.0);
    bp -= N * dot(bp, N);
    vec3 D0 = normalize(N * lift * (1.0 - 0.7 * min(fb, 1.0)) + T + bp * fb * 1.5);
    vec3 bend = T * 0.6 + uGrav * (rimHair ? 0.2 : 0.35) - N * lift * 0.3 + bp * fb * 1.5;
    vec2 wv = vec2(sin(uTime * 1.7 + P0.x * 6.0 + P0.y * 2.5 + hc * 1.5), cos(uTime * 1.3 + P0.y * 5.0 - P0.x * 3.0 + hj * 2.0));
    bend += vec3(wv, 0.0) * uBreeze;

    // Position and tangent along the hair: rise, lie down along the flow, droop,
    // wander, a fine crimp, and the pull into its tuft toward the tip.
    float ph = ph0 + s * curlF;
    float k1 = uFrizz * 0.18, k2 = uFrizz * 0.08;
    vec3 cw = B * sin(ph) + N * 0.4 * cos(ph);
    float cr = ph0 * 3.0 + s * 9.0;
    vec3 curl = cw * (k1 * s) + B * (sin(cr) * k2);
    vec3 dcurl = (B * cos(ph) - N * 0.4 * sin(ph)) * (curlF * k1 * s) + cw * k1 + B * (cos(cr) * 9.0 * k2);
    float rs = sqrt(s);
    vec3 P = P0 + L * (D0 * s + bend * (0.5 * s * s) + curl) + pull * (s * rs);
    vec3 dP = L * (D0 + bend * s + dcurl) + pull * (1.5 * rs);

    vec2 ndc = toNdc(P);
    vec2 dpx = (toNdc(P + dP * 0.02) - ndc) * uRes;
    vec2 perp = normalize(vec2(-dpx.y, dpx.x) + 1e-6);
    float w = uWidth * (1.0 - 0.5 * s) * (0.8 + 0.4 * hw) * (rimHair ? 0.75 : 1.0);
    float cov = min(w, 1.0);
    w = max(w, 1.0);
    // Half a pixel past the edge is all the coverage ramp below reaches.
    float hwid = 0.5 * w + 0.6;
    vDist = side * hwid;
    vHalf = 0.5 * w;
    vCrimp = vec2(s, hc * 6.2831853);
    gl_Position = vec4(ndc + perp * (side * hwid * 2.0) / uRes, 0.0, 1.0);

    // Kajiya-Kay hair under a top softbox, floor bounce from below, backlit rim.
    // Hairs drawn later sit on top: the R2 order keeps every prefix even, so the
    // first-drawn (buried) hairs shade darker and the last-drawn catch the light.
    vec3 Nw = normalize(uRot * N);
    vec3 Tw = normalize(uRot * dP);
    float layer = mix(1.0 - uDepth, 1.0, sqrt(float(id) / uCount));
    vec3 alb = texture(uArt, artUv(P0.xy)).rgb * (1.0 + (hj - 0.5) * 2.0 * uJitter) * aC.w * layer;
    float kg = keyGrad(P0);
    float tl2 = dot(Tw, uLight);
    float kk = sqrt(max(1.0 - tl2 * tl2, 0.0));
    float lam = max(dot(Nw, uLight), 0.0) * 0.9 + 0.1;
    // Light that reaches deep into pale fur has scattered off other hairs: its roots stay
    // lighter and its shadows go amber, not grey. Dyed fur keeps its own hue.
    float pale = min(min(alb.r, alb.g), alb.b) / max(max(alb.r, alb.g), max(alb.b, 1e-4));
    float ao1 = mix(1.0 - uRootShade * (1.0 - 0.35 * pale), 1.0, smoothstep(0.0, 1.0, s));
    vec3 ao = ao1 * mix(vec3(1.0), vec3(1.12, 0.94, 0.78), (1.0 - ao1) * pale);
    vec3 H = normalize(uLight + vec3(0.0, 0.0, 1.0));
    float th = dot(Tw, H);
    float sh = max(1.0 - th * th, 0.0);
    float spec = pow(sh, 24.0) * uSheen * kg * smoothstep(0.15, 0.9, s);
    float rimL = pow(1.0 - abs(Nw.z), 2.0) * s * uRim * kg * kg;
    vec3 sheenC = mix(alb * 1.6, vec3(1.0), 0.15 + 0.85 * pale * pale);
    // Pale fur out of the key is lit by light that has passed through other hairs: amber.
    vec3 warm = mix(vec3(1.0, 0.8, 0.62), vec3(1.0), mix(1.0, smoothstep(0.08, 0.6, lam * kg), pale));
    vec3 col = alb * (uKeyC * warm * lam * (0.55 + 0.45 * kk) * kg * ao * uKey + uBounceC * max(dot(Nw.xy, uDown), 0.0) * ao + uKeyC * rimL)
             + uKeyC * (sheenC * spec + alb * pow(sh, 8.0) * uSheen * 0.35 * kg);
    float al = cov * uFade * (1.0 - uTipFade * smoothstep(0.55, 1.0, s));
    vCol = vec4(toSrgb(col) * al, al);
}`

const STRAND_FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform float uCrimpK;
in vec4 vCol;
in float vDist;
in float vHalf;
in vec2 vCrimp;
out vec4 o;
void main() {
    // Analytic coverage across the strand: smooth lines without MSAA.
    float cov = clamp(vHalf + 0.5 - abs(vDist), 0.0, 1.0);
    // A crimped fibre turns in and out of the light along its length: periodic glints,
    // far finer than the strand's own segments.
    float g = sin(vCrimp.x * 22.0 + vCrimp.y);
    float glint = 1.0 + uCrimpK * (g * g - 0.5);
    o = vec4(vCol.rgb * glint, vCol.a) * cov;
}`

// ── scene ──

export default class PlushScene {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {{ onIdle?: () => void, onLost?: () => void }} hooks
     */
    constructor(canvas, hooks = {}) {
        this.canvas = canvas
        this.hooks = hooks
        const gl = canvas.getContext("webgl2", {
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            premultipliedAlpha: true,
            powerPreference: "low-power",
            preserveDrawingBuffer: false,
        })
        if (!gl) throw new Error("PlushScene: no WebGL2")
        this.gl = gl
        this.disposed = false
        this.shaders = []
        this.programs = []

        const build = (vs, fs, varyings) => {
            const compile = (type, src) => {
                const sh = gl.createShader(type)
                gl.shaderSource(sh, src)
                gl.compileShader(sh)
                if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || "shader")
                this.shaders.push(sh)
                return sh
            }
            const p = gl.createProgram()
            gl.attachShader(p, compile(gl.VERTEX_SHADER, vs))
            gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs))
            if (varyings) gl.transformFeedbackVaryings(p, varyings, gl.INTERLEAVED_ATTRIBS)
            gl.linkProgram(p)
            if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link")
            this.programs.push(p)
            return p
        }
        this.underProg = build(UNDER_VERT, UNDER_FRAG)
        this.prepProg = build(PREP_VERT, PREP_FRAG, ["oA", "oB", "oC", "oD"])
        this.strandProg = build(STRAND_VERT, STRAND_FRAG)

        this.vao = gl.createVertexArray()
        // Per-hair records (4 × vec4), written by the prep pass, read per instance by the strands.
        this.STRIDE = 64
        this.strandBuf = gl.createBuffer()
        this.strandVao = gl.createVertexArray()
        this.tf = gl.createTransformFeedback()
        gl.bindVertexArray(this.strandVao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.strandBuf)
        for (let i = 0; i < 4; i++) {
            gl.enableVertexAttribArray(i)
            gl.vertexAttribPointer(i, 4, gl.FLOAT, false, this.STRIDE, i * 16)
            gl.vertexAttribDivisor(i, 1)
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindVertexArray(this.vao)
        this.capacity = 0
        this.prepKey = new Float64Array(10).fill(NaN)
        this.artVersion = 0

        // Uniforms upload only when their value changed.
        const makeU = (prog) => {
            const slots = new Map()
            const slot = (name) => {
                let s = slots.get(name)
                if (!s) {
                    s = { loc: gl.getUniformLocation(prog, name), v: [NaN, NaN, NaN, NaN] }
                    slots.set(name, s)
                }
                return s
            }
            const same = (s, a, b, c, d) => s.v[0] === a && s.v[1] === b && s.v[2] === c && s.v[3] === d
            const put = (s, a, b, c, d) => {
                s.v[0] = a
                s.v[1] = b
                s.v[2] = c
                s.v[3] = d
            }
            return {
                f1(n, a) { const s = slot(n); if (same(s, a, 0, 0, 0)) return; put(s, a, 0, 0, 0); gl.uniform1f(s.loc, a) },
                u1(n, a) { const s = slot(n); if (same(s, a, 0, 0, 0)) return; put(s, a, 0, 0, 0); gl.uniform1ui(s.loc, a) },
                i1(n, a) { const s = slot(n); if (same(s, a, 0, 0, 0)) return; put(s, a, 0, 0, 0); gl.uniform1i(s.loc, a) },
                f2(n, a, b) { const s = slot(n); if (same(s, a, b, 0, 0)) return; put(s, a, b, 0, 0); gl.uniform2f(s.loc, a, b) },
                f3(n, a, b, c) { const s = slot(n); if (same(s, a, b, c, 0)) return; put(s, a, b, c, 0); gl.uniform3f(s.loc, a, b, c) },
                f4(n, a, b, c, d) { const s = slot(n); if (same(s, a, b, c, d)) return; put(s, a, b, c, d); gl.uniform4f(s.loc, a, b, c, d) },
                m3(n, m) { gl.uniformMatrix3fv(slot(n).loc, false, m) },
            }
        }
        this.U_UN = makeU(this.underProg)
        this.U_ST = makeU(this.strandProg)
        this.U_PR = makeU(this.prepProg)

        // Textures: moss albedo + coverage on unit 0, flow on unit 1.
        this.artTex = gl.createTexture()
        this.flowTex = gl.createTexture()
        const setupTex = (t, unit) => {
            gl.activeTexture(gl.TEXTURE0 + unit)
            gl.bindTexture(gl.TEXTURE_2D, t)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        }
        setupTex(this.artTex, 0)
        setupTex(this.flowTex, 1)
        gl.useProgram(this.underProg)
        this.U_UN.i1("uArt", 0)
        gl.useProgram(this.strandProg)
        this.U_ST.i1("uArt", 0)
        gl.useProgram(this.prepProg)
        this.U_PR.i1("uFlow", 1)
        this.U_PR.i1("uArt", 0)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, this.flowTex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, FLOW, FLOW, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildFlow())

        // The page's own palette, read once.
        this.tok = {
            moss700: tokenRGB("--moss-700"),
            moss400: tokenRGB("--moss-400"),
            mist: tokenRGB("--mist"),
        }

        // State.
        this.slot = null
        this.mode = "moss"
        this.seed = 0
        this.artKey = ""
        this.cssW = 1
        this.g = 0 // growth, 0 bare → 1 full
        this.target = 0
        this.ptr = { u: 0.5, v: 0.5, over: false, moved: false }
        this.brush = { x: 0, y: 0, w: 0 }
        this.clock = 0
        this.last = -1
        this.scheduled = false
        this.raf = 0
        this.quality = 1
        this.frameEma = 16.7
        this.slow = 0
        this.fast = 0
        this.rot = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])

        canvas.style.position = "absolute"
        canvas.style.inset = "0"
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.style.display = "block"
        canvas.style.pointerEvents = "none"
        canvas.style.visibility = "hidden"

        this.onLost = (e) => {
            e.preventDefault()
            this.disposed = true
            cancelAnimationFrame(this.raf)
            this.hooks.onLost?.()
        }
        canvas.addEventListener("webglcontextlost", this.onLost)
        this.ro = new ResizeObserver(() => {
            this.measure()
            this.wake()
        })
        this.ro.observe(canvas)
        this.loop = this.loop.bind(this)
    }

    /** Move the canvas into `slot` and grow moss there. */
    attach(slot, mode, seed) {
        if (this.disposed) return
        const moved = slot !== this.slot
        if (moved) {
            slot.appendChild(this.canvas)
            this.slot = slot
            this.g = 0 // a new tile grows its own moss from bare stone
        }
        this.mode = MODES[mode] ? mode : "moss"
        this.seed = seed | 0
        const key = `${this.mode}|${this.seed}`
        if (key !== this.artKey) {
            this.artKey = key
            const gl = this.gl
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, this.artTex)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, ART, ART, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildArt(this.mode, this.seed, this.tok))
            this.artVersion++
        }
        this.target = 1
        this.measure()
        this.canvas.style.visibility = "visible"
        this.wake()
    }

    /** Let the moss draw back in. The canvas hides itself once it is gone. */
    detach() {
        if (this.disposed) return
        this.target = 0
        this.ptr.over = false
        this.wake()
    }

    /** Pointer position over the tile, 0–1 of the tile's box (null when it left). */
    setPointer(u, v) {
        if (u == null) {
            this.ptr.over = false
        } else {
            // Slot coordinates: the tile sits in the middle of the frame.
            this.ptr.u = 0.5 + (u - 0.5) * TILE_FRAC
            this.ptr.v = 0.5 + (v - 0.5) * TILE_FRAC
            this.ptr.over = true
            this.ptr.moved = true
        }
        this.wake()
    }

    measure() {
        const w = this.canvas.offsetWidth || this.slot?.offsetWidth || 1
        this.cssW = Math.max(1, w)
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const budget = Math.min(1, Math.sqrt(PIXEL_BUDGET / Math.max(1, this.cssW * this.cssW * dpr * dpr)))
        const k = dpr * budget * this.quality
        const px = Math.max(1, Math.round(this.cssW * k))
        if (this.canvas.width !== px) this.canvas.width = px
        if (this.canvas.height !== px) this.canvas.height = px
    }

    wake() {
        if (this.disposed || this.scheduled) return
        this.scheduled = true
        this.raf = requestAnimationFrame(this.loop)
    }

    loop(now) {
        this.scheduled = false
        if (this.disposed) return
        if (document.hidden) {
            this.last = -1
            return
        }
        const dt0 = this.last < 0 ? 0 : Math.min((now - this.last) / 1000, 1 / 20)
        const animating = this.target !== this.g
        const active = animating || this.ptr.moved || Math.abs(this.brush.w - (this.ptr.over ? LOOK.strength : 0)) > 4e-3
        // 60 fps while anything moves; 30 fps for the breeze.
        const gap = active ? 15 : 31
        if (this.last >= 0 && now - this.last < gap) {
            this.wake()
            return
        }
        if (this.last >= 0) {
            this.frameEma += (now - this.last - this.frameEma) * 0.1
            const target = gap + 2
            this.slow = this.frameEma > target * 1.45 ? this.slow + 1 : 0
            this.fast = this.frameEma < target * 1.1 ? this.fast + 1 : 0
            if (this.slow > 20 && this.quality > 0.6) {
                this.quality = Math.max(0.6, this.quality * 0.88)
                this.slow = 0
                this.measure()
            } else if (this.fast > 180 && this.quality < 1) {
                this.quality = Math.min(1, this.quality * 1.08)
                this.fast = 0
                this.measure()
            }
        }
        this.last = now
        const dt = dt0
        if (this.target > this.g) this.g = Math.min(1, this.g + dt / 0.6)
        else if (this.target < this.g) this.g = Math.max(0, this.g - dt / 0.35)
        this.clock = (this.clock + dt) % 3600

        if (this.g <= 0 && this.target === 0) {
            // Bare stone again: nothing left to draw, nothing left to schedule.
            this.canvas.style.visibility = "hidden"
            this.last = -1
            this.hooks.onIdle?.()
            return
        }

        this.draw(dt)
        this.wake() // the breeze keeps the tips stirring while the moss is out
    }

    draw(dt) {
        const gl = this.gl
        if (gl.isContextLost()) return
        const M = MODES[this.mode]
        const cssW = this.cssW
        const grow = 1 - Math.pow(1 - this.g, 3)
        const fade = Math.min(1, this.g / 0.35)
        const a = TILE_FRAC
        const rc = a * LOOK.corner
        const bevel = a * (0.06 + 0.032 * LOOK.puff)
        const dome = a * 0.012 * LOOK.puff
        const cam = 1 / Math.tan((LOOK.lens * D2R) / 2)
        const rot = this.rot

        // Brush: the finger through the moss. Cursor ray → the tile's top plane (identity turn).
        const ptr = this.ptr
        const br = this.brush
        const tBw = ptr.over ? LOOK.strength : 0
        if (ptr.over) {
            const X = ptr.u * 2 - 1
            const Y = 1 - ptr.v * 2
            const t = 1 - (bevel + dome * 0.5) / cam
            const lx = X * t
            const ly = Y * t
            if (br.w < 0.02) {
                br.x = lx
                br.y = ly
            }
            const kf = 1 - Math.exp(-dt * 18)
            br.x += (lx - br.x) * kf
            br.y += (ly - br.y) * kf
        }
        ptr.moved = false
        br.w += (tBw - br.w) * (1 - Math.exp(-dt * 8))
        if (Math.abs(tBw - br.w) < 4e-3) br.w = tBw

        // Light, fixed: from above and the right, as on the stone's own relief.
        const la = LOOK.lightAngle * D2R
        const le = LOOK.lightHeight * D2R
        const lx = Math.cos(la) * Math.cos(le)
        const ly = Math.sin(la) * Math.cos(le)
        const lz = Math.sin(le)

        const mist = this.tok.mist
        const moss = this.tok.moss400
        const kPx = this.canvas.width / cssW
        const tileCss = a * cssW
        const dens = M.dens
        const count = Math.min(MAX_STRANDS, Math.round(dens * tileCss * tileCss * STRANDS_PER_PX))
        // Hair length in tile-half units: CSS px over the tile's half size.
        const lenK = Math.max(0.04, M.lenPx / (tileCss / 2))
        const liftV = 0.1 + 0.15 * M.lift
        const frizz = M.frizz / 10
        const seed = this.seed
        const rimFrac = M.rimShare
        const cornerU = Math.min(rc / a, 0.999)
        const bevelU = Math.max(bevel / a, 1e-3)
        const domeU = dome / a

        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

        const setShared = (U) => {
            U.f2("uHalf", a, a)
            U.f1("uCorner", Math.min(rc, a * 0.999))
            U.f1("uBevel", Math.max(bevel, 1e-3))
            U.f1("uDome", dome)
            U.m3("uRot", rot)
            U.f1("uCam", cam)
            U.f2("uFrame", 1, 1)
            U.f2("uRollCS", 1, 0)
            U.f2("uOff", 0, 0)
            U.f3("uLight", lx, ly, lz)
            U.f3("uBounceC", lin(moss[0]) * LOOK.bounce, lin(moss[1]) * LOOK.bounce, lin(moss[2]) * LOOK.bounce)
            U.f2("uDown", 0, -1)
            U.f1("uKeyLow", 1 - LOOK.keyFalloff / 100)
            U.f1("uKey", 1.9)
            U.f3("uKeyC", lin(mist[0]), lin(mist[1]), lin(mist[2]))
            U.f1("uFade", fade)
        }

        // 1. Undercoat: the dark skin between the hairs, only where moss grows.
        gl.useProgram(this.underProg)
        setShared(this.U_UN)
        this.U_UN.f1("uUnder", LOOK.undercoat)
        this.U_UN.f1("uPx", 2 / (cssW * kPx))
        gl.drawArrays(gl.TRIANGLES, 0, GRID * GRID * 6)

        // 2. Hair records: rerun the prep pass only when what it builds from changed.
        const key = this.prepKey
        if (
            key[0] !== count || key[1] !== seed || key[2] !== rimFrac || key[3] !== cornerU || key[4] !== bevelU ||
            key[5] !== domeU || key[6] !== liftV || key[7] !== frizz || key[8] !== lenK || key[9] !== this.artVersion
        ) {
            key[0] = count; key[1] = seed; key[2] = rimFrac; key[3] = cornerU; key[4] = bevelU
            key[5] = domeU; key[6] = liftV; key[7] = frizz; key[8] = lenK; key[9] = this.artVersion
            if (count > this.capacity) {
                this.capacity = Math.min(MAX_STRANDS, Math.ceil(count * 1.25))
                gl.bindBuffer(gl.ARRAY_BUFFER, this.strandBuf)
                gl.bufferData(gl.ARRAY_BUFFER, this.capacity * this.STRIDE, gl.DYNAMIC_COPY)
                gl.bindBuffer(gl.ARRAY_BUFFER, null)
            }
            gl.useProgram(this.prepProg)
            const P = this.U_PR
            // A unit tile: the strand pass rescales the records.
            P.f2("uHalf", 1, 1)
            P.f1("uCorner", cornerU)
            P.f1("uBevel", bevelU)
            P.f1("uDome", domeU)
            P.f1("uLift", liftV)
            P.f1("uSpread", 0.5 + frizz * 0.6)
            P.f1("uClump", M.clump)
            P.f1("uCs", lenK * 0.75)
            P.f1("uRimFrac", rimFrac)
            P.f1("uEmboss", 0)
            P.u1("uSeed", seed)
            gl.enable(gl.RASTERIZER_DISCARD)
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tf)
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.strandBuf)
            gl.beginTransformFeedback(gl.POINTS)
            gl.drawArrays(gl.POINTS, 0, count)
            gl.endTransformFeedback()
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)
            gl.disable(gl.RASTERIZER_DISCARD)
        }

        // 3. Strands.
        gl.useProgram(this.strandProg)
        const S = this.U_ST
        setShared(S)
        S.f2("uRes", this.canvas.width, this.canvas.height)
        S.f3("uGrav", 0, -1, 0)
        S.f4("uBrush", br.x, br.y, a * (0.08 + 0.035 * LOOK.reach), br.w)
        S.f1("uLen", a * lenK)
        S.f1("uFrizz", frizz)
        S.f1("uGrow", 0.15 + 0.85 * grow)
        S.f1("uTime", this.clock)
        S.f1("uBreeze", LOOK.breeze * 0.35)
        S.f1("uWidth", (M.width * kPx) / Math.sqrt(Math.min(1, this.quality / 0.75)))
        S.f1("uJitter", LOOK.colorJitter)
        S.f1("uTipFade", LOOK.tipFade)
        S.f1("uRootShade", LOOK.rootShade)
        S.f1("uSheen", LOOK.sheen)
        S.f1("uRim", LOOK.rimLight)
        S.f1("uCount", Math.max(1, count))
        S.f1("uDepth", LOOK.depthShade)
        S.u1("uSeed", seed)
        S.f1("uCrimpK", LOOK.crimp)
        gl.bindVertexArray(this.strandVao)
        // Root halves of every hair first, then tip halves: tips over roots.
        S.i1("uSegBase", 0)
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, (HALF_SEG + 1) * 2, count)
        S.i1("uSegBase", HALF_SEG)
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, (HALF_SEG + 1) * 2, count)
        gl.bindVertexArray(this.vao)
    }

    dispose() {
        if (this.disposed && !this.gl) return
        this.disposed = true
        cancelAnimationFrame(this.raf)
        this.ro.disconnect()
        this.canvas.removeEventListener("webglcontextlost", this.onLost)
        const gl = this.gl
        if (gl && !gl.isContextLost()) {
            gl.deleteTexture(this.artTex)
            gl.deleteTexture(this.flowTex)
            gl.deleteVertexArray(this.vao)
            gl.deleteVertexArray(this.strandVao)
            gl.deleteBuffer(this.strandBuf)
            gl.deleteTransformFeedback(this.tf)
            this.shaders.forEach((s) => gl.deleteShader(s))
            this.programs.forEach((p) => gl.deleteProgram(p))
            // Hand the context back now: the registry's budget depends on it.
            gl.getExtension("WEBGL_lose_context")?.loseContext()
        }
        this.canvas.remove()
    }
}
