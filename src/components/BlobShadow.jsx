import { useMemo } from 'react'
import * as THREE from 'three'

// A radial-gradient plane that always renders on top of floor geometry.
// depthTest:false + depthWrite:false means the floor can never hide it.
export default function BlobShadow({ position, width = 0.3, length = 0.18, opacity = 0.55, yRotation = 0 }) {
  const texture = useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const cx = size / 2
    const cy = size / 2
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx)
    grad.addColorStop(0, 'rgba(0,0,0,0.9)')
    grad.addColorStop(0.5, 'rgba(0,0,0,0.4)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, yRotation]}
      scale={[width, length, 3]}
      renderOrder={10}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        depthTest={true}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-4}
      />
    </mesh>
  )
}
