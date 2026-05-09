import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Environment, useGLTF, CameraShake, AdaptiveDpr, Preload } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Garage from './components/Garage'
import Car from './components/Car'
import BlobShadow from './components/BlobShadow'
import EnterPrompt from './components/ui/EnterPrompt'
import FullPortfolio from './components/ui/FullPortfolio'
import SectionNav from './components/ui/SectionNav'
import SidePanel from './components/ui/SidePanel'

import { profile, social } from './data/portfolio'
import { a } from './utils/asset'

import garageUrl from '../models/garage_nfs_2015.glb?url'
import rx7Url from '../models/rx7_fd.glb?url'
import carreraUrl from '../models/carrera_gt.glb?url'

useGLTF.preload(garageUrl)
useGLTF.preload(rx7Url)
useGLTF.preload(carreraUrl)

const DEG = Math.PI / 180

const CAM_START = [-0.95, 0.08, 1.05]

const SECTION_CAMS = {
  about: {
    pos:    [-0.7412, -0.1175, 0.7313],
    target: [-0.485,  -0.155,  0.43],
  },
  experience: {
    pos:    [-0.15, -0.07, 0.38],
    target: [-0.58, -0.09, 0.10],
  },
  projects: {
    pos:    [-0.22, -0.14, 0.72],
    target: [-0.47, -0.23, 0.45],
  },
}

const SECTIONS = ['about', 'experience', 'projects']
const INTRO_MS = 2000

// ─── Scene camera controller ──────────────────────────────────
function SceneControls({ section, startIntro, introComplete, onIntroComplete }) {
  const ccRef = useRef()
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startIntro || startedRef.current) return
    startedRef.current = true
    const cc = ccRef.current
    if (!cc) return
    cc.enabled = false
    cc.smoothTime = 0.7
    const { pos: rp, target: rt } = SECTION_CAMS.about
    cc.setLookAt(...CAM_START, ...rt, false)
    const t1 = setTimeout(() => cc.setLookAt(...rp, ...rt, true), 80)
    const t2 = setTimeout(() => {
      if (!ccRef.current) return
      ccRef.current.smoothTime = 0.25
      ccRef.current.enabled = true
      onIntroComplete()
    }, INTRO_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [startIntro, onIntroComplete])

  useEffect(() => {
    if (!introComplete) return
    const cc = ccRef.current
    if (!cc) return
    const { pos, target } = SECTION_CAMS[section]
    cc.smoothTime = 0.55
    cc.setLookAt(...pos, ...target, true)
    const t = setTimeout(() => { if (ccRef.current) ccRef.current.smoothTime = 0.25 }, 2000)
    return () => clearTimeout(t)
  }, [section, introComplete])

  return (
    <CameraControls
      ref={ccRef}
      makeDefault
      minDistance={0.08}
      maxDistance={2.0}
      maxPolarAngle={1.62}
    />
  )
}

// ─── Camera debug ─────────────────────────────────────────────
const DEBUG_INTERVAL = 15
function CameraDebug({ domRef }) {
  const tick = useRef(0)
  useFrame(({ camera }) => {
    if (!domRef.current) return
    if (++tick.current % DEBUG_INTERVAL !== 0) return
    const p = camera.position
    domRef.current.innerHTML =
      `<span style="color:#555">pos</span> [${p.x.toFixed(4)}, ${p.y.toFixed(4)}, ${p.z.toFixed(4)}]`
  })
  return null
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const debugDomRef = useRef()
  // phase: 'splash' → 'intro' → 'ready'
  const [phase,         setPhase]         = useState('splash')
  const [section,       setSection]       = useState('about')
  const [introComplete, setIntroComplete] = useState(false)
  const [portfolioOpen, setPortfolioOpen] = useState(false)

  const openPortfolio  = useCallback(() => setPortfolioOpen(true),  [])
  const closePortfolio = useCallback(() => setPortfolioOpen(false), [])

  const onIntroComplete = useCallback(() => {
    setIntroComplete(true)
    setPhase('ready')
  }, [])

  // Arrow key navigation — ArrowUp on about opens web view, others wrap sections
  useEffect(() => {
    const fn = e => {
      if (phase !== 'ready' || portfolioOpen) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Enter') {
        setSection(s => SECTIONS[(SECTIONS.indexOf(s) + 1) % SECTIONS.length])
      } else if (e.key === 'ArrowLeft') {
        setSection(s => SECTIONS[(SECTIONS.indexOf(s) - 1 + SECTIONS.length) % SECTIONS.length])
      } else if (e.key === 'ArrowUp') {
        setSection(s => {
          if (s === 'about') { openPortfolio(); return s }
          return SECTIONS[(SECTIONS.indexOf(s) - 1 + SECTIONS.length) % SECTIONS.length]
        })
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [phase, portfolioOpen, openPortfolio])

  const splashDone   = phase !== 'splash'
  const sidebarOpen  = section !== 'about'

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
        <SceneControls
          section={section}
          startIntro={splashDone}
          introComplete={introComplete}
          onIntroComplete={onIntroComplete}
        />
        <CameraShake maxYaw={0.10} maxPitch={0.10} maxRoll={0.006} yawFrequency={0.15} pitchFrequency={0.15} rollFrequency={0.2} intensity={0.8} />
        <AdaptiveDpr pixelated />
        <CameraDebug domRef={debugDomRef} />
      </Canvas>

      {/* ── Vignette ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: 'radial-gradient(ellipse at 40% 60%, transparent 22%, rgba(0,0,0,0.78) 100%)',
      }} />

      {/* ── Splash overlay (blurred hero) ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        pointerEvents: splashDone ? 'none' : 'auto',
        opacity: splashDone ? 0 : 1,
        transition: 'opacity 0.85s ease',
      }}>
        {/* Blur layer */}
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          background: 'rgba(0,0,0,0.52)',
        }} />

        {/* V1-style centered hero */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {/* Profile image — V1 image_container style */}
            <div style={{
              width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
              boxShadow: '0 0 0 2px white', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={profile.avatar} alt={profile.name} style={{
                width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
              }} />
            </div>

            {/* Text block */}
            <div>
              <h1 style={{
                fontFamily: 'Imprima, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#fff',
                textShadow: '0 0 24px rgba(255,255,255,0.5)',
                marginBottom: 14, lineHeight: 1.1,
              }}>
                {profile.name}
              </h1>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'rgba(255,255,255,0.72)',
                fontFamily: 'Imprima, sans-serif',
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                marginBottom: 8,
              }}>
                <img src={a('/assets/laptop.svg')} alt="" style={{
                  width: 18, height: 18, flexShrink: 0,
                  filter: 'brightness(0) invert(1)', opacity: 0.8,
                }} />
                {profile.title}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'Imprima, sans-serif',
                fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
                marginBottom: 20,
              }}>
                <img src={a('/assets/location_icon.svg')} alt="" style={{
                  width: 15, height: 15, flexShrink: 0,
                  filter: 'brightness(0) invert(1)', opacity: 0.6,
                }} />
                {profile.location}
              </div>
              <div style={{ display: 'flex', gap: 18 }}>
                {social.map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                    style={{ display: 'inline-flex' }}>
                    <img src={icon} alt={label} style={{
                      width: 28, height: 28,
                      filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.4))',
                      opacity: 0.75, transition: 'opacity 0.2s, filter 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.9))' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Press enter to continue */}
        <div
          onClick={() => setPhase('intro')}
          style={{
            position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            cursor: 'pointer',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <span style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: '0.85rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
          }}>
            press enter to continue
          </span>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path d="M2 2l8 8 8-8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Enter key for splash */}
      {!splashDone && <SplashKeyListener onEnter={() => setPhase('intro')} />}

      {/* ── Top nav ── */}
      <SectionNav
        section={section}
        onSection={setSection}
        disabled={!splashDone}
        dimmed={sidebarOpen}
      />

      {/* ── Bottom-left: V1-style identity + social ── */}
      <div style={{
        position: 'fixed', bottom: 36, left: 44, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 28,
        pointerEvents: 'none',
        opacity: phase === 'ready' ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        {/* Circular photo — V1 image_container style */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 2px white', flexShrink: 0,
        }}>
          <img src={profile.avatar} alt={profile.name} style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
          }} />
        </div>

        <div>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.4)',
            letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: 6,
          }}>
            {profile.name}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Imprima, sans-serif',
            fontSize: 'clamp(0.72rem, 1.1vw, 0.85rem)',
            color: 'rgba(255,255,255,0.65)', marginBottom: 5,
          }}>
            <img src={a('/assets/laptop.svg')} alt="" style={{
              width: 14, height: 14, flexShrink: 0,
              filter: 'brightness(0) invert(1)', opacity: 0.7,
            }} />
            {profile.title}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Imprima, sans-serif',
            fontSize: 'clamp(0.68rem, 1vw, 0.8rem)',
            color: 'rgba(255,255,255,0.45)', marginBottom: 10,
          }}>
            <img src={a('/assets/location_icon.svg')} alt="" style={{
              width: 12, height: 12, flexShrink: 0,
              filter: 'brightness(0) invert(1)', opacity: 0.55,
            }} />
            {profile.location}
          </div>
          <div style={{ display: 'flex', gap: 16, pointerEvents: 'auto' }}>
            {social.map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                style={{ display: 'inline-flex' }}>
                <img src={icon} alt={label} style={{
                  width: 24, height: 24,
                  filter: 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(255,255,255,0.35))',
                  opacity: 0.7, transition: 'opacity 0.2s, filter 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.9))' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(255,255,255,0.35))' }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section side panel ── */}
      <SidePanel
        section={section}
        showAbout={splashDone}
      />

      {/* ── Press Enter → full portfolio (ready phase, about section) ── */}
      {phase === 'ready' && !portfolioOpen && section === 'about' && (
        <EnterPrompt onEnter={openPortfolio} />
      )}

      {/* ── Full Portfolio overlay ── */}
      <FullPortfolio visible={portfolioOpen} onClose={closePortfolio} />

      {/* ── Camera debug ── */}
      <div
        ref={debugDomRef}
        style={{
          position: 'fixed', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)', color: '#00ff88',
          fontFamily: 'monospace', fontSize: 10,
          padding: '5px 10px', borderRadius: 5,
          pointerEvents: 'none', zIndex: 30,
          border: '1px solid rgba(0,255,136,0.1)',
          whiteSpace: 'nowrap',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.65; transform: translateX(-50%) translateY(0); }
          50%       { opacity: 1;    transform: translateX(-50%) translateY(5px); }
        }
      `}</style>
    </div>
  )
}

// Listens for any non-modifier key on splash screen to advance
function SplashKeyListener({ onEnter }) {
  useEffect(() => {
    const fn = e => {
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return
      onEnter()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onEnter])
  return null
}
