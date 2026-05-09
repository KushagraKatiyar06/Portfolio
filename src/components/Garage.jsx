import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

export default function Garage({ url }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse(child => {
      // Garage is static — no shadow maps, no unnecessary per-frame CPU checks
      child.castShadow = false
      child.receiveShadow = false
      // Frustum culling stays on (default true) so off-screen parts skip the GPU
    })
  }, [scene])

  return <primitive object={scene} />
}
