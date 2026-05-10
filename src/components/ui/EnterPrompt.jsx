import { useEffect, useState } from 'react'

export default function EnterPrompt({ onEnter }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp') onEnter()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onEnter])

  if (!visible) return null

  return (
    <div
      onClick={onEnter}
      style={{
        position: 'fixed',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 27,
        animation: 'promptFadeIn 0.5s ease forwards',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Imprima, sans-serif',
        fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textShadow: '0 0 20px rgba(255,255,255,0.6)',
        animation: 'pulseText 2s ease-in-out infinite',
      }}>
        press ↑ for web view
      </span>

      {/* animated chevron */}
      <svg
        width="18" height="18"
        viewBox="0 0 18 18"
        fill="none"
        style={{ animation: 'bounceDown 1.8s ease-in-out infinite', opacity: 0.7 }}
      >
        <path d="M3 6l6 6 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <style>{`
        @keyframes pulseText {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1; }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
        @keyframes promptFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
