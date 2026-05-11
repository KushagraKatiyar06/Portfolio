import { useEffect, useRef, useState } from 'react'
import { profile, social, skills, experiences, projects } from '../../data/portfolio'
import { a } from '../../utils/asset'

// ─── Tech terms highlighted blue in bullets ───────────────────
const TECH_TERMS = [
  'Agentic AI', 'GPT-4o', 'GPT-2', 'Next.js 14', 'Next.js 15', 'React 19',
  'AWS Polly', 'Flux-Schnell', 'Socket.io', 'Gmail API', 'Google Sheets', 'Google Forms',
  'Google Cloud', 'Google Service Accounts', 'Launch Library 2',
  'DaVinci Resolve', 'MediaPipe', 'PostgreSQL', 'TypeScript', 'JavaScript',
  'Cloudflare', 'TensorFlow', 'Supabase', 'OAuth2', 'Android', 'AdobeXD',
  'ShadCN', 'Framer', 'Figma', 'Next.js', 'Node.js', 'OpenCV', 'OpenAI',
  'Gemini', 'Docker', 'Kotlin', 'Angular', 'Ionic', 'Pydantic',
  'Python', 'Flask', 'FFmpeg', 'Canva', 'Notion', 'Scrum', 'React',
  'GCP', 'AWS', 'LLM', 'RAG', 'OBS',
]

// ─── Highlight numbers (orange/golden) + tech terms (blue) ───
function hl(text) {
  // Numbers: all → orange, % → golden, strip commas
  let result = text.replace(
    /\$[\d,]+(?:\s*→\s*\$[\d,]+)?|\b\d[\d,]*[×xX%+]|\b\d[\d,]*\b/g,
    m => {
      const clean = m.replace(/,/g, '')
      if (m.endsWith('%'))
        return `<span style="color:#ffd166;text-shadow:0 0 5px rgba(255,209,102,0.4)">${clean}</span>`
      return `<span style="color:#ff9361;text-shadow:0 0 6px rgba(255,147,97,0.4)">${clean}</span>`
    }
  )
  // Tech terms in non-span portions
  const parts = result.split(/(<span\b[^>]*>[\s\S]*?<\/span>)/g)
  return parts.map((part, i) => {
    if (i % 2 === 1) return part
    for (const term of TECH_TERMS) {
      const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      part = part.replace(
        new RegExp(`\\b${esc}\\b`, 'g'),
        `<span style="color:#48bcff;text-shadow:0 0 6px rgba(72,188,255,0.35);font-style:italic">${term}</span>`
      )
    }
    return part
  }).join('')
}

// ─── Phrase highlights in bio ─────────────────────────────────
const BIO_PHRASES = [
  { phrase: 'Computer Science at the University of Florida', color: '#b187ff' },
  { phrase: 'Agentic AI Systems',                           color: '#b187ff' },
  { phrase: 'Full Stack Development',                       color: '#48bcff' },
  { phrase: 'UI/UX Design',                                color: '#ffd166' },
  { phrase: 'gaming, cars, and Taekwondo',                  color: '#ff9361' },
  { phrase: '500,000',                                      color: '#ffd166' },
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

// ─── Section definitions with per-section accent colors ──────
const NAV_TABS = [
  { id: 'about',      label: 'About'      },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects'   },
]

const EXP_GROUPS = [
  { key: 'experience',      label: 'Professional Experience', accent: '#48bcff' },
  { key: 'extracurricular', label: 'Extracurriculars',       accent: '#ffd166' },
  { key: 'leadership',      label: 'Leadership',              accent: '#b187ff' },
]

const PROJ_GROUPS = [
  { key: 'live',      label: 'Live',      accent: '#48bcff' },
  { key: 'technical', label: 'Technical', accent: '#b187ff' },
  { key: 'design',    label: 'Design',    accent: '#ffd166' },
]

// ─── Resume button ────────────────────────────────────────────
function ResumeButton() {
  return (
    <a href={profile.resume} target="_blank" rel="noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '6px 14px',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 6, textDecoration: 'none',
      fontFamily: 'Imprima, sans-serif',
      fontSize: '0.72rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)',
      transition: 'background 0.2s, border-color 0.2s, color 0.2s',
      background: 'transparent', flexShrink: 0, whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.72)' }}
    >
      <img src={a('/assets/resume.svg')} alt="" style={{ width: 13, height: 13, filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
      View Resume
    </a>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function FullPortfolio({ visible, onClose, section, onSection, onLogoClick }) {
  const [inDom,        setInDom]        = useState(false)
  const [show,         setShow]         = useState(false)
  const [tab,          setTab]          = useState('about')
  const [expTab,       setExpTab]       = useState('experience')
  const [projTab,      setProjTab]      = useState('live')
  const [flashing,     setFlashing]     = useState(false)
  const [transitionKey, setTransKey]   = useState(0)
  const [isMobile,     setIsMobile]    = useState(false)
  const flashTimer = useRef(null)
  const flashKey = useRef(0)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (visible) {
      if (section && NAV_TABS.find(n => n.id === section)) setTab(section)
      setInDom(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
      const t = setTimeout(() => setInDom(false), 900)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const fn = e => {
      if (e.key === 'Escape' || e.key === 'ArrowDown') onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [visible, onClose])

  function triggerFlash() {
    flashKey.current++
    clearTimeout(flashTimer.current)
    setFlashing(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setFlashing(true)))
    flashTimer.current = setTimeout(() => setFlashing(false), 600)
  }

  const switchTab = id => {
    if (id === tab) return
    triggerFlash()
    setTab(id)
    setTransKey(k => k + 1)
    onSection?.(id)
  }

  if (!inDom) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      overflow: 'hidden', fontFamily: 'Imprima, sans-serif',
      transform: show ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: isMobile ? 'none' : `url(${a('/assets/rx7_background.jpg')})`,
        backgroundColor: '#0a0a0a',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.3) saturate(0.8)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)' }} />

      {/* Lights flash on tab change */}
      {flashing && (
        <div key={flashKey.current} style={{
          position: 'absolute', inset: 0, zIndex: 2,
          backgroundImage: `url(${a('/assets/rx7_lights_background.png')})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          mixBlendMode: 'screen', filter: 'brightness(2)',
          animation: 'lightsFlash 0.3s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      {/* Social column — right */}
      <div style={{
        position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
        zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        {social.map(({ href, icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
            style={{ display: 'inline-flex' }}>
            <img src={icon} alt={label} style={{
              width: 20, height: 20,
              filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.7))',
              opacity: 0.85, transition: 'filter 0.3s ease, opacity 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 18px rgba(255,255,255,1))' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.7))' }}
            />
          </a>
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flexDirection: 'column', height: '100%',
      }}>
        {/* ── V1-style floating navbar ── */}
        <NavBar
          tab={tab}
          switchTab={switchTab}
          onLogoClick={onLogoClick}
          onClose={onClose}
        />

        {/* Tab content — fixed height, scrollable */}
        <div className="v1-scroll" style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          paddingTop: 80, // clear navbar
          paddingRight: 48, // clear social column
        }}>
          <div key={transitionKey} style={{ animation: 'tabFadeIn 0.35s ease-out forwards' }}>
            {tab === 'about'      && <AboutTab />}
            {tab === 'experience' && <ExperienceTab expTab={expTab} setExpTab={setExpTab} />}
            {tab === 'projects'   && <ProjectsTab projTab={projTab} setProjTab={setProjTab} />}
          </div>
        </div>

        {/* Bottom close */}
        <div onClick={onClose} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          padding: '9px 0 13px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          cursor: 'pointer', flexShrink: 0,
          opacity: 0.32, transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.32'}
        >
          <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
            <path d="M2 2l8 7 8-7" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>close</span>
        </div>
      </div>
    </div>
  )
}

// ─── V1-style floating navbar ─────────────────────────────────
function NavBar({ tab, switchTab, onLogoClick, onClose }) {
  const navRef = useRef()
  return (
    <nav
      ref={navRef}
      style={{
        position: 'absolute', top: '1rem',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'row',
        alignItems: 'center', gap: '2.5rem',
        background: 'rgba(0,0,0,0)',
        border: '1px solid rgba(255,255,255,0)',
        borderRadius: 50, padding: '0.75rem 2rem',
        zIndex: 10, transition: 'all 0.4s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.82)'
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.8)'
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(0,0,0,0)'
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Profile photo → back to splash */}
      <div
        onClick={() => { onLogoClick?.(); onClose() }}
        title="Back to splash"
        style={{
          width: 50, height: 50, borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 2px white', flexShrink: 0,
          cursor: 'pointer', transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img src={a('/assets/navbar_profile_photo.jpg')} alt={profile.name} style={{
          width: '94%', height: 'auto',
          position: 'relative', top: '-16px', left: '2px',
        }} />
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {NAV_TABS.map(({ id, label }) => {
          const active = tab === id
          return (
            <button key={id} onClick={() => switchTab(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Imprima, sans-serif',
              fontSize: 'clamp(1rem, 1.4vw, 1.5rem)',
              color: active ? '#fff' : 'rgba(255,255,255,0.6)',
              textShadow: active
                ? '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.3)'
                : 'none',
              position: 'relative',
              transition: 'color 0.3s ease, text-shadow 0.3s ease, transform 0.3s ease',
              padding: '2px 0',
            }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.textShadow = '0 0 8px rgba(255,255,255,0.5)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                  e.currentTarget.style.textShadow = 'none'
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >
              {label}
              <span style={{
                position: 'absolute', bottom: -5, left: 0,
                height: 2, background: '#fff',
                boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                width: active ? '100%' : '0%',
                transition: 'width 0.3s ease',
                display: 'block',
              }} />
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ─── About ────────────────────────────────────────────────────
function AboutTab() {
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 48px 64px' }}>

      {/* Badges row + Resume on the right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'nowrap' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'nowrap' }}>
          {[
            { label: 'Agentic AI Systems',     color: '#b187ff' },
            { label: 'Full Stack Development', color: '#48bcff' },
            { label: 'UI/UX Design',           color: '#ffd166' },
          ].map(({ label, color }) => (
            <span key={label} style={{
              fontSize: '0.75rem', letterSpacing: '0.08em', whiteSpace: 'nowrap',
              color, border: `1px solid ${color}44`, padding: '5px 13px', borderRadius: 4,
              fontFamily: 'Imprima, sans-serif', textShadow: `0 0 8px ${color}55`,
              background: `${color}0a`,
            }}>
              {label}
            </span>
          ))}
        </div>
        <ResumeButton />
      </div>

      <SectionHeading>About Me</SectionHeading>
      <p
        style={{
          fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
          color: 'rgba(255,255,255,0.75)', lineHeight: 1.9,
          marginBottom: 48,
          borderLeft: '2px solid rgba(255,255,255,0.12)',
          paddingLeft: 18,
        }}
        dangerouslySetInnerHTML={{ __html: hlBio(profile.bio) }}
      />

      <SectionHeading>Tech Stack</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {Object.entries(skills).map(([cat, items]) => (
          <div key={cat}>
            <div style={{
              fontSize: '0.72rem', letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14,
            }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {items.map(({ label, icon }) => (
                <div key={label} className="v1-icon" data-tip={label}>
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
  const group  = EXP_GROUPS.find(g => g.key === expTab) ?? EXP_GROUPS[0]
  const items  = experiences.filter(e => e.type === expTab)
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 48px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <SubTabBar tabs={EXP_GROUPS} active={expTab} setActive={setExpTab} />
        <ResumeButton />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {items.map((item, i) => <ExperienceCard key={i} item={item} accent={group.accent} />)}
      </div>
    </div>
  )
}

function ExperienceCard({ item, accent }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      padding: '20px 22px', display: 'flex', gap: 18,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      <div style={{
        width: 52, height: 52, flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {item.logo
          ? <img src={item.logo} alt={item.org} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>○</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'clamp(0.92rem,1.4vw,1.05rem)', color: '#fff', textShadow: '0 0 8px rgba(255,255,255,0.4)', marginBottom: 2 }}>
          {item.role}
        </div>
        <div style={{ fontSize: '0.78rem', marginBottom: 12, letterSpacing: '0.03em' }}>
          <span style={{ color: accent }}>{item.org}</span>
          <span style={{ color: 'rgba(255,255,255,0.38)' }}>&nbsp;·&nbsp;{item.duration}&nbsp;·&nbsp;{item.location}</span>
        </div>
        <ul style={{ margin: '0 0 14px', padding: '0 0 0 16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 2 }}>
          {item.bullets.map((b, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: hl(b) }} />
          ))}
        </ul>
        {item.stack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {item.stack.map(({ label, icon }) => (
              <div key={label} className="v1-icon" data-tip={label}>
                <img src={icon} alt={label} style={{ width: 18, height: 18, objectFit: 'contain' }} />
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
  const group = PROJ_GROUPS.find(g => g.key === projTab) ?? PROJ_GROUPS[0]
  const items = projects[projTab] ?? []
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 48px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <SubTabBar tabs={PROJ_GROUPS} active={projTab} setActive={setProjTab} />
        <ResumeButton />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 22,
        alignItems: 'start',
      }}>
        {items.map((item, i) => <ProjectCard key={i} item={item} accent={group.accent} />)}
      </div>
    </div>
  )
}

function ProjectCard({ item, accent }) {
  const primaryLink = item.live || item.video || item.github || item.figma || item.drive || null
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.13)',
      background: 'rgba(0,0,0,0.48)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)' }}
    >
      {item.badge && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          background: 'linear-gradient(135deg,#f5d020,#e8a800)',
          color: '#1a1100', fontSize: '0.54rem',
          fontFamily: 'Imprima, sans-serif', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '3px 7px',
          boxShadow: '0 0 10px rgba(245,208,32,0.55)',
        }}>
          {item.badge}
        </div>
      )}
      {item.image && (
        <a href={primaryLink ?? undefined} target="_blank" rel="noreferrer"
          style={{ display: 'block', cursor: primaryLink ? 'pointer' : 'default' }}>
          <img src={item.image} alt={item.name} style={{
            width: '94%', margin: '8px auto 0', display: 'block',
            border: '1px solid rgba(255,255,255,0.1)',
            aspectRatio: '16/9', objectFit: 'cover', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { if (primaryLink) e.currentTarget.style.opacity = '0.75' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          />
        </a>
      )}
      <div style={{ padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        <span style={{ fontSize: 'clamp(0.92rem,1.3vw,1.05rem)', color: '#fff', textShadow: '0 0 8px rgba(255,255,255,0.4)' }}>
          {item.name}
        </span>
        <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}>
          {item.subtitle}
        </div>
        <div style={{ display: 'flex', gap: 9, alignItems: 'center', flexWrap: 'wrap' }}>
          {item.live && (
            <a href={item.live} target="_blank" rel="noreferrer" style={{
              fontFamily: 'Imprima,sans-serif', fontSize: '0.67rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', color: accent,
              padding: '3px 8px', border: `1px solid ${accent}55`,
              borderRadius: 4, transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = `${accent}18`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Link ↗
            </a>
          )}
          {item.github && <a href={item.github} target="_blank" rel="noreferrer" title="GitHub" className="link-icon"><img src={a('/assets/github_icon.svg')} alt="GitHub" style={{ width: 20, height: 20, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /></a>}
          {item.video  && <a href={item.video}  target="_blank" rel="noreferrer" title="Demo"   className="link-icon"><img src={a('/assets/video.svg')}       alt="Demo"   style={{ width: 20, height: 20, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /></a>}
          {item.figma  && <a href={item.figma}  target="_blank" rel="noreferrer" title="Figma"  className="link-icon"><img src={a('/assets/figma.svg')}        alt="Figma"  style={{ width: 20, height: 20, objectFit: 'contain' }} /></a>}
          {item.drive  && <a href={item.drive}  target="_blank" rel="noreferrer" title="Drive"  className="link-icon"><img src={a('/assets/drive.svg')}         alt="Drive"  style={{ width: 20, height: 20, objectFit: 'contain' }} /></a>}
        </div>
        {item.stack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {item.stack.map(({ label, icon }) => (
              <div key={label} className="v1-icon" data-tip={label}>
                <img src={icon} alt={label} style={{ width: 17, height: 17, objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: 'Imprima, sans-serif', fontWeight: 400,
      fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', color: '#fff',
      textShadow: '0 0 16px rgba(255,255,255,0.32)',
      marginBottom: 18, marginTop: 0, letterSpacing: '0.02em',
    }}>
      {children}
    </h2>
  )
}

// Each tab in SubTabBar uses its own accent color
function SubTabBar({ tabs, active, setActive }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flex: 1, marginRight: 20 }}>
      {tabs.map(({ key, label, accent }) => {
        const isActive = active === key
        return (
          <button key={key} onClick={() => setActive(key)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Imprima, sans-serif', fontSize: '0.83rem', letterSpacing: '0.04em',
            color: isActive ? accent : 'rgba(255,255,255,0.34)',
            padding: '9px 20px 8px', position: 'relative',
            transition: 'color 0.22s',
            textShadow: isActive ? `0 0 8px ${accent}66` : 'none',
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.34)' }}
          >
            {label}
            <span style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: accent, boxShadow: `0 0 8px ${accent}`,
              transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.28s ease', transformOrigin: 'left',
            }} />
          </button>
        )
      })}
    </div>
  )
}
