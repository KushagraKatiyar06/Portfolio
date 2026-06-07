import { projects } from '../../data/portfolio'
import { a } from '../../utils/asset'

const GROUPS = [
  { key: 'live',         label: 'Live Projects',      accent: '#4ddf8a' },
  { key: 'prizewinners', label: 'Prize Winners',       accent: '#ffd166' },
  { key: 'technical',   label: 'Technical Projects',  accent: '#b187ff' },
  { key: 'design',      label: 'Design Projects',     accent: '#ff4d6d' },
]

// Collect all prize-winning projects (those with a badge) across all groups,
// deduped by name so duplicates across tabs only appear once.
const seenNames = new Set()
const prizeWinners = ['live', 'technical', 'design']
  .flatMap(k => projects[k] ?? [])
  .filter(p => {
    if (!p.badge || seenNames.has(p.name)) return false
    seenNames.add(p.name)
    return true
  })

const allProjects = { ...projects, prizewinners: prizeWinners }

export default function ProjectsSection({ expanded = false }) {
  return (
    <div style={{ padding: '20px 18px 48px' }}>
      {GROUPS.map(({ key, label, accent }) => {
        const items = allProjects[key]
        if (!items?.length) return null
        return (
          <div key={key} style={{ marginBottom: 32 }}>
            <GroupHeader label={label} accent={accent} />
            <div style={{
              display: expanded ? 'grid' : 'block',
              gridTemplateColumns: expanded ? 'repeat(auto-fill, minmax(220px, 1fr))' : undefined,
              gap: expanded ? 12 : undefined,
            }}>
              {items.map((item, i) => (
                <ProjectCard key={i} item={item} accent={accent} expanded={expanded} />
              ))}
            </div>
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
      fontSize: 11, letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: accent,
      textShadow: `0 0 8px ${accent}88`,
      marginBottom: 12, paddingBottom: 7,
      borderBottom: `1px solid ${accent}33`,
    }}>
      {label}
    </div>
  )
}

function ProjectCard({ item, accent, expanded }) {
  const primaryLink = item.live || item.video || item.github || item.figma || item.drive || null

  return (
    <div style={{
      marginBottom: expanded ? 0 : 14,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderLeft: `2px solid ${accent}`,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.35), 0 0 18px rgba(255,255,255,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderLeftColor = accent; e.currentTarget.style.boxShadow = 'none' }}>
      {item.badge && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          background: 'linear-gradient(135deg, #f5d020, #e8a800)',
          color: '#1a1100', fontSize: '0.58rem',
          fontFamily: 'Imprima, sans-serif',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '2px 6px', borderRadius: 3,
          boxShadow: '0 0 8px rgba(245,208,32,0.45)',
        }}>
          {item.badge}
        </div>
      )}

      {item.image && (
        <a href={primaryLink} target="_blank" rel="noreferrer"
          style={{ display: 'block', cursor: primaryLink ? 'pointer' : 'default' }}>
          <img src={item.image} alt={item.name} style={{
            width: '100%', display: 'block',
            aspectRatio: '16/9', objectFit: 'cover',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { if (primaryLink) e.currentTarget.style.opacity = '0.75' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          />
        </a>
      )}

      <div style={{ padding: '11px 13px' }}>
        <div style={{
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.95rem', color: '#fff',
          letterSpacing: '0.01em', lineHeight: 1.3,
          marginBottom: 2,
          paddingRight: item.badge ? 72 : 0,
        }}>
          {item.name}
        </div>
        <div style={{
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.03em', marginBottom: 9,
        }}>
          {item.subtitle}
        </div>

        <div style={{ display: 'flex', gap: 9, marginBottom: 9, alignItems: 'center', flexWrap: 'wrap' }}>
          {item.live && (
            <a href={item.live} target="_blank" rel="noreferrer" style={{
              fontFamily: 'Imprima,sans-serif', fontSize: '0.7rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', color: accent,
              padding: '2px 8px', border: `1px solid ${accent}55`,
              borderRadius: 4, transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = `${accent}18`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Link ↗
            </a>
          )}
          {item.github && <a href={item.github} target="_blank" rel="noreferrer" title="GitHub" className="link-icon"><img src={a('/assets/github_icon.svg')} alt="GitHub" style={{ width: 22, height: 22, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /></a>}
          {item.video  && <a href={item.video}  target="_blank" rel="noreferrer" title="Demo"   className="link-icon"><img src={a('/assets/video.svg')}       alt="Demo"   style={{ width: 22, height: 22, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /></a>}
          {item.figma  && <a href={item.figma}  target="_blank" rel="noreferrer" title="Figma"  className="link-icon"><img src={a('/assets/figma.svg')}        alt="Figma"  style={{ width: 22, height: 22, objectFit: 'contain' }} /></a>}
          {item.drive  && <a href={item.drive}  target="_blank" rel="noreferrer" title="Drive"  className="link-icon"><img src={a('/assets/drive.svg')}         alt="Drive"  style={{ width: 22, height: 22, objectFit: 'contain' }} /></a>}
        </div>

        {item.stack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
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
