import { useState } from 'react'
import { experiences } from '../../data/portfolio'

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

const GROUPS = [
  { key: 'experience',  label: 'Work Experience' },
  { key: 'leadership',  label: 'Technical Leadership' },
  { key: 'involvement', label: 'Campus Involvement' },
]

export default function ExperienceSection({ expanded = false }) {
  return (
    <div style={{ padding: '28px 20px 48px' }}>
      {GROUPS.map(({ key, label }) => {
        const items = experiences.filter(e => e.type === key)
        if (!items.length) return null
        return (
          <div key={key} style={{ marginBottom: 36 }}>
            <GroupHeader label={label} />
            {items.map((item, i) => (
              <ExperienceCard key={i} item={item} forceExpanded={expanded} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function GroupHeader({ label }) {
  return (
    <div style={{
      fontFamily: 'Imprima, sans-serif',
      fontSize: 12, letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: '#b187ff',
      textShadow: '0 0 8px rgba(177,135,255,0.5)',
      marginBottom: 12, paddingBottom: 8,
      borderBottom: '1px solid rgba(177,135,255,0.15)',
    }}>
      {label}
    </div>
  )
}

function ExperienceCard({ item, forceExpanded }) {
  const [expanded, setExpanded] = useState(false)
  const showAll = forceExpanded || expanded
  const bullets = showAll ? item.bullets : item.bullets.slice(0, 2)

  return (
    <div style={{
      marginBottom: 14,
      padding: '14px 14px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: '2px solid rgba(177,135,255,0.4)',
    }}>
      {/* Logo + header */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        {item.logo && (
          <div style={{
            width: 40, height: 40, flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            overflow: 'hidden', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={item.logo} alt={item.org} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: '0.95rem', color: '#fff',
            letterSpacing: '0.01em', lineHeight: 1.3, marginBottom: 2,
          }}>
            {item.role}
          </div>
          <div style={{
            fontFamily: 'Imprima, sans-serif',
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.03em',
          }}>
            {item.org}&nbsp;·&nbsp;{item.duration}
          </div>
        </div>
      </div>

      {/* Bullets */}
      <ul style={{
        margin: '0 0 8px 0', padding: '0 0 0 14px',
        fontFamily: 'Imprima, sans-serif',
        fontSize: '0.82rem', color: 'rgba(255,255,255,0.62)',
        lineHeight: 1.65, listStyle: 'disc',
      }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: hl(b) }} />
        ))}
      </ul>

      {/* Expand toggle — hidden when forceExpanded */}
      {item.bullets.length > 2 && !forceExpanded && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Imprima, sans-serif',
            fontSize: '0.7rem', letterSpacing: '0.1em',
            color: 'rgba(72,188,255,0.7)',
            padding: 0, marginBottom: 8,
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#48bcff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(72,188,255,0.7)'}
        >
          {expanded ? '▲ less' : `▼ +${item.bullets.length - 2} more`}
        </button>
      )}

      {/* Stack — v1-icon style */}
      {item.stack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
          {item.stack.map(({ label, icon }) => (
            <div key={label} className="v1-icon" data-tip={label}>
              <img src={icon} alt={label} style={{ width: 22, height: 22, objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
