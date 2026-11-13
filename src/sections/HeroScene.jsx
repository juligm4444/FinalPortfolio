import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* Hero scene (REDESIGN §5 Home.1): the marble bust split by the crack, laurel
   growing out of it. Loaded on demand by Hero.jsx; this module is the only one
   that imports R3F. The bust turns on Y toward the pointer (±8°, damped), the
   leaf_* meshes bend away from it on an underdamped spring, and the name and
   role live in the same camera as DOM text (drei <Html transform>) so they
   tilt with it and stay real text. */

const MODEL = '/models/hero-bust.glb'
const DRACO = '/draco/'
const MAX_TURN = 8 * (Math.PI / 180)
const CAM_TILT = 2.5 * (Math.PI / 180)
const LEAF_BEND = 0.55 // rad at the pointer
const LEAF_REACH = 0.28 // NDC radius the pointer reaches
const SPRING_W = 13 // rad/s
const SPRING_Z = 0.32 // underdamped: overshoots, then settles

function readTokens() {
  const css = getComputedStyle(document.documentElement)
  const v = (n) => css.getPropertyValue(n).trim()
  return { mist: v('--mist'), c900: v('--concrete-900'), c300: v('--concrete-300') }
}

function Bust({ pointer, onReady, narrow, debug }) {
  const { scene } = useGLTF(MODEL, DRACO)
  const group = useRef()
  const bust = useRef()
  const leaves = useMemo(() => {
    const out = []
    scene.traverse((o) => {
      if (o.isMesh && /^leaf_/.test(o.name)) {
        out.push({ node: o, base: o.quaternion.clone(), a: 0, v: 0, pos: new THREE.Vector3(), ndc: new THREE.Vector3() })
        o.frustumCulled = false
      }
      if (o.isMesh && o.name === 'bust') bust.current = o
    })
    return out
  }, [scene])
  const { camera } = useThree()
  const tmpQ = useMemo(() => new THREE.Quaternion(), [])
  const axis = useMemo(() => new THREE.Vector3(), [])
  const announced = useRef(false)

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const p = pointer.current
    // The whole group leans a touch with the pointer's height: the texts ride on it.
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -p.y * CAM_TILT * p.over, 4, dt)
    }
    // Bust: turn toward the pointer, at most 8°, damped.
    if (bust.current) {
      bust.current.rotation.y = THREE.MathUtils.damp(bust.current.rotation.y, p.x * MAX_TURN * p.over, 5, dt)
    }
    // Leaves: a spring per leaf toward a bend that depends on how close the pointer is on screen.
    for (const l of leaves) {
      l.node.getWorldPosition(l.pos)
      l.ndc.copy(l.pos).project(camera)
      const dx = l.ndc.x - p.x
      const dy = l.ndc.y - p.y
      const d2 = dx * dx + dy * dy
      const near = p.over ? Math.exp(-d2 / (LEAF_REACH * LEAF_REACH)) : 0
      const target = near * LEAF_BEND * (dx >= 0 ? 1 : -1)
      const acc = SPRING_W * SPRING_W * (target - l.a) - 2 * SPRING_Z * SPRING_W * l.v
      l.v += acc * dt
      l.a += l.v * dt
      // Bend from the pivot: the leaf's own origin, about the axis across its blade.
      axis.set(0, 0, 1)
      tmpQ.setFromAxisAngle(axis, l.a)
      l.node.quaternion.copy(l.base).multiply(tmpQ)
    }
    if (!announced.current) {
      announced.current = true
      onReady?.()
    }
    if (debug) debug.turn = bust.current ? bust.current.rotation.y : 0
    if (debug) debug.leaf = leaves.length ? leaves[0].a : 0
  })

  return (
    <group ref={group} position={[narrow ? 0 : 0.42, narrow ? 0.22 : 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

function Lights({ tok }) {
  return (
    <>
      <ambientLight color={tok.mist} intensity={0.9} />
      <directionalLight color={tok.mist} intensity={2.4} position={[1.6, 2.4, 2.2]} />
    </>
  )
}

/** Name and role as DOM inside the camera: real text, tilted with the view. */
function Texts({ name, role, narrow }) {
  const position = narrow ? [0, -0.58, 0.12] : [-0.62, 0.3, 0.12]
  return (
    <Html
      transform
      position={position}
      distanceFactor={0.62}
      center={narrow}
      zIndexRange={[2, 1]}
      className={`hero-text ${narrow ? 'hero-text--narrow' : ''}`}
    >
      <h1 className="hero-text__name">{name}</h1>
      <p className="hero-text__role">{role}</p>
    </Html>
  )
}

function Rig({ pointer }) {
  const { camera, size } = useThree()
  useEffect(() => {
    // Fit the bust (1 unit tall) with room for the texts; narrow frames pull back.
    const aspect = size.width / Math.max(1, size.height)
    const z = aspect < 0.9 ? 3.4 : 2.9
    camera.position.set(0, 0.02, z)
    camera.lookAt(0, 0, 0)
  }, [camera, size])
  useFrame(() => {
    const p = pointer.current
    p.over = THREE.MathUtils.lerp(p.over, p.want, 0.08)
  })
  return null
}

export default function HeroScene({ name, role, onStatus, draws }) {
  const pointer = useRef({ x: 0, y: 0, want: 0, over: 0 })
  const tok = useMemo(() => readTokens(), [])
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      const p = pointer.current
      p.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.2, 1.2)
      p.y = THREE.MathUtils.clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -1.2, 1.2)
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      p.want = inside && e.pointerType !== 'touch' ? 1 : 0
    }
    const onLeave = () => {
      pointer.current.want = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const narrow = typeof window !== 'undefined' && window.innerWidth < 720

  return (
    <div ref={hostRef} className="hero__live">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 28, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          gl.outputColorSpace = THREE.SRGBColorSpace
          draws.gl = gl
        }}
      >
        <Rig pointer={pointer} />
        <Lights tok={tok} />
        <Suspense fallback={null}>
          <Bust pointer={pointer} narrow={narrow} debug={draws} onReady={() => onStatus?.('ready')} />
          <Texts name={name} role={role} narrow={narrow} />
        </Suspense>
        <FrameCounter draws={draws} />
      </Canvas>
    </div>
  )
}

function FrameCounter({ draws }) {
  useFrame(() => {
    draws.n = (draws.n || 0) + 1
  })
  return null
}
