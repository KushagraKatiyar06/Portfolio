import { useEffect, useState } from 'react'
import { profile, social, skills, experiences, projects } from '../../data/portfolio'
import { a } from '../../utils/asset'

// ─── Highlight numbers in bullet text ─────────────────────────
function hl(text) {
  return text.replace(
    /\$[\d,.]+(?:\s*→\s*\$[\d,.]+)?|\d+[×x]|\d+%|\d[\d,]*\+|\b\d{3,}\b/g,
    m => {
      if (m.startsWith('$') || /\d+[×x]$/.test(m))
        return `<span style="color:#ff9361;text-shadow:0 0 6px rgba(255,147,97,0.4)">${m}</span>`
      if (m.endsWith('%'))
        return `<span style="color:#ffd166;text-shadow:0 0 5px rgba(255,209,102,0.4)">${m}</span>`
      return `<span style="color:#48bcff;text-shadow:0 0 6px rgba(72,188,255,0.4)">${m}</span>`
    }
  )
}

const EXP_GROUPS  = [
  { key: 'experience',  label: 'Work Experience' },
  { key: 'leadership',  label: 'Technical Leadership' },
  { key: 'involvement', label: 'Campus Involvement' },
]
const PROJ_GROUPS = [
  { key: 'live',      label: 'Live Projects' },
  { key: 'technical', label: 'Technical Projects' },
  { key: 'design',    label: 'Design Projects' },
]

// ─── Main ─────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'about',      label: 'About'      },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects'   },
]

export default function FullPortfolio({ visible, onClose, section, onSection, onLogoClick }) {
  const [inDom,   setInDom]   = useState(false)
  const [show,    setShow]    = useState(false)
  const [mainTab, setMainTab] = useState('bio')
  const [expTab,  setExpTab]  = useState('experience')
  const [projTab, setProjTab] = useState('live')

  // Mount/unmount with slide animation
  useEffect(() => {
    if (visible) {
      setInDom(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
      const t = setTimeout(() => setInDom(false), 600)
      return () => clearTimeout(t)
    }
  }, [visible])

  // Any key closes overlay (skip pure modifier keys)
  useEffect(() => {
    if (!visible) return
    const fn = e => {
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return
      onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [visible, onClose])

  if (!inDom) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(6,6,6,0.97)',
      display: 'flex', flexDirection: 'column',
      transform: show ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
      overflow: 'hidden', fontFamily: 'Imprima, sans-serif',
    }}>

      {/* ── Main body (sidebar + content) ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left sidebar ── */}
        <aside style={{
          width: 230, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          padding: '40px 24px 32px', gap: 16,
          overflowY: 'auto',
        }}>
          {/* Profile image — click returns to splash */}
          <div
            onClick={() => { onLogoClick?.(); onClose() }}
            title="Back to splash"
            style={{
              width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
              boxShadow: '0 0 0 2px white',
              alignSelf: 'center', flexShrink: 0,
              cursor: 'pointer', transition: 'transform 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <img src={profile.avatar} alt={profile.name} style={{
              width: '120%', height: 'auto',
              position: 'relative', top: '-86px', left: '-5px',
            }} />
          </div>

          {/* Name — centered */}
          <div style={{
            fontSize: 'clamp(1.1rem,2vw,1.5rem)', color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.5)', lineHeight: 1.2,
            alignSelf: 'center', textAlign: 'center',
          }}>
            {profile.name}
          </div>

          {/* Specialty — left-aligned */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', lineHeight: 1.5,
          }}>
            <img src={a('/assets/laptop.svg')} alt="" style={{
              width: 14, height: 14, flexShrink: 0, marginTop: 2,
              filter: 'brightness(0) invert(1)', opacity: 0.7,
            }} />
            {profile.title}
          </div>

          {/* Location — left-aligned, icon lines up with laptop icon */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem',
          }}>
            <img src={a('/assets/location_icon.svg')} alt="" style={{
              width: 14, height: 14, flexShrink: 0,
              filter: 'brightness(0) invert(1)', opacity: 0.5,
            }} />
            {profile.location}
          </div>

          <div style={{ flex: 1 }} />
        </aside>

        {/* ── Right panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Top bar: social links + resume */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              {social.map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                  className="link-icon">
                  <img src={icon} alt={label} style={{
                    width: 24, height: 24,
                    filter: 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(255,255,255,0.3))',
                    opacity: 0.7,
                  }} />
                </a>
              ))}
            </div>

            {/* Section nav — controls the 3D scene section */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {NAV_SECTIONS.map(({ id, label }) => {
                const active = section === id
                return (
                  <button key={id} onClick={() => onSection?.(id)} style={{
                    background: active ? 'rgba(255,255,255,0.1)' : 'none',
                    border: '1px solid ' + (active ? 'rgba(255,255,255,0.3)' : 'transparent'),
                    borderRadius: 20, padding: '5px 16px', cursor: 'pointer',
                    fontFamily: 'Imprima, sans-serif', fontSize: '0.88rem',
                    color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                    textShadow: active ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Resume button */}
            <a href={profile.resume} target="_blank" rel="noreferrer" className="resume-btn">
              <img src={a('/assets/resume.svg')} alt="" style={{
                width: 20, height: 20,
                filter: 'brightness(0) invert(1)', opacity: 0.8,
              }} />
              <span style={{ color: '#fff', fontSize: '0.88rem', letterSpacing: '0.04em' }}>
                View Resume
              </span>
            </a>
          </div>

          {/* Main tabs */}
          <nav style={{
            display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '0 36px', flexShrink: 0,
          }}>
            {[{ id: 'bio', label: 'Bio' }, { id: 'experience', label: 'Experience' }, { id: 'projects', label: 'Projects' }]
              .map(({ id, label }) => {
                const active = mainTab === id
                return (
                  <button key={id} onClick={() => setMainTab(id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'Imprima,sans-serif',
                    fontSize: 'clamp(0.88rem,1.4vw,1.05rem)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.38)',
                    textShadow: active ? '0 0 12px rgba(255,255,255,0.6)' : 'none',
                    padding: '18px 24px 16px', position: 'relative',
                    transition: 'color 0.25s,text-shadow 0.25s',
                  }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
                  >
                    {label}
                    <span style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                      background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.25s ease', transformOrigin: 'left',
                    }} />
                  </button>
                )
              })}
          </nav>

          {/* Tab content */}
          <div className="v1-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {mainTab === 'bio'        && <BioTab />}
            {mainTab === 'experience' && <ExperienceTab expTab={expTab} setExpTab={setExpTab} />}
            {mainTab === 'projects'   && <ProjectsTab projTab={projTab} setProjTab={setProjTab} />}
          </div>
        </div>
      </div>

      {/* ── Bottom close indicator ── */}
      <div
        onClick={onClose}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '10px 0 14px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          cursor: 'pointer', flexShrink: 0,
          opacity: 0.4, transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path d="M2 2l8 8 8-8" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

// ─── Bio ─────────────────────────────────────────────────────
function BioTab() {
  return (
    <div style={{ padding: '40px 48px' }}>
      <SectionHeading>About Me</SectionHeading>
      <p style={{
        fontSize: 'clamp(0.95rem,1.5vw,1.05rem)', color: 'rgba(255,255,255,0.78)',
        lineHeight: 1.8, maxWidth: 720, marginBottom: 48,
      }}>
        {profile.bio}
      </p>
      <SectionHeading>Tech Stack</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {Object.entries(skills).map(([cat, items]) => (
          <div key={cat}>
            <div style={{
              fontSize: '0.78rem', letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', marginBottom: 14,
            }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {items.map(({ label, icon }) => (
                <div key={label} className="v1-icon" data-tip={label} style={{ padding: 4 }}>
                  <img src={icon} alt={label} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Experience ───────────────────────────────────────────────
function ExperienceTab({ expTab, setExpTab }) {
  const items = experiences.filter(e => e.type === expTab)
  return (
    <div style={{ padding: '32px 48px' }}>
      <SubTabBar tabs={EXP_GROUPS} active={expTab} setActive={setExpTab} accent="#b187ff" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 28 }}>
        {items.map((item, i) => <ExperienceCard key={i} item={item} />)}
      </div>
    </div>
  )
}

function ExperienceCard({ item }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.13)', background: 'rgba(0,0,0,0.45)',
      padding: '22px 24px', display: 'flex', gap: 20,
    }}>
      <div style={{
        width: 60, height: 60, flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        {item.logo
          ? <img src={item.logo} alt={item.org} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.2)' }}>○</span>}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'clamp(0.95rem,1.5vw,1.1rem)', color: '#fff',
          textShadow: '0 0 8px rgba(255,255,255,0.5)', marginBottom: 3,
        }}>
          {item.role}
        </div>
        <div style={{
          fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
          marginBottom: 14, letterSpacing: '0.03em',
        }}>
          {item.org}&nbsp;·&nbsp;{item.duration}&nbsp;·&nbsp;{item.location}
        </div>
        <ul style={{
          margin: '0 0 16px', padding: '0 0 0 16px',
          color: 'rgba(255,255,255,0.72)', fontSize: '0.88rem', lineHeight: 2,
        }}>
          {item.bullets.map((b, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: hl(b) }} />
          ))}
        </ul>
        {item.stack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {item.stack.map(({ label, icon }) => (
              <div key={label} className="v1-icon" data-tip={label}>
                <img src={icon} alt={label} style={{ width: 22, height: 22, objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────
function ProjectsTab({ projTab, setProjTab }) {
  const items = projects[projTab] ?? []
  return (
    <div style={{ padding: '32px 48px' }}>
      <SubTabBar tabs={PROJ_GROUPS} active={projTab} setActive={setProjTab} accent="#48bcff" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 28, alignItems: 'flex-start' }}>
        {items.map((item, i) => <ProjectCard key={i} item={item} />)}
      </div>
    </div>
  )
}

function ProjectCard({ item }) {
  const primaryLink = item.live || item.video || null
  return (
    <div style={{
      width: 'clamp(280px,30%,340px)',
      border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {item.badge && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: 'linear-gradient(135deg,#f5d020,#e8a800)',
          color: '#1a1100', fontSize: '0.58rem',
          fontFamily: 'Imprima,sans-serif', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '3px 7px',
          boxShadow: '0 0 10px rgba(245,208,32,0.55)',
        }}>
          {item.badge}
        </div>
      )}

      {/* Project image — clickable */}
      {item.image && (
        <a href={primaryLink} target="_blank" rel="noreferrer"
          style={{ display: 'block', cursor: primaryLink ? 'pointer' : 'default' }}>
          <img src={item.image} alt={item.name} style={{
            width: '94%', margin: '8px auto 0', display: 'block',
            border: '1px solid rgba(255,255,255,0.15)',
            aspectRatio: '16/9', objectFit: 'cover',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { if (primaryLink) e.currentTarget.style.opacity = '0.8' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          />
        </a>
      )}

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Name row */}
        <span style={{
          fontSize: 'clamp(0.95rem,1.5vw,1.1rem)', color: '#fff',
          textShadow: '0 0 8px rgba(255,255,255,0.4)',
        }}>
          {item.name}
        </span>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.03em' }}>
          {item.subtitle}
        </div>

        {/* Icon-only links + Link button */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
          {item.live && (
            <a href={item.live} target="_blank" rel="noreferrer"
              style={{
                fontFamily: 'Imprima,sans-serif', fontSize: '0.7rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                textDecoration: 'none', color: '#48bcff',
                padding: '3px 9px', border: '1px solid rgba(72,188,255,0.4)',
                borderRadius: 4, transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(72,188,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Link ↗
            </a>
          )}
          {item.github && <a href={item.github} target="_blank" rel="noreferrer" title="GitHub" className="link-icon"><img src={a('/assets/github_icon.svg')} alt="GitHub" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /></a>}
          {item.video  && <a href={item.video}  target="_blank" rel="noreferrer" title="Demo"   className="link-icon"><img src={a('/assets/video.svg')}       alt="Demo"   style={{ width: 24, height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /></a>}
          {item.figma  && <a href={item.figma}  target="_blank" rel="noreferrer" title="Figma"  className="link-icon"><img src={a('/assets/figma.svg')}        alt="Figma"  style={{ width: 24, height: 24, objectFit: 'contain' }} /></a>}
        </div>

        {/* Stack icons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 2 }}>
          {item.stack?.map(({ label, icon }) => (
            <div key={label} className="v1-icon" data-tip={label}>
              <img src={icon} alt={label} style={{ width: 20, height: 20, objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: 'Imprima,sans-serif', fontWeight: 400,
      fontSize: 'clamp(1.1rem,2vw,1.4rem)', color: '#fff',
      textShadow: '0 0 16px rgba(255,255,255,0.35)',
      marginBottom: 22, marginTop: 0, letterSpacing: '0.02em',
    }}>
      {children}
    </h2>
  )
}

function SubTabBar({ tabs, active, setActive, accent }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      {tabs.map(({ key, label }) => {
        const isActive = active === key
        return (
          <button key={key} onClick={() => setActive(key)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Imprima,sans-serif', fontSize: '0.85rem', letterSpacing: '0.04em',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
            padding: '10px 22px 9px', position: 'relative',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
          >
            {label}
            <span style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: accent, boxShadow: `0 0 8px ${accent}`,
              transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.25s ease', transformOrigin: 'left',
            }} />
          </button>
        )
      })}
    </div>
  )
}
