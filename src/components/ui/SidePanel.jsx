import { useEffect, useRef, useState } from 'react'
import ExperienceSection from './ExperienceSection'
import ProjectsSection from './ProjectsSection'
import { profile, social, skills } from '../../data/portfolio'
import { a } from '../../utils/asset'

const BIO_PHRASES = [
  { phrase: 'Computer Science at the University of Florida', color: '#ff9361' },
  { phrase: 'Agentic AI Systems',                           color: '#b187ff' },
  { phrase: 'Full Stack Development',                       color: '#48bcff' },
  { phrase: 'UI/UX Design',                                color: '#ffd166' },
  { phrase: 'my interests include gaming, cars, and Taekwondo', color: '#7CFC98' },
]

function hlBio(text) {
  let parts = [{ text, hi: false }]
  for (const { phrase, color } of BIO_PHRASES) {
    const next = []
    for (const p of parts) {
      if (p.hi) { next.push(p); continue }
      const idx = p.text.indexOf(phrase)
      if (idx === -1) { next.push(p); continue }
      if (idx > 0) next.push({ text: p.text.slice(0, idx), hi: false })
      next.push({ text: phrase, hi: true, color })
      const rest = p.text.slice(idx + phrase.length)
      if (rest) next.push({ text: rest, hi: false })
    }
    parts = next
  }
  return parts.map(p =>
    p.hi
      ? `<span style="color:${p.color};text-shadow:0 0 8px ${p.color}88">${p.text}</span>`
      : p.text
  ).join('')
}

const SECTION_ACCENT = {
  about:      '#fff',
  experience: '#b187ff',
  projects:   '#48bcff',
}

const WIDTH_NORMAL   = 520
const WIDTH_EXPANDED = 860

const NAV_ITEMS = [
  { id: 'about',      label: 'About'      },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects'   },
]

export default function SidePanel({ section, onSection, showAbout, panelMode, onCycleMode, onManualClose, onLogoClick }) {
  const [rendered,      setRendered]  = useState(section)
  const [transitionKey, setTransKey]  = useState(0)
  const [flashing,      setFlashing]  = useState(false)
  const prevRendered    = useRef(null)
  const outerRef        = useRef()
  const dragState       = useRef({ active: false, startX: 0 })
  const flashKey        = useRef(0)
  const flashTimer      = useRef(null)

  useEffect(() => {
    if (section !== 'about' || showAbout) setRendered(section)
  }, [section, showAbout])

  useEffect(() => {
    if (prevRendered.current !== null && prevRendered.current !== rendered) {
      setTransKey(k => k + 1)
      flashKey.current++
      clearTimeout(flashTimer.current)
      setFlashing(false)
      requestAnimationFrame(() => requestAnimationFrame(() => setFlashing(true)))
      flashTimer.current = setTimeout(() => setFlashing(false), 750)
    }
    prevRendered.current = rendered
  }, [rendered])

  const open  = panelMode !== 'hidden' && (section !== 'about' || showAbout)
  const width = panelMode === 'expanded' ? WIDTH_EXPANDED : WIDTH_NORMAL

  const handleDragStart = e => {
    if (!open) return
    dragState.current = { active: true, startX: e.clientX }
    const onMove = ev => {
      if (!dragState.current.active) return
      const delta = Math.max(0, ev.clientX - dragState.current.startX)
      if (outerRef.current) {
        outerRef.current.style.transition = 'none'
        outerRef.current.style.transform  = `translateX(${delta}px)`
      }
    }
    const onUp = ev => {
      if (!dragState.current.active) return
      dragState.current.active = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
      const delta = Math.max(0, ev.clientX - dragState.current.startX)
      if (outerRef.current) outerRef.current.style.transition = ''
      if (delta > 120) {
        onManualClose?.()
      } else {
        if (outerRef.current) outerRef.current.style.transform = 'translateX(0)'
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
  }

  const chevronLeft  = <path d="M8 2L4 6l4 4" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  const chevronRight = <path d="M4 2l4 4-4 4" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  return (
    <div
      ref={outerRef}
      style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width,
        zIndex: 26,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        overflow: 'visible',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Left-edge toggle tab */}
      <button
        onClick={onCycleMode}
        title={panelMode === 'normal' ? 'Expand' : panelMode === 'expanded' ? 'Close' : 'Open'}
        style={{
          position: 'absolute', left: -32, top: '50%',
          transform: 'translateY(-50%)',
          width: 32, height: 72,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRight: 'none',
          borderRadius: '6px 0 0 6px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'auto',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          {panelMode === 'expanded' ? chevronRight : chevronLeft}
        </svg>
      </button>

      <div style={{
        position: 'absolute', inset: 0,
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {flashing && (
          <div key={flashKey.current} style={{
            position: 'absolute', inset: 0, zIndex: 12,
            backgroundImage: `url(${a('/assets/rx7_lights_background.png')})`,
            backgroundSize: 'cover', backgroundPosition: 'right center',
            mixBlendMode: 'screen', filter: 'brightness(2)',
            animation: 'lightsFlash 0.3s ease-out forwards',
            pointerEvents: 'none',
          }} />
        )}

        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${a('/assets/rx7_background.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            filter: 'brightness(0.22) saturate(0.75)',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.58)' }} />
          <div style={{
            position: 'absolute', inset: 0,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }} />
        </div>

        {/* Header — pill nav */}
        <div
          onMouseDown={handleDragStart}
          style={{
            position: 'relative', zIndex: 1,
            flexShrink: 0, cursor: 'grab', userSelect: 'none',
            padding: '16px 20px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 30, padding: '4px 5px', gap: 2,
            }}>
              {NAV_ITEMS.map(({ id, label }) => {
                const active = section === id
                const accent = SECTION_ACCENT[id]
                return (
                  <button
                    key={id}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => onSection?.(id)}
                    style={{
                      background: active ? 'rgba(255,255,255,0.1)' : 'none',
                      border: `1px solid ${active ? 'rgba(255,255,255,0.22)' : 'transparent'}`,
                      borderRadius: 24, padding: '6px 20px', cursor: 'pointer',
                      fontFamily: 'Imprima, sans-serif', fontSize: '0.88rem',
                      color: active ? '#fff' : 'rgba(255,255,255,0.38)',
                      textShadow: active ? `0 0 10px ${accent === '#fff' ? 'rgba(255,255,255,0.5)' : accent + '80'}` : 'none',
                      letterSpacing: '0.02em',
                      transition: 'all 0.22s ease',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="v1-scroll" style={{
          position: 'relative', zIndex: 1,
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.08) transparent',
        }}>
          <div key={transitionKey} style={{ animation: transitionKey > 0 ? 'tabFadeIn 0.35s ease-out forwards' : undefined }}>
            {rendered === 'about'      && <AboutSection onLogoClick={onLogoClick} resume={profile.resume} />}
            {rendered === 'experience' && <ExperienceSection expanded={panelMode === 'expanded'} />}
            {rendered === 'projects'   && <ProjectsSection expanded={panelMode === 'expanded'} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── About section ────────────────────────────────────────────
function AboutSection({ onLogoClick, resume }) {
  return (
    <div style={{ padding: '24px 22px 48px' }}>

      {/* Profile block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div
          onClick={onLogoClick}
          title="Back to splash"
          style={{
            width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
            boxShadow: '0 0 0 2px white', flexShrink: 0,
            cursor: 'pointer', transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08)'
            e.currentTarget.style.boxShadow = '0 0 0 2px white, 0 0 12px rgba(255,255,255,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 0 0 2px white'
          }}
        >
          <img src={a('/assets/profile_picture_landing.jpg')} alt={profile.name} style={{
            width: '120%', height: 'auto',
            position: 'relative', top: '-37px', left: '-5px',
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: '1.05rem', color: '#fff',
            textShadow: '0 0 12px rgba(255,255,255,0.4)',
            lineHeight: 1.2, marginBottom: 4,
          }}>
            {profile.name}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.58)', fontSize: '0.73rem',
            fontFamily: 'Imprima, sans-serif', marginBottom: 3,
          }}>
            <img src={a('/assets/laptop.svg')} alt="" style={{ width: 11, height: 11, filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            {profile.title}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem',
            fontFamily: 'Imprima, sans-serif',
          }}>
            <img src={a('/assets/location_icon.svg')} alt="" style={{ width: 10, height: 10, filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
            {profile.location}
          </div>
        </div>
      </div>

      {/* Social links */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
        {social.map(({ href, icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" title={label} className="link-icon">
            <img src={icon} alt={label} style={{
              width: 20, height: 20,
              filter: 'brightness(0) invert(1) drop-shadow(0 0 4px rgba(255,255,255,0.35))',
              opacity: 0.7,
            }} />
          </a>
        ))}
      </div>

      {/* Specializations */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {[
          { label: 'Agentic AI', color: '#b187ff' },
          { label: 'Full Stack',  color: '#48bcff' },
          { label: 'UI/UX Design', color: '#ffd166' },
        ].map(({ label, color }) => (
          <span key={label} style={{
            fontSize: '0.68rem', letterSpacing: '0.08em',
            color, border: `1px solid ${color}44`,
            padding: '3px 10px', borderRadius: 4,
            fontFamily: 'Imprima, sans-serif',
            textShadow: `0 0 8px ${color}55`,
          }}>
            {label}
          </span>
        ))}
      </div>

      {/* Resume */}
      <a
        href={resume} download target="_blank" rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 20, padding: '6px 14px',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 6, textDecoration: 'none',
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.72rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)',
          transition: 'background 0.2s, border-color 0.2s, color 0.2s',
          background: 'transparent',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.38)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
        }}
      >
        <img src={a('/assets/resume.svg')} alt="" style={{ width: 13, height: 13, filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
        View Resume
      </a>

      {/* Bio */}
      <div
        style={{
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.62)',
          lineHeight: 1.75, marginBottom: 26,
          borderLeft: '2px solid rgba(255,255,255,0.12)',
          paddingLeft: 12,
        }}
        dangerouslySetInnerHTML={{ __html: hlBio(profile.bio) }}
      />

      {/* Tech stack icon grid */}
      {Object.entries(skills).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 18 }}>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
            marginBottom: 10,
          }}>
            {cat}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {items.map(({ label, icon }) => (
              <div key={label} className="v1-icon" data-tip={label}>
                <img src={icon} alt={label} style={{ width: 22, height: 22, objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
