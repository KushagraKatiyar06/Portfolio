import { useState } from 'react'
import { experiences } from '../../data/portfolio'

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

function hl(text) {
  let result = text.replace(
    /\$[\d,]+(?:\s*→\s*\$[\d,]+)?|\b\d[\d,]*[×xX%+]|\b\d[\d,]*\b/g,
    m => {
      const clean = m.replace(/,/g, '')
      if (m.endsWith('%'))
        return `<span style="color:#ffd166;text-shadow:0 0 5px rgba(255,209,102,0.4)">${clean}</span>`
      return `<span style="color:#ff9361;text-shadow:0 0 6px rgba(255,147,97,0.4)">${clean}</span>`
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

const GROUPS = [
  { key: 'experience',      label: 'Professional Experience', accent: '#48bcff' },
  { key: 'extracurricular', label: 'Extracurriculars',      accent: '#ffd166' },
  { key: 'leadership',      label: 'Leadership',             accent: '#b187ff' },
]

function sortExperiences(items) {
  return items.sort((a, b) => {
    const aIsPresent = a.duration.includes('Present')
    const bIsPresent = b.duration.includes('Present')
    
    if (aIsPresent === bIsPresent) {
      const getStartDate = (duration) => {
        const [start] = duration.split(' – ')
        const months = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 }
        const [month, year] = start.split(' ')
        return new Date(parseInt(year), months[month] - 1)
      }
      
      const dateA = getStartDate(a.duration)
      const dateB = getStartDate(b.duration)
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime()
      }
      
      const typeOrder = { experience: 0, leadership: 1, extracurricular: 2 }
      return (typeOrder[a.type] ?? 3) - (typeOrder[b.type] ?? 3)
    }
    
    return aIsPresent ? -1 : 1
  })
}

export default function ExperienceSection({ expanded = false }) {
  return (
    <div style={{ padding: '20px 18px 48px' }}>
      {GROUPS.map(({ key, label, accent }) => {
        const items = sortExperiences(experiences.filter(e => e.type === key))
        if (!items.length) return null
        return (
          <div key={key} style={{ marginBottom: 32 }}>
            <GroupHeader label={label} accent={accent} />
            {items.map((item, i) => (
              <ExperienceCard key={i} item={item} accent={accent} forceExpanded={expanded} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function GroupHeader({ label, accent }) {
  return (
    <div style={{
      fontFamily: 'Imprima, sans-serif',
      fontSize: 11, letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: accent,
      textShadow: `0 0 8px ${accent}88`,
      marginBottom: 10, paddingBottom: 7,
      borderBottom: `1px solid ${accent}33`,
    }}>
      {label}
    </div>
  )
}

function ExperienceCard({ item, accent, forceExpanded }) {
  const [expanded, setExpanded] = useState(false)
  const showAll = forceExpanded || expanded
  const bullets = showAll ? item.bullets : item.bullets.slice(0, 2)

  return (
    <div style={{
      marginBottom: 12,
      padding: '13px 13px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderLeft: `2px solid ${accent}`,
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.35), 0 0 18px rgba(255,255,255,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderLeftColor = accent; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ display: 'flex', gap: 11, marginBottom: 9 }}>
        {item.logo && (
          <div style={{
            width: 38, height: 38, flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.04)',
            overflow: 'hidden', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={item.logo} alt={item.org} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
            <div style={{
              fontFamily: 'Imprima, sans-serif',
              fontSize: '0.93rem', color: '#fff',
              letterSpacing: '0.01em', lineHeight: 1.3,
            }}>
              {item.role}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flexShrink: 0 }}>
              <span style={{ fontFamily: 'Imprima, sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{item.duration}</span>
              <span style={{ fontFamily: 'Imprima, sans-serif', fontSize: '0.68rem', color: '#ff9361', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{item.location}</span>
            </div>
          </div>
          <div style={{ fontFamily: 'Imprima, sans-serif', fontSize: '0.75rem', letterSpacing: '0.03em' }}>
            <span style={{ color: accent }}>{item.org}</span>
          </div>
        </div>
      </div>

      <ul style={{
        margin: '0 0 7px 0', padding: '0 0 0 14px',
        fontFamily: 'Imprima, sans-serif',
        fontSize: '0.8rem', color: 'rgba(255,255,255,0.62)',
        lineHeight: 1.7, listStyle: 'disc',
      }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: hl(b) }} />
        ))}
      </ul>

      {item.bullets.length > 2 && !forceExpanded && (
        <button onClick={() => setExpanded(e => !e)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.68rem', letterSpacing: '0.1em',
          color: `${accent}bb`,
          padding: 0, marginBottom: 7,
          textTransform: 'uppercase',
        }}
          onMouseEnter={e => e.currentTarget.style.color = accent}
          onMouseLeave={e => e.currentTarget.style.color = `${accent}bb`}
        >
          {expanded ? '▲ less' : `▼ +${item.bullets.length - 2} more`}
        </button>
      )}

      {item.stack?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 3 }}>
          {item.stack.map(({ label, icon }) => (
            <div key={label} className="v1-icon" data-tip={label}>
              <img src={icon} alt={label} style={{ width: 20, height: 20, objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
