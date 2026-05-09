import { projects } from '../../data/portfolio'
import { a } from '../../utils/asset'

const GROUPS = [
  { key: 'live',      label: 'Live Projects' },
  { key: 'technical', label: 'Technical Projects' },
  { key: 'design',    label: 'Design Projects' },
]

export default function ProjectsSection({ expanded = false }) {
  return (
    <div style={{ padding: '28px 22px 48px' }}>
      {GROUPS.map(({ key, label }) => {
        const items = projects[key]
        if (!items?.length) return null
        return (
          <div key={key} style={{ marginBottom: 36 }}>
            <GroupHeader label={label} />
            {/* Grid: 2-3 cols when expanded, single col when normal */}
            <div style={{
              display: expanded ? 'grid' : 'block',
              gridTemplateColumns: expanded ? 'repeat(auto-fill, minmax(220px, 1fr))' : undefined,
              gap: expanded ? 14 : undefined,
            }}>
              {items.map((item, i) => (
                <ProjectCard key={i} item={item} expanded={expanded} />
              ))}
            </div>
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
      fontSize: 11, letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#48bcff',
      textShadow: '0 0 8px rgba(72,188,255,0.5)',
      marginBottom: 14, paddingBottom: 8,
      borderBottom: '1px solid rgba(72,188,255,0.15)',
    }}>
      {label}
    </div>
  )
}

function ProjectCard({ item, expanded }) {
  const primaryLink = item.live || item.video || null

  return (
    <div style={{
      marginBottom: expanded ? 0 : 16,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: '2px solid rgba(72,188,255,0.4)',
      position: 'relative', overflow: 'hidden',
    }}>
      {item.badge && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: 'linear-gradient(135deg, #f5d020, #e8a800)',
          color: '#1a1100', fontSize: '0.6rem',
          fontFamily: 'Imprima, sans-serif',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '2px 6px', borderRadius: 3,
          boxShadow: '0 0 10px rgba(245,208,32,0.45)',
        }}>
          {item.badge}
        </div>
      )}

      {/* Image — clickable */}
      {item.image && (
        <a href={primaryLink} target="_blank" rel="noreferrer"
          style={{ display: 'block', cursor: primaryLink ? 'pointer' : 'default' }}>
          <img src={item.image} alt={item.name} style={{
            width: '100%', display: 'block',
            aspectRatio: '16/9', objectFit: 'cover',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { if (primaryLink) e.currentTarget.style.opacity = '0.75' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          />
        </a>
      )}

      <div style={{ padding: '13px 15px' }}>
        {/* Name */}
        <div style={{
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.97rem', color: '#fff',
          letterSpacing: '0.01em', lineHeight: 1.3,
          marginBottom: 3,
          paddingRight: item.badge ? 80 : 0,
        }}>
          {item.name}
        </div>
        <div style={{
          fontFamily: 'Imprima, sans-serif',
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.03em', marginBottom: 11,
        }}>
          {item.subtitle}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 11, alignItems: 'center', flexWrap: 'wrap' }}>
          {item.live && (
            <a href={item.live} target="_blank" rel="noreferrer"
              style={{
                fontFamily: 'Imprima,sans-serif', fontSize: '0.72rem',
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
          {item.github && (
            <a href={item.github} target="_blank" rel="noreferrer" title="GitHub" className="link-icon">
              <img src={a('/assets/github_icon.svg')} alt="GitHub" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </a>
          )}
          {item.video && (
            <a href={item.video} target="_blank" rel="noreferrer" title="Demo" className="link-icon">
              <img src={a('/assets/video.svg')} alt="Demo" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </a>
          )}
          {item.figma && (
            <a href={item.figma} target="_blank" rel="noreferrer" title="Figma" className="link-icon">
              <img src={a('/assets/figma.svg')} alt="Figma" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            </a>
          )}
        </div>

        {/* Stack icons */}
        {item.stack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
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
