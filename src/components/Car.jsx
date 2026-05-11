import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

export default function Car({ url, position, rotation, scale, ...props }) {
  const { scene } = useGLTF(url)
  // Clone so two cars can share the same loaded scene without conflicts
  const cloned = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={rotation}
      scale={scale}
      {...props}
    />
  )
}
