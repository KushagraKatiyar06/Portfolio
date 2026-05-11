import { useEffect, useRef, useState } from 'react'
import { profile, skills } from '../../data/portfolio'

const CATEGORY_ORDER = ['Languages', 'Frameworks', 'Databases', 'DevOps', 'AI / ML', 'Design', 'Other']

export default function ProfilePanel({ visible, onClose }) {
  const panelRef = useRef()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setMounted(true))
    } else {
      setMounted(false)
    }
  }, [visible])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!visible) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.55)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 50,
          height: '82vh',
          background: 'linear-gradient(180deg, rgba(10,10,10,0.97) 0%, rgba(5,5,5,0.99) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          transform: mounted ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'sticky', top: 20, left: '100%',
            float: 'right', marginRight: 28, marginTop: 20,
            background: 'none', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6, color: 'rgba(255,255,255,0.45)',
            fontFamily: 'Imprima, sans-serif',
            fontSize: 11, letterSpacing: '0.12em',
            padding: '4px 10px', cursor: 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
        >
          ESC
        </button>

        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '52px 40px 60px',
        }}>

          {/* ── Hero row ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 32,
            marginBottom: 40,
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.7)',
              boxShadow: '0 0 30px rgba(255,255,255,0.18)',
              flexShrink: 0,
            }}>
              <img
                src={profile.avatar}
                alt={profile.name}
                style={{
                  width: '120%', height: 'auto',
                  position: 'relative', top: '-86px', left: '-5px',
                }}
              />
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                color: '#fff',
                fontFamily: 'Imprima, sans-serif',
                fontWeight: 400,
                textShadow: '0 0 32px rgba(255,255,255,0.35)',
                letterSpacing: '0.01em',
                lineHeight: 1.1,
              }}>
                {profile.name}
              </h1>
              <p style={{
                margin: '8px 0 0',
                fontFamily: 'Imprima, sans-serif',
                fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)',
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.06em',
              }}>
                {profile.title}
              </p>
            </div>
          </div>


          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 36 }} />

          {/* ── Bio ── */}
          <Section label="About">
            <p style={{
              margin: 0,
              fontFamily: 'Imprima, sans-serif',
              fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.75,
              maxWidth: 720,
            }}>
              {profile.bio}
            </p>
          </Section>

          {/* ── Skills ── */}
          <Section label="Tech Stack">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {CATEGORY_ORDER.map(cat => (
                <div key={cat}>
                  <div style={{
                    fontFamily: 'Imprima, sans-serif',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {skills[cat].map(({ label, icon }) => (
                      <SkillChip key={label} label={label} icon={icon} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </>
  )
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{
        fontFamily: 'Imprima, sans-serif',
        fontSize: 12,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        marginBottom: 18,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function SkillChip({ label, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      padding: '6px 12px',
      transition: 'background 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      {icon && (
        <img
          src={icon}
          alt={label}
          style={{
            width: 16, height: 16,
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: 0.8,
          }}
        />
      )}
      <span style={{
        fontFamily: 'Imprima, sans-serif',
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        letterSpacing: '0.02em',
      }}>
        {label}
      </span>
    </div>
  )
}
