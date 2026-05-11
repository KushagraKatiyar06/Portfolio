import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, Environment, useGLTF, AdaptiveDpr, Preload } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
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
import m8Url from '../models/m8.glb?url'

useGLTF.preload(garageUrl)
useGLTF.preload(rx7Url)
useGLTF.preload(carreraUrl)
useGLTF.preload(m8Url)

const DEG = Math.PI / 180

// Splash-screen resting camera position
const CAM_START = [-0.6946, 0.0169, 0.7204]

const SECTION_CAMS = {
  about: {
    pos:    [-0.7412, -0.1175,  0.7313],
    target: [-0.4850, -0.1550,  0.4300],
  },
  experience: {
    pos:    [-0.2068, -0.1104,  0.3190],
    target: [-0.2946, -0.1550, -0.0773],
  },
  projects: {
    pos:    [ 0.1100, -0.1033,  0.1807],
    target: [-0.0776, -0.1550, -0.0872],
  },
}

const SECTIONS   = ['about', 'experience', 'projects']
const INTRO_MS   = 2000

// All three cars — positions are the starting defaults; debug mode makes them draggable
const CAR_CONFIGS = [
  { id: 'carrera', url: carreraUrl, pos: [-0.47,  -0.2335,  0.45], rot: [0, 106 * DEG, 0], scale: 0.09, label: 'Carrera GT' },
  { id: 'rx7',     url: rx7Url,     pos: [-0.60,  -0.09,    0.10], rot: [0,  50 * DEG, 0], scale: 0.12, label: 'RX-7 FD'   },
  { id: 'm8',      url: m8Url,      pos: [-0.0255, -0.233, -0.2080], rot: [0, -12 * DEG, 0], scale: 9, label: 'BMW M8'},
]

// --- Debug: invisible floor plane that tracks pointer during a car drag ---
function DebugScene({ carPositions, dragIndex, onCarPositionChange, onDragEnd }) {
  if (dragIndex === null) return null
  const y = carPositions[dragIndex][1]
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, y, 0]}
      onPointerMove={e => {
        e.stopPropagation()
        onCarPositionChange(dragIndex, [
          parseFloat(e.point.x.toFixed(4)),
          y,
          parseFloat(e.point.z.toFixed(4)),
        ])
      }}
      onPointerUp={onDragEnd}
      onPointerLeave={onDragEnd}
    >
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

// --- Debug: HTML overlay showing live camera + car coordinates ---
function DebugOverlay({ debugInfoRef, carPositions, dragIndex }) {
  const posRef    = useRef()
  const targetRef = useRef()

  useEffect(() => {
    let raf
    const tick = () => {
      const { pos, target } = debugInfoRef.current
      const fmt = v => v.toFixed(4).padStart(8)
      if (posRef.current)    posRef.current.textContent    = `[${pos.map(fmt).join(', ')}]`
      if (targetRef.current) targetRef.current.textContent = `[${target.map(fmt).join(', ')}]`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [debugInfoRef])

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: 'rgba(0,0,0,0.88)', color: '#00ff88',
      padding: '12px 16px', borderRadius: 6,
      fontFamily: '"Courier New", monospace', fontSize: 11, lineHeight: 1.8,
      border: '1px solid rgba(0,255,136,0.25)',
      userSelect: 'text', minWidth: 330, pointerEvents: 'none',
    }}>
      <div style={{ color: '#ffcc00', marginBottom: 6 }}>
        ■ DEBUG &nbsp;<span style={{ color: '#666' }}>D = reset page</span>
      </div>
      <div style={{ color: '#555', fontSize: 10, marginBottom: 1 }}>CAMERA</div>
      <div>pos&nbsp;&nbsp;&nbsp; <span ref={posRef} /></div>
      <div>target <span ref={targetRef} /></div>
      <div style={{ color: '#555', fontSize: 10, marginTop: 10, marginBottom: 1 }}>CARS &nbsp;<span style={{ color: '#444' }}>click + drag to move</span></div>
      {CAR_CONFIGS.map((cfg, i) => (
        <div key={cfg.id} style={{
          color: dragIndex === i ? '#ffcc00' : '#00ff88',
          marginBottom: 1,
        }}>
          {cfg.label.padEnd(12)}[{carPositions[i].map(v => v.toFixed(4).padStart(8)).join(', ')}]
        </div>
      ))}
    </div>
  )
}

// --- Scene camera ---
function SceneControls({ section, startIntro, introComplete, onIntroComplete, debugInfoRef, debugMode, dragIndex }) {
  const ccRef        = useRef()
  const startedRef   = useRef(false)
  const prevSection  = useRef('about')
  const trans        = useRef(null)   // { sp, st, ep, et, elapsed, dur, arc, isIntro, onDone? }
  const curTarget    = useRef(new Vector3(...SECTION_CAMS.about.target))
  const { camera }   = useThree()

  useEffect(() => {
    if (!startIntro) return
    if (startedRef.current) { onIntroComplete(); return }
    startedRef.current = true
    const { pos: rp, target: rt } = SECTION_CAMS.about
    trans.current = {
      sp: [...CAM_START], st: [...rt],
      ep: [...rp],        et: [...rt],
      elapsed: 0, dur: INTRO_MS / 1000,
      arc: 0, isIntro: true,
      onDone: onIntroComplete,
    }
  }, [startIntro, onIntroComplete])

  useEffect(() => {
    if (!introComplete) return
    const { pos, target } = SECTION_CAMS[section]
    const ct = curTarget.current
    // Arc only when the path passes near the Carrera GT (about ↔ experience)
    const needsArc = section === 'about' || prevSection.current === 'about'
    prevSection.current = section
    trans.current = {
      sp: [camera.position.x, camera.position.y, camera.position.z],
      st: [ct.x, ct.y, ct.z],
      ep: [...pos],
      et: [...target],
      elapsed: 0, dur: 1.6,
      arc: needsArc ? 0.06 : 0, isIntro: false,
    }
  }, [section, introComplete, camera])

  useFrame((state, delta) => {
    const cc = ccRef.current
    if (!cc) return

    if (debugMode) {
      cc.enabled = dragIndex === null
      if (debugInfoRef?.current) {
        debugInfoRef.current.pos    = [camera.position.x, camera.position.y, camera.position.z]
        debugInfoRef.current.target = [curTarget.current.x, curTarget.current.y, curTarget.current.z]
      }
      return
    }

    cc.enabled = false

    const time = state.clock.elapsedTime
    let px, py, pz, lx, ly, lz

    if (trans.current) {
      const tr = trans.current
      tr.elapsed += delta
      const rawT = Math.min(tr.elapsed / tr.dur, 1)

      // Normalized exponential ease-out: curve is forced through (0,0)→(1,1)
      // so there's no snap at the end — it truly decelerates into the target.
      // Intro uses a softer exponent for the cinematic drop feel.
      const exp  = tr.isIntro ? 6 : 5
      const norm = 1 - Math.pow(2, -exp)          // value the raw curve reaches at t=1
      const t    = rawT >= 1 ? 1 : (1 - Math.pow(2, -exp * rawT)) / norm

      px = tr.sp[0] + (tr.ep[0] - tr.sp[0]) * t
      py = tr.sp[1] + (tr.ep[1] - tr.sp[1]) * t
      pz = tr.sp[2] + (tr.ep[2] - tr.sp[2]) * t
      lx = tr.st[0] + (tr.et[0] - tr.st[0]) * t
      ly = tr.st[1] + (tr.et[1] - tr.st[1]) * t
      lz = tr.st[2] + (tr.et[2] - tr.st[2]) * t

      // Arc camera upward through the midpoint — curves over cars, not through them
      py += Math.sin(rawT * Math.PI) * tr.arc

      if (rawT >= 1) {
        if (tr.onDone) tr.onDone()
        trans.current = null
      }
    } else if (introComplete) {
      const { pos, target } = SECTION_CAMS[section]
      ;[px, py, pz] = pos
      ;[lx, ly, lz] = target
    } else {
      if (debugInfoRef?.current) {
        debugInfoRef.current.pos    = [camera.position.x, camera.position.y, camera.position.z]
        debugInfoRef.current.target = [curTarget.current.x, curTarget.current.y, curTarget.current.z]
      }
      return
    }

    // Organic camera shake — two incommensurate frequencies per axis
    const sx = (Math.sin(time * 0.71) * 0.55 + Math.sin(time * 2.13) * 0.45) * 0.0028
    const sy = (Math.sin(time * 0.53) * 0.60 + Math.sin(time * 1.87) * 0.40) * 0.0018

    curTarget.current.set(lx, ly, lz)
    camera.position.set(px + sx, py + sy, pz)
    camera.lookAt(lx, ly, lz)
    camera.updateMatrixWorld()

    if (debugInfoRef?.current) {
      debugInfoRef.current.pos    = [px, py, pz]
      debugInfoRef.current.target = [lx, ly, lz]
    }
  })

  return <CameraControls ref={ccRef} makeDefault enabled={false} />
}

// --- App ---
export default function App() {
  const tooltipRef     = useRef()
  const manualCloseRef = useRef(false)
  const firstIntroRef  = useRef(true)   // true until first intro completes
  const debugInfoRef   = useRef({ pos: [0, 0, 0], target: [0, 0, 0] })

  const [phase,         setPhase]         = useState('splash')
  const [section,       setSection]       = useState('about')
  const [introComplete, setIntroComplete] = useState(false)
  const [portfolioOpen, setPortfolioOpen] = useState(false)
  const [panelMode,     setPanelMode]     = useState('normal')
  const [debugMode,     setDebugMode]     = useState(false)
  const [dragIndex,     setDragIndex]     = useState(null)
  const [carPositions,  setCarPositions]  = useState(CAR_CONFIGS.map(c => [...c.pos]))

  const onIntroComplete = useCallback(() => {
    firstIntroRef.current = false
    setIntroComplete(true)
    setPhase('ready')
  }, [])

  const openPortfolio = useCallback(() => {
    setPortfolioOpen(true)
    manualCloseRef.current = true
    setPanelMode('hidden')
  }, [])

  const closePortfolio = useCallback(() => setPortfolioOpen(false), [])

  // Return to splash -- only resets camera on very first visit
  const goToSplash = useCallback(() => {
    setPhase('splash')
    setSection('about')
    setPanelMode('normal')
    manualCloseRef.current = false
    setPortfolioOpen(false)
    // Only reset introComplete on first visit so camera doesn't re-animate
    if (firstIntroRef.current) setIntroComplete(false)
  }, [])

  // Cycle sidebar: normal -> expanded -> hidden -> normal
  const cycleMode = useCallback(() => {
    setPanelMode(m => {
      if (m === 'normal') return 'expanded'
      if (m === 'expanded') {
        manualCloseRef.current = true
        return 'hidden'
      }
      manualCloseRef.current = false
      return 'normal'
    })
  }, [])

  const closeSidebarManually = useCallback(() => {
    manualCloseRef.current = true
    setPanelMode('hidden')
  }, [])

  // Only auto-reset panel mode on section change if user didn't manually close
  useEffect(() => {
    if (!manualCloseRef.current) setPanelMode('normal')
  }, [section])

  // Arrow keys: Left/Right navigate sections, Up opens web view
  useEffect(() => {
    const fn = e => {
      if (phase !== 'ready') return
      if (portfolioOpen) {
        if (e.key === 'Escape') closePortfolio()
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        setSection(s => SECTIONS[(SECTIONS.indexOf(s) + 1) % SECTIONS.length])
      } else if (e.key === 'ArrowLeft') {
        setSection(s => SECTIONS[(SECTIONS.indexOf(s) - 1 + SECTIONS.length) % SECTIONS.length])
      } else if (e.key === 'ArrowUp') {
        openPortfolio()
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [phase, portfolioOpen, openPortfolio, closePortfolio])

  // D key: enter debug mode, or (if already in debug) reload page to reset everything
  useEffect(() => {
    const fn = e => {
      if (e.key !== 'd' && e.key !== 'D') return
      if (phase === 'splash') return
      if (debugMode) {
        window.location.reload()
      } else {
        setDebugMode(true)
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [phase, debugMode])

  // Global fixed tooltip
  useEffect(() => {
    const tip = tooltipRef.current
    if (!tip) return
    const show = e => {
      const el = e.target.closest('[data-tip]')
      if (!el) return
      const rect = el.getBoundingClientRect()
      tip.style.left    = (rect.left + rect.width / 2) + 'px'
      tip.style.top     = (rect.bottom + 8) + 'px'
      tip.textContent   = el.dataset.tip
      tip.style.opacity = '1'
    }
    const hide = e => {
      if (!e.relatedTarget?.closest?.('[data-tip]')) tip.style.opacity = '0'
    }
    document.addEventListener('mouseover', show)
    document.addEventListener('mouseout',  hide)
    return () => {
      document.removeEventListener('mouseover', show)
      document.removeEventListener('mouseout',  hide)
    }
  }, [])

  const handleCarPositionChange = useCallback((index, newPos) => {
    setCarPositions(prev => {
      const next = [...prev]
      next[index] = newPos
      return next
    })
  }, [])

  const handleDragEnd = useCallback(() => setDragIndex(null), [])

  // Scroll wheel adjusts Y of the selected car while dragging
  useEffect(() => {
    if (dragIndex === null) return
    const fn = e => {
      e.preventDefault()
      setCarPositions(prev => {
        const next = [...prev]
        const step = -e.deltaY * 0.0004
        next[dragIndex] = [next[dragIndex][0], +(next[dragIndex][1] + step).toFixed(4), next[dragIndex][2]]
        return next
      })
    }
    window.addEventListener('wheel', fn, { passive: false })
    return () => window.removeEventListener('wheel', fn)
  }, [dragIndex])

  const splashDone = phase !== 'splash'
  const bioVisible = phase === 'ready' && panelMode === 'hidden'

  return (
    <div style={{ width: '100vw', height: '100vh', fontFamily: 'Imprima, sans-serif' }}>

      {/* -- 3D Canvas -- */}
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
          {CAR_CONFIGS.map((cfg, i) => (
            <Car
              key={cfg.id}
              url={cfg.url}
              position={carPositions[i]}
              rotation={cfg.rot}
              scale={cfg.scale}
              onPointerDown={debugMode ? (e => { e.stopPropagation(); setDragIndex(i) }) : undefined}
            />
          ))}
          <BlobShadow position={[-0.5,   -0.225,  0.46]}  width={0.665} length={0.36} opacity={0.85} />
          <BlobShadow position={[-0.397, -0.225,  0.008]} width={0.665} length={0.36} opacity={0.85} yRotation={-43 * DEG} />
          <BlobShadow position={[-0.055,  -0.225, -0.15]}  width={0.665} length={0.46} opacity={0.85} yRotation={70 * DEG} />
          {debugMode && (
            <DebugScene
              carPositions={carPositions}
              dragIndex={dragIndex}
              onCarPositionChange={handleCarPositionChange}
              onDragEnd={handleDragEnd}
            />
          )}
          <Preload all />
        </Suspense>
        <SceneControls
          section={section}
          startIntro={splashDone}
          introComplete={introComplete}
          onIntroComplete={onIntroComplete}
          debugInfoRef={debugInfoRef}
          debugMode={debugMode}
          dragIndex={dragIndex}
        />
        <AdaptiveDpr pixelated />
      </Canvas>

      {/* -- Debug overlay -- */}
      {debugMode && (
        <DebugOverlay
          debugInfoRef={debugInfoRef}
          carPositions={carPositions}
          dragIndex={dragIndex}
        />
      )}

      {/* -- Vignette -- */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: 'radial-gradient(ellipse at 40% 60%, transparent 22%, rgba(0,0,0,0.78) 100%)',
      }} />

      {/* -- Splash overlay -- */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        pointerEvents: splashDone ? 'none' : 'auto',
        opacity: splashDone ? 0 : 1,
        transition: 'opacity 0.85s ease',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'rgba(0,0,0,0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
            <div style={{
              width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
              boxShadow: '0 0 0 2px white', flexShrink: 0,
            }}>
              <img src={a('/assets/profile_picture_landing.jpg')} alt={profile.name} style={{
                width: '120%', height: 'auto',
                position: 'relative', top: '-86px', left: '-5px',
              }} />
            </div>
            <div style={{ paddingTop: 28 }}>
              <h1 style={{
                fontFamily: 'Imprima, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#fff', textShadow: '0 0 24px rgba(255,255,255,0.5)',
                marginBottom: 14, lineHeight: 1.1,
              }}>
                {profile.name}
              </h1>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'rgba(255,255,255,0.72)', fontFamily: 'Imprima, sans-serif',
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)', marginBottom: 8,
              }}>
                <img src={a('/assets/laptop.svg')} alt="" style={{
                  width: 18, height: 18, flexShrink: 0,
                  filter: 'brightness(0) invert(1)', opacity: 0.8,
                }} />
                {profile.title}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'rgba(255,255,255,0.5)', fontFamily: 'Imprima, sans-serif',
                fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
              }}>
                <img src={a('/assets/location_icon.svg')} alt="" style={{
                  width: 15, height: 15, flexShrink: 0,
                  filter: 'brightness(0) invert(1)', opacity: 0.6,
                }} />
                {profile.location}
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => setPhase('intro')}
          style={{
            position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            cursor: 'pointer', animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <span style={{
            fontFamily: 'Imprima, sans-serif', fontSize: '0.85rem',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
          }}>press any key to continue</span>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path d="M2 2l8 8 8-8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {!splashDone && <SplashKeyListener onEnter={() => setPhase('intro')} />}

      {/* -- Backdrop -- click outside sidebar to close it -- */}
      {splashDone && panelMode !== 'hidden' && !portfolioOpen && (
        <div
          onClick={closeSidebarManually}
          style={{ position: 'fixed', inset: 0, zIndex: 24, cursor: 'default' }}
        />
      )}

      {/* -- Top nav -- */}
      <SectionNav
        section={section}
        onSection={s => { setSection(s); manualCloseRef.current = false }}
        disabled={!splashDone}
        dimmed={splashDone && panelMode !== 'hidden'}
        onLogoClick={goToSplash}
      />

      {/* -- Bottom-left identity -- visible only when sidebar is hidden -- */}
      <div style={{
        position: 'fixed', bottom: 36, left: 44, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 28,
        pointerEvents: 'none',
        opacity: bioVisible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 2px white', flexShrink: 0,
        }}>
          <img src={a('/assets/profile_picture_landing.jpg')} alt={profile.name} style={{
            width: '120%', height: 'auto',
            position: 'relative', top: '-50px', left: '-5px',
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)', color: '#fff',
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
        </div>
      </div>

      {/* -- Left-edge social column -- */}
      <div style={{
        position: 'fixed', left: 20, top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        opacity: bioVisible ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: bioVisible ? 'auto' : 'none',
      }}>
        {social.map(({ href, icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
            style={{ display: 'inline-flex' }}>
            <img src={icon} alt={label} style={{
              width: 26, height: 26,
              filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.4))',
              opacity: 1, transition: 'filter 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,1))' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}
            />
          </a>
        ))}
      </div>

      {/* -- Side panel -- */}
      {splashDone && <SidePanel
        section={section}
        onSection={s => { setSection(s); manualCloseRef.current = false }}
        showAbout={splashDone}
        panelMode={panelMode}
        onCycleMode={cycleMode}
        onManualClose={closeSidebarManually}
      />}

      {/* -- up prompt -- */}
      {phase === 'ready' && !portfolioOpen && section === 'about' && panelMode === 'hidden' && (
        <EnterPrompt onEnter={openPortfolio} />
      )}

      <FullPortfolio visible={portfolioOpen} onClose={closePortfolio} />

      {/* -- Global tooltip -- */}
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed', zIndex: 9999,
          background: 'rgba(0,0,0,0.92)', color: '#fff',
          padding: '3px 9px', borderRadius: 4, fontSize: 11,
          fontFamily: 'Imprima, sans-serif', whiteSpace: 'nowrap',
          pointerEvents: 'none', opacity: 0,
          transition: 'opacity 0.15s ease',
          border: '1px solid rgba(255,255,255,0.14)',
          letterSpacing: '0.05em',
          transform: 'translateX(-50%)',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.65; transform: translateX(-50%) translateY(0); }
          50%       { opacity: 1;    transform: translateX(-50%) translateY(5px); }
        }
        @keyframes promptFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

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
