import { useEffect, useRef, useState } from 'react'
import { profile, social, skills, experiences, projects } from '../../data/portfolio'
import { a } from '../../utils/asset'

// ─── Tech terms to highlight in bullets ──────────────────────
const TECH_TERMS = [
  'Agentic AI', 'GPT-4o', 'GPT-2', 'Next.js 14', 'Next.js 15', 'React 19',
  'AWS Polly', 'Flux-Schnell', 'Socket.io', 'Gmail API', 'Google Sheets', 'Google Forms',
  'MediaPipe', 'PostgreSQL', 'TypeScript', 'JavaScript', 'Cloudflare', 'TensorFlow',
  'Supabase', 'OAuth2', 'Android', 'AdobeXD', 'ShadCN', 'Framer', 'Figma',
  'Next.js', 'Node.js', 'OpenCV', 'OpenAI', 'Gemini', 'Docker', 'Kotlin',
  'Python', 'Flask', 'FFmpeg', 'Canva', 'Notion', 'Scrum', 'React',
  'GCP', 'AWS', 'LLM', 'RAG', 'OBS',
]

// ─── Highlight numbers + tech terms in bullet text ────────────
function hl(text) {
  let result = text.replace(
    /\$[\d,.]+(?:\s*→\s*\$[\d,.]+)?|\d+[×x]|\d+%|\d[\d,]*\+|\b\d{3,}\b/g,
    m => {
      if (m.startsWith('$') || /\d+[×x]$/.test(m))
        return `<span style="color:#ff9361;text-shadow:0 0 6px rgba(255,147,97,0.4)">${m}</span>`
      if (m.endsWith('%'))
        return `<span style="color:#ffd166;text-shadow:0 0 5px rgba(255,209,102,0.4)">${m}</span>`
      return `<span style="color:#48bcff;text-shadow:0 0 6px rgba(72,188,255,0.4)">${m}</span>`
    }
  )
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

// ─── Highlight specific phrases in bio ───────────────────────
const BIO_PHRASES = [
  { phrase: 'Computer Science at the University of Florida', color: '#48bcff' },
  { phrase: 'Full Stack development',                        color: '#48bcff' },
  { phrase: 'Product Management',                           color: '#ff9361' },
  { phrase: 'UI/UX Design',                                 color: '#ffd166' },
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

// ─── Nav tabs ─────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'about',      label: 'About'      },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects'   },
]

const EXP_GROUPS = [
  { key: 'experience',  label: 'Professional Experience' },
  { key: 'leadership',  label: 'Technical Leadership'    },
  { key: 'involvement', label: 'Involvement'             },
]

const PROJ_GROUPS = [
  { key: 'live',      label: 'Live'      },
  { key: 'technical', label: 'Technical' },
  { key: 'design',    label: 'Design'    },
]

// ─── Resume button (used in each section) ────────────────────
function ResumeButton() {
  return (
    <a
      href={profile.resume} target="_blank" rel="noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 16px',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 6, textDecoration: 'none',
        fontFamily: 'Imprima, sans-serif',
        fontSize: '0.73rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)',
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
        e.currentTarget.style.color = 'rgba(255,255,255,0.72)'
      }}
    >
      <img src={a('/assets/resume.svg')} alt="" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
      View Resume
    </a>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function FullPortfolio({ visible, onClose, section, onSection, onLogoClick }) {
  const [inDom,    setInDom]    = useState(false)
  const [show,     setShow]     = useState(false)
  const [tab,      setTab]      = useState('about')
  const [expTab,   setExpTab]   = useState('experience')
  const [projTab,  setProjTab]  = useState('live')
  const [flashing, setFlashing] = useState(false)
  const flashTimer = useRef(null)

  // Mount / unmount with slide; sync tab to section on open
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

  // Any key closes overlay
  useEffect(() => {
    if (!visible) return
    const fn = e => {
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return
      onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [visible, onClose])

  function triggerFlash() {
    clearTimeout(flashTimer.current)
    setFlashing(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setFlashing(true)))
    flashTimer.current = setTimeout(() => setFlashing(false), 750)
  }

  const switchTab = id => {
    if (id === tab) return
    triggerFlash()
    setTab(id)
    onSection?.(id)
  }

  if (!inDom) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      overflow: 'hidden', fontFamily: 'Imprima, sans-serif',
      transform: show ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>

      {/* ── Background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${a('/assets/rx7_background.jpg')})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.3) saturate(0.8)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)' }} />

      {/* ── Lights flash overlay ── */}
      {flashing && (
        <div key={Date.now()} style={{
          position: 'absolute', inset: 0, zIndex: 2,
          backgroundImage: `url(${a('/assets/rx7_lights_background.png')})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          mixBlendMode: 'screen',
          filter: 'brightness(2)',
          animation: 'lightsFlash 0.75s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      {/* ── Social column — right side ── */}
      <div style={{
        position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
        zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        {social.map(({ href, icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
            style={{ display: 'inline-flex' }}>
            <img src={icon} alt={label} style={{
              width: 22, height: 22,
              filter: 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(255,255,255,0.4))',
              opacity: 0.6, transition: 'filter 0.2s, opacity 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.9))'; e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(255,255,255,0.4))'; e.currentTarget.style.opacity = '0.6' }}
            />
          </a>
        ))}
      </div>

      {/* ── Content wrapper ── */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flexDirection: 'column', height: '100%',
        paddingRight: 56, // leave room for social column
      }}>

        {/* ── Top navbar ── */}
        <nav style={{
          display: 'flex', alignItems: 'center',
          padding: '0 40px', height: 68, flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(0,0,0,0.2)',
        }}>

          {/* Profile photo → back to splash */}
          <div
            onClick={() => { onLogoClick?.(); onClose() }}
            title="Back to splash"
            style={{
              width: 42, height: 42, borderRadius: '50%', overflow: 'hidden',
              boxShadow: '0 0 0 2px rgba(255,255,255,0.65)',
              cursor: 'pointer', flexShrink: 0,
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 0 0 2px white, 0 0 14px rgba(255,255,255,0.35)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.65)'
            }}
          >
            <img src={profile.avatar} alt={profile.name} style={{
              width: '120%', height: 'auto',
              position: 'relative', top: '-17px', left: '-3px',
            }} />
          </div>

          <span style={{
            marginLeft: 14, fontFamily: 'Imprima, sans-serif',
            fontSize: '0.95rem', color: 'rgba(255,255,255,0.82)',
            letterSpacing: '0.02em', flexShrink: 0,
          }}>
            {profile.name}
          </span>

          <div style={{ flex: 1 }} />

          {/* Pill nav */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 30, padding: '4px 6px', gap: 2,
          }}>
            {NAV_TABS.map(({ id, label }) => {
              const active = tab === id
              return (
                <button key={id} onClick={() => switchTab(id)} style={{
                  background: active ? 'rgba(255,255,255,0.11)' : 'none',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.22)' : 'transparent'}`,
                  borderRadius: 24, padding: '6px 22px', cursor: 'pointer',
                  fontFamily: 'Imprima, sans-serif', fontSize: '0.88rem',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                  textShadow: active ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                  letterSpacing: '0.02em',
                  transition: 'all 0.22s ease',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div style={{ flex: 1 }} />
        </nav>

        {/* ── Tab content ── */}
        <div className="v1-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {tab === 'about'      && <AboutTab />}
          {tab === 'experience' && <ExperienceTab expTab={expTab} setExpTab={setExpTab} />}
          {tab === 'projects'   && <ProjectsTab projTab={projTab} setProjTab={setProjTab} />}
        </div>

        {/* ── Bottom close ── */}
        <div
          onClick={onClose}
          style={{
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

// ─── About ────────────────────────────────────────────────────
function AboutTab() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 48px 64px' }}>

      {/* Specialization tags */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        {[
          { label: 'Agentic AI Systems',    color: '#b187ff' },
          { label: 'Full Stack Development', color: '#48bcff' },
          { label: 'UI/UX Design',           color: '#ffd166' },
        ].map(({ label, color }) => (
          <span key={label} style={{
            fontSize: '0.78rem', letterSpacing: '0.08em',
            color, border: `1px solid ${color}44`,
            padding: '5px 14px', borderRadius: 4,
            fontFamily: 'Imprima, sans-serif',
            textShadow: `0 0 8px ${color}55`,
            background: `${color}0a`,
          }}>
            {label}
          </span>
        ))}
      </div>

      {/* Bio heading */}
      <SectionHeading>About Me</SectionHeading>
      <p
        style={{
          fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)',
          color: 'rgba(255,255,255,0.75)', lineHeight: 1.9,
          maxWidth: 720, marginBottom: 52,
          borderLeft: '2px solid rgba(255,255,255,0.12)',
          paddingLeft: 18,
        }}
        dangerouslySetInnerHTML={{ __html: hlBio(profile.bio) }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 40 }}>
        <ResumeButton />
      </div>

      {/* Tech stack */}
      <SectionHeading>Tech Stack</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {Object.entries(skills).map(([cat, items]) => (
          <div key={cat}>
            <div style={{
              fontSize: '0.73rem', letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 16,
            }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22 }}>
              {items.map(({ label, icon }) => (
                <div key={label} className="v1-icon" data-tip={label}>
                  <img src={icon} alt={label} style={{ width: 34, height: 34, objectFit: 'contain' }} />
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
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 48px 64px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <SubTabBar tabs={EXP_GROUPS} active={expTab} setActive={setExpTab} accent="#b187ff" />
        <div style={{ flexShrink: 0, paddingTop: 4 }}><ResumeButton /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.map((item, i) => <ExperienceCard key={i} item={item} />)}
      </div>
    </div>
  )
}

function ExperienceCard({ item }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(0,0,0,0.48)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      padding: '22px 24px',
      display: 'flex', gap: 20,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.45)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
      }}
    >
      {/* Logo */}
      <div style={{
        width: 58, height: 58, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        {item.logo
          ? <img src={item.logo} alt={item.org} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)' }}>○</span>}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Role */}
        <div style={{
          fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: '#fff',
          textShadow: '0 0 8px rgba(255,255,255,0.45)', marginBottom: 3,
        }}>
          {item.role}
        </div>
        {/* Org · duration · location */}
        <div style={{
          fontSize: '0.8rem', color: '#b187ff',
          marginBottom: 14, letterSpacing: '0.03em',
        }}>
          {item.org}&nbsp;·&nbsp;
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{item.duration}</span>&nbsp;·&nbsp;
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{item.location}</span>
        </div>
        {/* Bullets */}
        <ul style={{
          margin: '0 0 16px', padding: '0 0 0 18px',
          color: 'rgba(255,255,255,0.7)', fontSize: '0.87rem', lineHeight: 2,
        }}>
          {item.bullets.map((b, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: hl(b) }} />
          ))}
        </ul>
        {/* Stack */}
        {item.stack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {item.stack.map(({ label, icon }) => (
              <div key={label} className="v1-icon" data-tip={label}>
                <img src={icon} alt={label} style={{ width: 20, height: 20, objectFit: 'contain' }} />
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
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '40px 48px 64px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <SubTabBar tabs={PROJ_GROUPS} active={projTab} setActive={setProjTab} accent="#48bcff" />
        <div style={{ flexShrink: 0, paddingTop: 4 }}><ResumeButton /></div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26, alignItems: 'flex-start' }}>
        {items.map((item, i) => <ProjectCard key={i} item={item} />)}
      </div>
    </div>
  )
}

function ProjectCard({ item }) {
  const primaryLink = item.live || item.video || item.github || item.figma || item.drive || null
  return (
    <div style={{
      width: 'clamp(280px, 30%, 340px)',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.5)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
      }}
    >
      {/* Winner badge */}
      {item.badge && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: 'linear-gradient(135deg,#f5d020,#e8a800)',
          color: '#1a1100', fontSize: '0.56rem',
          fontFamily: 'Imprima, sans-serif', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '3px 7px',
          boxShadow: '0 0 12px rgba(245,208,32,0.6)',
        }}>
          {item.badge}
        </div>
      )}

      {/* Project image */}
      {item.image && (
        <a href={primaryLink ?? undefined} target="_blank" rel="noreferrer"
          style={{ display: 'block', cursor: primaryLink ? 'pointer' : 'default' }}>
          <img src={item.image} alt={item.name} style={{
            width: '94%', margin: '8px auto 0', display: 'block',
            border: '1px solid rgba(255,255,255,0.12)',
            aspectRatio: '16/9', objectFit: 'cover',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { if (primaryLink) e.currentTarget.style.opacity = '0.75' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          />
        </a>
      )}

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <span style={{
          fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)', color: '#fff',
          textShadow: '0 0 8px rgba(255,255,255,0.4)',
        }}>
          {item.name}
        </span>
        <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}>
          {item.subtitle}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
          {item.live && (
            <a href={item.live} target="_blank" rel="noreferrer" style={{
              fontFamily: 'Imprima, sans-serif', fontSize: '0.68rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', color: '#48bcff',
              padding: '3px 9px', border: '1px solid rgba(72,188,255,0.38)',
              borderRadius: 4, transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(72,188,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Link ↗
            </a>
          )}
          {item.github && (
            <a href={item.github} target="_blank" rel="noreferrer" title="GitHub" className="link-icon">
              <img src={a('/assets/github_icon.svg')} alt="GitHub" style={{ width: 22, height: 22, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </a>
          )}
          {item.video && (
            <a href={item.video} target="_blank" rel="noreferrer" title="Demo" className="link-icon">
              <img src={a('/assets/video.svg')} alt="Demo" style={{ width: 22, height: 22, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </a>
          )}
          {item.figma && (
            <a href={item.figma} target="_blank" rel="noreferrer" title="Figma" className="link-icon">
              <img src={a('/assets/figma.svg')} alt="Figma" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            </a>
          )}
          {item.drive && (
            <a href={item.drive} target="_blank" rel="noreferrer" title="Google Drive" className="link-icon">
              <img src={a('/assets/drive.svg')} alt="Google Drive" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            </a>
          )}
        </div>

        {/* Stack icons */}
        {item.stack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 2 }}>
            {item.stack.map(({ label, icon }) => (
              <div key={label} className="v1-icon" data-tip={label}>
                <img src={icon} alt={label} style={{ width: 19, height: 19, objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Shared helpers ───────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: 'Imprima, sans-serif', fontWeight: 400,
      fontSize: 'clamp(1.1rem, 2vw, 1.45rem)', color: '#fff',
      textShadow: '0 0 16px rgba(255,255,255,0.32)',
      marginBottom: 22, marginTop: 0, letterSpacing: '0.02em',
    }}>
      {children}
    </h2>
  )
}

function SubTabBar({ tabs, active, setActive, accent }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flex: 1, marginRight: 24 }}>
      {tabs.map(({ key, label }) => {
        const isActive = active === key
        return (
          <button key={key} onClick={() => setActive(key)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Imprima, sans-serif', fontSize: '0.85rem', letterSpacing: '0.04em',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.34)',
            padding: '10px 24px 9px', position: 'relative',
            transition: 'color 0.22s',
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
