import { useEffect, useState } from 'react'
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

// panelMode: 'normal' | 'expanded' | 'hidden'
// cycle: normal → expanded → hidden → normal

export default function SidePanel({ section, showAbout }) {
  const [rendered,   setRendered]   = useState(section)
  const [panelMode,  setPanelMode]  = useState('normal')

  useEffect(() => {
    if (section !== 'about' || showAbout) setRendered(section)
  }, [section, showAbout])

  // Reset to normal when section changes
  useEffect(() => { setPanelMode('normal') }, [section])

  const open  = panelMode !== 'hidden' && (section !== 'about' || showAbout)
  const width = panelMode === 'expanded' ? WIDTH_EXPANDED : WIDTH_NORMAL
  const meta  = SECTION_META[rendered] ?? SECTION_META.about

  const cycleMode = () => {
    setPanelMode(m => {
      if (m === 'normal')   return 'expanded'
      if (m === 'expanded') return 'hidden'
      return 'normal'
    })
  }

  // Chevron: left = expand/open, right = collapse/close
  const chevronLeft  = <path d="M8 2L4 6l4 4" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  const chevronRight = <path d="M4 2l4 4-4 4" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0,
      width,
      zIndex: 26,
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      overflow: 'visible',
      pointerEvents: open ? 'auto' : 'none',
    }}>

      {/* Left-edge toggle tab */}
      <button
        onClick={cycleMode}
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

        {/* Header */}
        <div style={{
          padding: '22px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'Imprima, sans-serif',
              fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
              color: '#fff',
              textShadow: `0 0 20px ${meta.accent === '#fff' ? 'rgba(255,255,255,0.5)' : meta.accent + '60'}`,
              letterSpacing: '0.02em',
            }}>
              {meta.label}
            </div>
            <div style={{
              width: 32, height: 2, marginTop: 6,
              background: meta.accent,
              boxShadow: `0 0 8px ${meta.accent}`,
            }} />
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{
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

// ─── About section (shown in sidebar when section = about) ────
function AboutSection() {
  return (
    <div style={{ padding: '28px 24px 48px' }}>
      {/* Profile block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 2px white', flexShrink: 0,
        }}>
          <img src={profile.avatar} alt={profile.name} style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
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

      {/* Social */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
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

      {/* Tech stack — compact icon grid */}
      {Object.entries(skills).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: 9, letterSpacing: '0.22em',
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
