import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Suspense, useState, useCallback, useRef } from 'react'
import Garage from './components/Garage'
import Car from './components/Car'
import UI from './components/UI'
import SceneFitter from './components/SceneFitter'

import garageUrl from '../models/garage_nfs_2015.glb?url'
import rx7Url from '../models/rx7_fd.glb?url'
import carreraUrl from '../models/carrera_gt.glb?url'

useGLTF.preload(garageUrl)
useGLTF.preload(rx7Url)
useGLTF.preload(carreraUrl)

export const CARS = [
  { id: 'rx7', name: 'Mazda RX-7 FD', url: rx7Url },
  { id: 'carrera', name: 'Porsche Carrera GT', url: carreraUrl },
]

// Known-good placements — SceneFitter will not override these
const CAR_DEFAULTS = {
  rx7:     { px: -0.28, py: -0.02, pz: -0.15, ry:   0, scale: 0.18 },
  carrera: { px:  0.00, py: -0.24, pz:  0.01, ry: -48, scale: 0.13 },
}

export default function App() {
  const [selectedCarId, setSelectedCarId] = useState('rx7')
  const [transforms, setTransforms] = useState(
    Object.fromEntries(CARS.map(c => [c.id, { ...CAR_DEFAULTS[c.id] }]))
  )
  const [garageInfo, setGarageInfo] = useState(null)
  const [showAxes, setShowAxes] = useState(false)

  // Pre-mark all cars as fitted so SceneFitter only handles the camera
  const garageInfoRef = useRef(false)
  const autoFittedRef = useRef(new Set(CARS.map(c => c.id)))
  const autoTransformsRef = useRef(
    Object.fromEntries(CARS.map(c => [c.id, { ...CAR_DEFAULTS[c.id] }]))
  )

  const selectedCar = CARS.find(c => c.id === selectedCarId)
  const t = transforms[selectedCarId]

  const handleFitGarage = useCallback(({ size, center, box }) => {
    if (garageInfoRef.current) return
    garageInfoRef.current = true
    setGarageInfo({ size, center, box })
  }, [])

  const handleFitCar = useCallback((carId, transform) => {
    autoTransformsRef.current[carId] = transform
    if (autoFittedRef.current.has(carId)) return
    autoFittedRef.current.add(carId)
    setTransforms(prev => ({ ...prev, [carId]: transform }))
  }, [])

  const updateTransform = (key, value) => {
    setTransforms(prev => ({
      ...prev,
      [selectedCarId]: { ...prev[selectedCarId], [key]: parseFloat(value) },
    }))
  }

  const resetTransform = () => {
    const auto = autoTransformsRef.current[selectedCarId]
    setTransforms(prev => ({
      ...prev,
      [selectedCarId]: auto ? { ...auto } : { ...CAR_DEFAULTS[selectedCarId] },
    }))
  }

  const posRange = garageInfo ? Math.max(garageInfo.size.x, garageInfo.size.z) * 0.8 : 2
  const scaleMax = garageInfo ? Math.min(garageInfo.size.x, garageInfo.size.z) * 0.3 : 0.5

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0a0a0a']} />

        {/* IBL provides most of the lighting — fills the garage interior */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 5, 2]} intensity={1.5} />
        <pointLight position={[0, 1, 0]} intensity={3} decay={2} color="#fff8e7" />
        <pointLight position={[0, 0.5, 1]} intensity={2} decay={2} color="#fff4e0" />

        <Suspense fallback={null}>
          <Environment preset="warehouse" />
          <Garage url={garageUrl} />
          <Car
            key={selectedCarId}
            url={selectedCar.url}
            position={[t.px, t.py, t.pz]}
            rotation={[0, t.ry * (Math.PI / 180), 0]}
            scale={t.scale}
          />
          <SceneFitter
            garageUrl={garageUrl}
            carUrl={selectedCar.url}
            carId={selectedCarId}
            onFitGarage={handleFitGarage}
            onFitCar={handleFitCar}
          />
        </Suspense>

        {showAxes && <axesHelper args={[posRange * 0.5]} />}
        <OrbitControls makeDefault enableDamping dampingFactor={0.06} />
      </Canvas>

      <UI
        cars={CARS}
        selectedCarId={selectedCarId}
        onSelectCar={setSelectedCarId}
        transform={t}
        onUpdateTransform={updateTransform}
        onResetTransform={resetTransform}
        showAxes={showAxes}
        onToggleAxes={() => setShowAxes(v => !v)}
        posRange={posRange}
        scaleMax={scaleMax}
      />
    </div>
  )
}
