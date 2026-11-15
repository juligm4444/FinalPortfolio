import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { stemPoints } from './vinePath.js'

/* V3 §F.2 — the timeline's vine in 3D. The same plant as the hero bust: the
   bark of its branch_* meshes, its leaf_* and flower_01 geometry and materials
   (public/models/hero-bust.glb). A tube stem runs through every milestone and is
   drawn as the page scrolls; reaching a milestone, a short branch reaches for its
   card and a leaf opens on a spring (the "Diseño" milestone opens the flower, the
   one pink accent). The leaf nearest the pointer bends. Loaded on demand by
   VineTimeline.jsx, only on desktop with a WebGL slot. World units are CSS px. */

const MODEL = '/models/hero-bust.glb'
const DRACO = '/draco/'

function normalised(mesh, size) {
  const inner = mesh.clone()
  inner.position.set(0, 0, 0)
  inner.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(inner)
  const c = box.getCenter(new THREE.Vector3())
  const s = box.getSize(new THREE.Vector3())
  inner.position.sub(c)
  const g = new THREE.Group()
  g.add(inner)
  const k = size / Math.max(s.x, s.y, s.z, 1e-6)
  g.scale.setScalar(k)
  return g
}

function Plant({ width, height, anchors, blooms, cx, progress, pointer, onReady }) {
  const { scene } = useGLTF(MODEL, DRACO)
  const parts = useMemo(() => {
    const leaves = []
    let flower = null
    let bark = null
    scene.traverse((o) => {
      if (!o.isMesh) return
      if (/^leaf_/.test(o.name)) leaves.push(o)
      if (o.name === 'flower_01') flower = o
      if (/^branch_/.test(o.name) && !bark) {
        // the bust's bark, lifted: under this flat light the original reads black
        bark = o.material.clone()
        const css = getComputedStyle(document.documentElement)
        bark.emissive = new THREE.Color(css.getPropertyValue('--moss-700').trim())
        bark.emissiveIntensity = 0.55
      }
    })
    return { leaves, flower, bark: bark ?? new THREE.MeshStandardMaterial({ color: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--concrete-500').trim()) }) }
  }, [scene])

  const toWorld = (x, y) => new THREE.Vector3(x - width / 2, height / 2 - y, 0)

  // Stem: one tube through every milestone.
  const stem = useMemo(() => {
    const pts = stemPoints(anchors, cx, height).map(([x, y]) => toWorld(x, y))
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    const geo = new THREE.TubeGeometry(curve, 480, 4, 8, false)
    const samples = Array.from({ length: 481 }, (_, i) => curve.getPointAt(i / 480))
    return { curve, geo, samples, perSeg: 8 * 6 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchors, cx, width, height])

  // A branch per milestone: from the stem toward the card, a leaf (or the flower) at its end.
  const twigs = useMemo(
    () =>
      anchors.map((y, i) => {
        const at = stem.samples.reduce((b, p) => (Math.abs(p.y - (height / 2 - y)) < Math.abs(b.y - (height / 2 - y)) ? p : b))
        const end = toWorld(width - 14, y - 4)
        const len = end.x - at.x
        const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(len * 0.5, 10, 0), new THREE.Vector3(len, -4, 0))
        const geo = new THREE.TubeGeometry(curve, 20, 2.2, 6, false)
        const bloom = blooms[i]
        const src = bloom ? parts.flower : parts.leaves[(i * 5) % Math.max(1, parts.leaves.length)]
        const head = src ? normalised(src, bloom ? 54 : 44) : new THREE.Group()
        return { y, at, len, geo, head, bloom, grow: 0, open: 0, openV: 0, bend: 0, bendV: 0 }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anchors, blooms, stem, parts, width, height]
  )

  const twigRefs = useRef([])
  const headRefs = useRef([])
  const announced = useRef(false)

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const p = progress.current
    // Stem tip: the last sample above the scroll line.
    const lineY = height / 2 - p.line
    let k = 0
    for (let i = 0; i < stem.samples.length; i++) if (stem.samples[i].y >= lineY) k = i
    const segs = p.full ? 480 : k
    stem.geo.setDrawRange(0, segs * stem.perSeg)
    const tipY = stem.samples[segs]?.y ?? lineY
    twigs.forEach((t, i) => {
      const reached = p.full || tipY <= height / 2 - t.y + 0.5
      t.grow += ((reached ? 1 : 0) - t.grow) * (1 - Math.exp(-dt * 7))
      // the leaf opens once the branch is mostly out, on an underdamped spring (the bounce)
      const want = reached && t.grow > 0.7 ? 1 : 0
      if (p.reduced) {
        t.open = want
      } else {
        const acc = 160 * (want - t.open) - 2 * 0.35 * Math.sqrt(160) * t.openV
        t.openV += acc * dt
        t.open += t.openV * dt
      }
      // nearest leaf to the pointer bends
      const ex = width / 2 + t.at.x + t.len
      const ey = t.y
      const d = pointer.current.over ? Math.hypot(pointer.current.x - ex, pointer.current.y - ey) : 1e9
      const bendWant = d < 70 && pointer.current.nearest === i ? (pointer.current.x < ex ? -0.55 : 0.55) : 0
      const bacc = 120 * (bendWant - t.bend) - 2 * 0.3 * Math.sqrt(120) * t.bendV
      t.bendV += bacc * dt
      t.bend += t.bendV * dt
      const tw = twigRefs.current[i]
      if (tw) tw.scale.set(Math.max(0.001, t.grow), Math.max(0.001, t.grow), 1)
      const hd = headRefs.current[i]
      if (hd) {
        hd.scale.setScalar(Math.max(0.001, t.open))
        hd.rotation.z = t.bend + (t.bloom ? 0 : -0.5)
      }
    })
    // which leaf is nearest the pointer (for the bend)
    if (pointer.current.over) {
      let best = -1
      let bd = 1e9
      twigs.forEach((t, i) => {
        const dd = Math.hypot(pointer.current.x - (width / 2 + t.at.x + t.len), pointer.current.y - t.y)
        if (dd < bd) {
          bd = dd
          best = i
        }
      })
      pointer.current.nearest = best
    }
    if (!announced.current) {
      announced.current = true
      onReady?.()
    }
  })

  return (
    <group>
      <mesh geometry={stem.geo} material={parts.bark} />
      {twigs.map((t, i) => (
        <group key={i} position={[t.at.x, t.at.y, 2]}>
          <group ref={(el) => (twigRefs.current[i] = el)}>
            <mesh geometry={t.geo} material={parts.bark} />
          </group>
          <group position={[t.len, -4, 6]} ref={(el) => (headRefs.current[i] = el)}>
            <primitive object={t.head} />
          </group>
        </group>
      ))}
    </group>
  )
}

function Lights() {
  const tok = useMemo(() => {
    const css = getComputedStyle(document.documentElement)
    return { mist: css.getPropertyValue('--mist').trim() }
  }, [])
  return (
    <>
      <ambientLight color={tok.mist} intensity={2.4} />
      <directionalLight color={tok.mist} intensity={3} position={[60, 120, 200]} />
    </>
  )
}

function Fit({ width, height }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 500)
    camera.zoom = 1
    camera.updateProjectionMatrix()
  }, [camera, width, height])
  return null
}

export default function VineScene({ width, height, anchors, blooms, cx, progress, onReady }) {
  const pointer = useRef({ x: 0, y: 0, over: false, nearest: -1 })
  const host = useRef(null)
  useEffect(() => {
    const onMove = (e) => {
      const r = host.current?.getBoundingClientRect()
      if (!r) return
      pointer.current.x = e.clientX - r.left
      pointer.current.y = e.clientY - r.top
      pointer.current.over = e.clientX >= r.left - 40 && e.clientX <= r.right + 200 && e.clientY >= r.top && e.clientY <= r.bottom
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return (
    <div ref={host} className="vine__gl" style={{ width, height }}>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ near: 1, far: 2000, position: [0, 0, 500], zoom: 1 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <Fit width={width} height={height} />
        <Lights />
        <Suspense fallback={null}>
          <Plant width={width} height={height} anchors={anchors} blooms={blooms} cx={cx} progress={progress} pointer={pointer} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  )
}
