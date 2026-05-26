export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#b0c8d8" />
      <directionalLight
        position={[50, 80, 30]}
        intensity={1.8}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
    </>
  )
}
