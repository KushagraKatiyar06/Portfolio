import { useGLTF } from '@react-three/drei'

export default function Garage({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}
