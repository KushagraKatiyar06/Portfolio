import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

export default function SceneFitter({ garageUrl, carUrl, carId, onFitGarage, onFitCar }) {
  const { camera, controls } = useThree()
  const { scene: garageScene } = useGLTF(garageUrl)
  const { scene: carScene } = useGLTF(carUrl)

  // Run once on mount — positions camera to frame the garage
  useEffect(() => {
    const garageBox = new THREE.Box3().setFromObject(garageScene)
    const garageSize = new THREE.Vector3()
    garageBox.getSize(garageSize)
    const garageCenter = new THREE.Vector3()
    garageBox.getCenter(garageCenter)

    console.log('[Garage] size:', garageSize.toArray().map(v => v.toFixed(2)))
    console.log('[Garage] center:', garageCenter.toArray().map(v => v.toFixed(2)))
    console.log('[Garage] floor Y:', garageBox.min.y.toFixed(2))

    const camDist = Math.max(garageSize.x, garageSize.z) * 1.1
    camera.position.set(
      garageCenter.x + camDist * 0.55,
      garageCenter.y + garageSize.y * 0.55,
      garageCenter.z + camDist * 0.55,
    )

    if (controls) {
      controls.target.copy(garageCenter)
      controls.update()
    } else {
      camera.lookAt(garageCenter)
    }

    onFitGarage({ size: garageSize, center: garageCenter, box: garageBox })
  }, [garageScene]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-runs whenever the selected car changes
  useEffect(() => {
    const garageBox = new THREE.Box3().setFromObject(garageScene)
    const garageSize = new THREE.Vector3()
    garageBox.getSize(garageSize)
    const garageCenter = new THREE.Vector3()
    garageBox.getCenter(garageCenter)

    const carBox = new THREE.Box3().setFromObject(carScene)
    const carSize = new THREE.Vector3()
    carBox.getSize(carSize)
    const carCenter = new THREE.Vector3()
    carBox.getCenter(carCenter)

    console.log('[Car] size:', carSize.toArray().map(v => v.toFixed(2)))
    console.log('[Car] center:', carCenter.toArray().map(v => v.toFixed(2)))

    const carLength = Math.max(carSize.x, carSize.z)
    if (carLength === 0) return

    // Scale the car so it's ~30% of the shorter garage floor dimension
    const floorDim = Math.min(garageSize.x, garageSize.z)
    const scale = (floorDim * 0.3) / carLength

    // Center car's bounding box over the garage floor center, rest on floor
    const px = garageCenter.x - carCenter.x * scale
    const pz = garageCenter.z - carCenter.z * scale
    const py = garageBox.min.y - carBox.min.y * scale

    console.log('[Auto-fit]', { px: px.toFixed(2), py: py.toFixed(2), pz: pz.toFixed(2), scale: scale.toFixed(4) })

    onFitCar(carId, { px, py, pz, ry: 0, scale })
  }, [carScene, carId]) 

  return null
}
