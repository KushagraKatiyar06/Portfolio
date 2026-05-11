import { profile } from '../../data/portfolio'
import { a } from '../../utils/asset'

const ITEMS = [
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
]

export default function SectionNav({ section, onSection, disabled, dimmed, onLogoClick }) {
  return (
    <nav
      style={{
        position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 25,
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: '2.5rem',
        background: 'rgba(0,0,0,0)',
        border: '1px solid rgba(255,255,255,0)',
        borderRadius: 50,
        padding: '0.75rem 2rem',
        opacity: disabled ? 0 : dimmed ? 0.2 : 1,
        transition: 'opacity 0.4s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.8)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(0,0,0,0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        onClick={() => onLogoClick?.()}
        title="Back to top"
        style={{
          width: 50, height: 50, borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 2px white',
          flexShrink: 0, cursor: 'pointer',
          transition: 'transform 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img
          src={a('/assets/navbar_profile_photo.jpg')}
          alt={profile.name}
          style={{
            width: '99%', height: 'auto',
            objectFit: 'cover',
            position: 'relative', top: '2px', left: '-0.5px',
          }}
        />
      </div>

      <ul style={{
        display: 'flex', flexDirection: 'row', listStyle: 'none',
        gap: '2rem', margin: 0, padding: 0,
        fontFamily: 'Imprima, sans-serif', fontSize: '1.5rem', color: '#fff',
      }}>
        {ITEMS.map(({ id, label }) => {
          const active = section === id
          return (
            <li key={id}>
              <button
                onClick={() => onSection(id)}
                style={{
                  appearance: 'none', WebkitAppearance: 'none',
                  background: 'none', border: 0,
                  padding: 0, margin: 0,
                  fontFamily: 'Imprima, sans-serif', fontSize: '1.5rem',
                  lineHeight: 'inherit', textAlign: 'left',
                  position: 'relative', cursor: 'pointer',
                  color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                  textShadow: active
                    ? '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.3)'
                    : 'none',
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                  display: 'block',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.textShadow = '0 0 8px rgba(255,255,255,0.5)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = active ? '#fff' : 'rgba(255,255,255,0.6)'
                  e.currentTarget.style.textShadow = active
                    ? '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.3)'
                    : 'none'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {label}
                <span style={{
                  position: 'absolute', bottom: -5, left: 0,
                  width: active ? '100%' : '0%', height: 2,
                  background: 'white', display: 'block',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                }} />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
