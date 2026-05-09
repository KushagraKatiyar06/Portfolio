import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, CameraShake } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import Garage from './components/Garage'
import Car from './components/Car'
import BlobShadow from './components/BlobShadow'

import garageUrl from '../models/garage_nfs_2015.glb?url'
import rx7Url from '../models/rx7_fd.glb?url'
import carreraUrl from '../models/carrera_gt.glb?url'

useGLTF.preload(garageUrl)
useGLTF.preload(rx7Url)
useGLTF.preload(carreraUrl)

const DEG = Math.PI / 180

function CameraDebug({ controlsRef, domRef }) {
  useFrame(({ camera }) => {
    if (!domRef.current) return
    const p = camera.position
    const t = controlsRef.current?.target
    domRef.current.innerHTML =
      `<span style="color:#888">pos</span>  [${p.x.toFixed(4)}, ${p.y.toFixed(4)}, ${p.z.toFixed(4)}]<br/>` +
      (t ? `<span style="color:#888">tgt</span>  [${t.x.toFixed(4)}, ${t.y.toFixed(4)}, ${t.z.toFixed(4)}]` : '')
  })
  return null
}

export default function App() {
  const controlsRef = useRef()
  const debugDomRef = useRef()

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [-0.7412, -0.1175, 0.7313], fov: 60 }}>
        <color attach="background" args={['#111']} />
        <ambientLight intensity={2} />
        <directionalLight position={[0, 2, 1]} intensity={2} />
        <Suspense fallback={null}>
          <Environment preset="warehouse" />
          <Garage url={garageUrl} />

          <Car url={carreraUrl} position={[-0.47, -0.2335, 0.45]} rotation={[0, 106 * DEG, 0]} scale={0.09} />
          <Car url={rx7Url}     position={[-0.60, -0.09,   0.10]} rotation={[0,  50 * DEG, 0]} scale={0.12} />

          <BlobShadow position={[-0.5, -0.225, 0.46]} width={0.665} length={0.36} opacity={0.85} />
          <BlobShadow position={[-0.397, -0.225, 0.008]} width={0.665} length={0.36} opacity={0.85} yRotation={-43 * DEG} />

        </Suspense>

        <OrbitControls ref={controlsRef} target={[-0.485, -0.155, 0.43]} makeDefault enableDamping dampingFactor={0.06} />
        <CameraShake maxYaw={0.10} maxPitch={0.10} maxRoll={0.006} yawFrequency={0.15} pitchFrequency={0.15} rollFrequency={0.2} intensity={0.8} />
        <CameraDebug controlsRef={controlsRef} domRef={debugDomRef} />

      </Canvas>

      <div
        ref={debugDomRef}
        style={{
          position: 'fixed', bottom: 16, left: 16,
          background: 'rgba(0,0,0,0.8)', color: '#00ff88',
          fontFamily: 'monospace', fontSize: 13,
          padding: '8px 14px', borderRadius: 8, lineHeight: 1.8,
          pointerEvents: 'none', zIndex: 1000,
          border: '1px solid rgba(0,255,136,0.2)',
        }}
      />
    </div>
  )
}
