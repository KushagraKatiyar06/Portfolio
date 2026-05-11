import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

export default function Car({ url, position, rotation, scale, ...props }) {
  const { scene } = useGLTF(url)
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
