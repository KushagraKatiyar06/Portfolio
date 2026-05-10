import { useEffect, useRef, useState } from 'react'
import ExperienceSection from './ExperienceSection'
import ProjectsSection from './ProjectsSection'
import { profile, social, skills } from '../../data/portfolio'
import { a } from '../../utils/asset'

const SECTION_META = {
  about:      { label: 'About',      accent: '#fff' },
  experience: { label: 'Experience', accent: '#b187ff' },
  projects:   { label: 'Projects',   accent: '#48bcff' },
}

const WIDTH_NORMAL   = 520
const WIDTH_EXPANDED = 860

const NAV_ITEMS = [
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
]

export default function SidePanel({ section, onSection, showAbout, panelMode, onCycleMode, onManualClose }) {
  const [rendered, setRendered] = useState(section)
  const outerRef  = useRef()
  const dragState = useRef({ active: false, startX: 0 })

  useEffect(() => {
    if (section !== 'about' || showAbout) setRendered(section)
  }, [section, showAbout])

  const open  = panelMode !== 'hidden' && (section !== 'about' || showAbout)
  const width = panelMode === 'expanded' ? WIDTH_EXPANDED : WIDTH_NORMAL
  const meta  = SECTION_META[rendered] ?? SECTION_META.about

  // Drag-to-close: attach to the panel header so it doesn't conflict with scrolling
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

      {/* Left-edge toggle tab — always pointer events so user can reopen */}
      <button
        onClick={onCycleMode}
        title={panelMode === 'normal' ? 'Expand' : panelMode === 'expanded' ? 'Close' : 'Open'}
        style={{
          position: 'absolute',
          left: -32, top: '50%',
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

      {/* Panel body */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* Header — drag handle + full-width section nav */}
        <div
          onMouseDown={handleDragStart}
          style={{
            flexShrink: 0,
            cursor: 'grab', userSelect: 'none',
          }}
        >
          {/* 3-column nav */}
          <div style={{ display: 'flex' }}>
            {NAV_ITEMS.map(({ id, label }) => {
              const active = section === id
              const itemAccent = SECTION_META[id].accent
              return (
                <button
                  key={id}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={() => onSection?.(id)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    padding: '18px 8px 14px',
                    cursor: 'pointer',
                    fontFamily: 'Imprima, sans-serif',
                    fontSize: active ? 'clamp(0.9rem, 1.6vw, 1.1rem)' : 'clamp(0.72rem, 1.2vw, 0.85rem)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.32)',
                    textShadow: active
                      ? `0 0 18px ${itemAccent === '#fff' ? 'rgba(255,255,255,0.55)' : itemAccent + '90'}`
                      : 'none',
                    letterSpacing: '0.02em',
                    transition: 'color 0.3s ease, font-size 0.3s ease, text-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Sliding indicator line */}
          <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.07)' }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: `${100 / NAV_ITEMS.length}%`,
              height: '100%',
              background: meta.accent,
              boxShadow: `0 0 10px ${meta.accent}`,
              transform: `translateX(${NAV_ITEMS.findIndex(n => n.id === section) * 100}%)`,
              transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease',
            }} />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="v1-scroll" style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.08) transparent',
        }}>
          {rendered === 'about'      && <AboutSection />}
          {rendered === 'experience' && <ExperienceSection expanded={panelMode === 'expanded'} />}
          {rendered === 'projects'   && <ProjectsSection expanded={panelMode === 'expanded'} />}
        </div>
      </div>
    </div>
  )
}

// ─── About section ────────────────────────────────────────────
function AboutSection() {
  return (
    <div style={{ padding: '28px 24px 48px' }}>

      {/* Profile block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 2px white', flexShrink: 0,
        }}>
          <img src={a('/assets/profile_picture_landing.jpg')} alt={profile.name} style={{
            width: '120%', height: 'auto',
            position: 'relative', top: '-41px', left: '-5px',
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: '1.1rem', color: '#fff',
            textShadow: '0 0 12px rgba(255,255,255,0.4)',
            lineHeight: 1.2, marginBottom: 4,
          }}>
            {profile.name}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem',
            fontFamily: 'Imprima, sans-serif', marginBottom: 3,
          }}>
            <img src={a('/assets/laptop.svg')} alt="" style={{
              width: 12, height: 12, filter: 'brightness(0) invert(1)', opacity: 0.7,
            }} />
            {profile.title}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem',
            fontFamily: 'Imprima, sans-serif',
          }}>
            <img src={a('/assets/location_icon.svg')} alt="" style={{
              width: 11, height: 11, filter: 'brightness(0) invert(1)', opacity: 0.5,
            }} />
            {profile.location}
          </div>
        </div>
      </div>

      {/* Social links */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        {social.map(({ href, icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" title={label} className="link-icon">
            <img src={icon} alt={label} style={{
              width: 22, height: 22,
              filter: 'brightness(0) invert(1) drop-shadow(0 0 4px rgba(255,255,255,0.35))',
              opacity: 0.7,
            }} />
          </a>
        ))}
      </div>

      {/* Resume download — matching V1 style */}
      <a
        href={profile.resume}
        download
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 24, padding: '7px 16px',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 6, textDecoration: 'none',
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.75rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)',
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
          e.currentTarget.style.color = 'rgba(255,255,255,0.78)'
        }}
      >
        <img
          src={a('/assets/resume.svg')}
          alt=""
          style={{ width: 15, height: 15, filter: 'brightness(0) invert(1)', opacity: 0.8 }}
        />
        View Resume
      </a>

      {/* Bio */}
      <div style={{
        fontFamily: 'Imprima, sans-serif',
        fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.7, marginBottom: 28,
        borderLeft: '2px solid rgba(255,255,255,0.15)',
        paddingLeft: 14,
      }}>
        {profile.bio}
      </div>

      {/* Tech stack icon grid */}
      {Object.entries(skills).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
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
