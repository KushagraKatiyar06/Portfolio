import { useEffect, useRef } from 'react'

export default function SplashParticles() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const rand = (a, b) => Math.random() * (b - a) + a
    let w = (canvas.width  = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const count = Math.min(120, Math.max(55, Math.floor(w / 16)))
    const pts = Array.from({ length: count }, () => ({
      x: rand(0, w), y: rand(0, h),
      vx: rand(-0.26, 0.26), vy: rand(-0.18, 0.18),
      r: rand(0.8, 2.6), a: rand(0.18, 0.58),
    }))

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const resize = () => {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity: 0.38, pointerEvents: 'none',
      }}
    />
  )
}
