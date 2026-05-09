import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, CameraShake, AdaptiveDpr, Preload } from '@react-three/drei'
import { Suspense, useCallback, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import Garage from './components/Garage'
import Car from './components/Car'
import BlobShadow from './components/BlobShadow'
import EnterPrompt from './components/ui/EnterPrompt'
import ProfilePanel from './components/ui/ProfilePanel'

import { social } from './data/portfolio'

import garageUrl from '../models/garage_nfs_2015.glb?url'
import rx7Url from '../models/rx7_fd.glb?url'
import carreraUrl from '../models/carrera_gt.glb?url'

useGLTF.preload(garageUrl)
useGLTF.preload(rx7Url)
useGLTF.preload(carreraUrl)

const DEG = Math.PI / 180

// Camera resting position and orbit target
const CAM_END  = [-0.7412, -0.1175, 0.7313]
const CAM_START = [-0.95, 0.08, 1.05]   // slightly pulled back & elevated for cinematic intro
const CAM_TARGET = [-0.485, -0.155, 0.43]
const INTRO_DURATION = 1.6  // seconds

// Cubic ease-out
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

// Animates the camera from CAM_START → CAM_END on mount, then signals done
function CameraIntro({ onDone }) {
  const t0 = useRef(null)
  const done = useRef(false)
  const startVec  = useMemo(() => new THREE.Vector3(...CAM_START), [])
  const endVec    = useMemo(() => new THREE.Vector3(...CAM_END), [])
  const targetVec = useMemo(() => new THREE.Vector3(...CAM_TARGET), [])
  const tmp       = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera, clock }) => {
    if (done.current) return
    if (t0.current === null) t0.current = clock.elapsedTime

    const raw   = Math.min((clock.elapsedTime - t0.current) / INTRO_DURATION, 1)
    const eased = easeOutCubic(raw)

    tmp.lerpVectors(startVec, endVec, eased)
    camera.position.copy(tmp)
    camera.lookAt(targetVec)

    if (raw >= 1) {
      done.current = true
      onDone()
    }
  })

  return null
}

// Only writes to DOM every 15 frames — innerHTML every frame costs ~2ms of JS
const DEBUG_INTERVAL = 15
function CameraDebug({ controlsRef, domRef }) {
  const tick = useRef(0)
  useFrame(({ camera }) => {
    if (!domRef.current) return
    if (++tick.current % DEBUG_INTERVAL !== 0) return
    const p = camera.position
    const t = controlsRef.current?.target
    domRef.current.innerHTML =
      `<span style="color:#888">pos</span>  [${p.x.toFixed(4)}, ${p.y.toFixed(4)}, ${p.z.toFixed(4)}]<br/>` +
      (t ? `<span style="color:#888">tgt</span>  [${t.x.toFixed(4)}, ${t.y.toFixed(4)}, ${t.z.toFixed(4)}]` : '')
  })
  return null
}

export default function App() {
  const controlsRef  = useRef()
  const debugDomRef  = useRef()
  const [panelOpen,       setPanelOpen]       = useState(false)
  const [controlsEnabled, setControlsEnabled] = useState(false)

  const openPanel    = useCallback(() => setPanelOpen(true),  [])
  const closePanel   = useCallback(() => setPanelOpen(false), [])
  const enableControls = useCallback(() => setControlsEnabled(true), [])

  return (
    <div style={{ width: '100vw', height: '100vh', fontFamily: 'Imprima, sans-serif' }}>

      {/* ── 3D Canvas ── */}
      <Canvas
        camera={{ position: CAM_START, fov: 60 }}
        dpr={[0.5, 1]}
        gl={{ powerPreference: 'high-performance', antialias: true }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#0d0d0d']} />
        <fog attach="fog" args={['#0d0d0d', 1.5, 4]} />
        <ambientLight intensity={2} />
        <directionalLight position={[0, 2, 1]} intensity={2} />
        <Suspense fallback={null}>
          <Environment preset="warehouse" background={false} />
          <Garage url={garageUrl} />
          <Car url={carreraUrl} position={[-0.47, -0.2335, 0.45]} rotation={[0, 106 * DEG, 0]} scale={0.09} />
          <Car url={rx7Url}     position={[-0.60, -0.09,   0.10]} rotation={[0,  50 * DEG, 0]} scale={0.12} />
          <BlobShadow position={[-0.5,   -0.225,  0.46]}  width={0.665} length={0.36} opacity={0.85} />
          <BlobShadow position={[-0.397, -0.225,  0.008]} width={0.665} length={0.36} opacity={0.85} yRotation={-43 * DEG} />
          <Preload all />
        </Suspense>

        {/* Intro runs first; OrbitControls disabled until intro ends */}
        <CameraIntro onDone={enableControls} />
        <OrbitControls
          ref={controlsRef}
          target={CAM_TARGET}
          makeDefault
          enabled={controlsEnabled}
          enableDamping
          dampingFactor={0.06}
          regress
        />
        <CameraShake maxYaw={0.10} maxPitch={0.10} maxRoll={0.006} yawFrequency={0.15} pitchFrequency={0.15} rollFrequency={0.2} intensity={0.8} />
        <AdaptiveDpr pixelated />
        <CameraDebug controlsRef={controlsRef} domRef={debugDomRef} />
      </Canvas>

      {/* ── Vignette ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: 'radial-gradient(ellipse at 55% 60%, transparent 30%, rgba(0,0,0,0.72) 100%)',
      }} />

      {/* ── Bottom-left: identity ── */}
      <div style={{
        position: 'fixed', bottom: 40, left: 44, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 18, pointerEvents: 'none',
      }}>
        <img
          src="/assets/profile.jpg"
          alt="Kushagra Katiyar"
          style={{
            width: 64, height: 64, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.85)',
            boxShadow: '0 0 18px rgba(255,255,255,0.25)',
            objectFit: 'cover', flexShrink: 0,
          }}
        />
        <div>
          <div style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            color: '#fff',
            textShadow: '0 0 24px rgba(255,255,255,0.45)',
            letterSpacing: '0.01em',
            lineHeight: 1.1,
          }}>
            Kushagra Katiyar
          </div>
          <div style={{
            fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
            color: 'rgba(255,255,255,0.5)',
            marginTop: 5,
            letterSpacing: '0.04em',
          }}>
            CS @ University of Florida &nbsp;·&nbsp; Full-Stack Developer
          </div>
        </div>
      </div>

      {/* ── Right: social links ── */}
      <div style={{
        position: 'fixed', right: 28, top: '50%', transform: 'translateY(-50%)',
        zIndex: 20, display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {social.map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            title={label}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src={icon}
              alt={label}
              style={{
                width: 30, height: 30,
                filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.5))',
                opacity: 0.75,
                transition: 'opacity 0.2s, filter 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,0.9))' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.5))' }}
            />
          </a>
        ))}
      </div>

      {/* ── Press Enter prompt ── */}
      {!panelOpen && <EnterPrompt onEnter={openPanel} />}

      {/* ── Profile / Tech Stack panel ── */}
      <ProfilePanel visible={panelOpen} onClose={closePanel} />

      {/* ── Camera debug (dev) ── */}
      <div
        ref={debugDomRef}
        style={{
          position: 'fixed', bottom: 16, right: 16,
          background: 'rgba(0,0,0,0.7)', color: '#00ff88',
          fontFamily: 'monospace', fontSize: 11,
          padding: '6px 10px', borderRadius: 6, lineHeight: 1.7,
          pointerEvents: 'none', zIndex: 30,
          border: '1px solid rgba(0,255,136,0.15)',
        }}
      />
    </div>
  )
}
