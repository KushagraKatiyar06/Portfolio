import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

export default function Garage({ url }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse(child => {

      child.castShadow = false
      child.receiveShadow = false

    })
  }, [scene])

  return <primitive object={scene} />
}
