import { useEffect, useRef } from 'react'
import { a } from '../../utils/asset'

export default function Rx7CursorFollower({ visible }) {
  const spriteRef = useRef()
  const stateRef  = useRef(null)

  if (!stateRef.current) {
    const cx = typeof window !== 'undefined' ? window.innerWidth  * 0.5 : 400
    const cy = typeof window !== 'undefined' ? window.innerHeight * 0.5 : 300
    stateRef.current = {
      cursor:       { x: cx, y: cy },
      cursorLag:    { x: cx, y: cy },
      lastCursor:   { x: cx, y: cy },
      anchorOffset: { x: 70, y: 35 },
      mouseTarget:  { x: cx * 1.1, y: cy * 1.2 },
      dragTarget:   { x: cx * 1.1, y: cy * 1.2 },
      rx7:          { x: cx * 1.1, y: cy * 1.2, vx: 0, vy: 0 },
    }
  }

  useEffect(() => {
    const s = stateRef.current

    const onMove = e => { s.cursor.x = e.clientX; s.cursor.y = e.clientY }
    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      const { cursor, cursorLag, lastCursor, anchorOffset, mouseTarget, dragTarget, rx7 } = s

      cursorLag.x += (cursor.x - cursorLag.x) * 0.08
      cursorLag.y += (cursor.y - cursorLag.y) * 0.08

      const dx = cursor.x - lastCursor.x
      const dy = cursor.y - lastCursor.y
      lastCursor.x = cursor.x
      lastCursor.y = cursor.y

      anchorOffset.x = Math.max(-140, Math.min(140, anchorOffset.x + dx * 0.22)) * 0.93
      anchorOffset.y = Math.max(-95,  Math.min(95,  anchorOffset.y + dy * 0.22)) * 0.93

      const now = Date.now()
      mouseTarget.x = cursorLag.x + anchorOffset.x + Math.sin(now * 0.0009) * 8
      mouseTarget.y = cursorLag.y + anchorOffset.y + Math.cos(now * 0.0011) * 10

      dragTarget.x += (mouseTarget.x - dragTarget.x) * 0.08
      dragTarget.y += (mouseTarget.y - dragTarget.y) * 0.08

      rx7.vx = (rx7.vx + (dragTarget.x - rx7.x) * 0.025) * 0.92
      rx7.vy = (rx7.vy + (dragTarget.y - rx7.y) * 0.025) * 0.92
      rx7.x += rx7.vx
      rx7.y += rx7.vy

      const rot = Math.max(-11, Math.min(11, rx7.vx * 0.9))
      const bob = Math.sin(now * 0.0018) * 6

      const el = spriteRef.current
      if (el) el.style.transform = `translate(${rx7.x}px, ${rx7.y + bob}px) translate(-50%, -50%) rotate(${rot}deg)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <img
      ref={spriteRef}
      src={a('/assets/rx7.png')}
      alt=""
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 'clamp(95px, 9vw, 165px)', height: 'auto',
        willChange: 'transform',
        opacity: visible ? 0.85 : 0,
        filter: 'drop-shadow(0 0 16px rgba(255,255,255,0.35))',
        pointerEvents: 'none',
        zIndex: 998,
        transition: 'opacity 0.6s ease',
      }}
    />
  )
}
