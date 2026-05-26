import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCarControls } from './useCarControls'
import { useCarPhysics, CAR_SPAWN } from './useCarPhysics'
import { useGameStore } from '../../store/gameStore'

// ─── Physics tuning ───────────────────────────────────────────────────────────
const ENGINE_FORCE = 12_000  // N  — forward thrust
const BRAKE_FORCE = 22_000   // N  — braking (stronger than engine for short stops)
const REVERSE_FORCE = 6_000  // N  — reverse thrust
const MAX_SPEED = 14.0       // m/s ≈ 50 km/h
const MAX_REVERSE = 4.0      // m/s ≈ 14 km/h
const LATERAL_GRIP = 0.92    // 0–1: how hard tires resist sideways sliding
const MAX_STEER_RATE = 1.5   // rad/s at standstill, eased off at speed
const CAR_MASS = 1200        // must match useCarPhysics

// ─── Pre-allocated vectors (avoids per-frame heap allocation) ─────────────────
const _vel = new THREE.Vector3()
const _fwd = new THREE.Vector3()
const _right = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _euler = new THREE.Euler()
const _impulse = new THREE.Vector3()

export default function CarController() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const controls = useCarControls()
  const { worldRef, bodyRef, readyRef } = useCarPhysics()
  const setCarState = useGameStore((s) => s.setCarState)

  useFrame((_, delta) => {
    if (!readyRef.current || !bodyRef.current || !worldRef.current) return

    const body = bodyRef.current
    const world = worldRef.current
    const { forward, backward, left, right, handbrake, reset } = controls.current

    // ── Reset ──────────────────────────────────────────────────────────────────
    if (reset) {
      body.setTranslation({ x: CAR_SPAWN.x, y: CAR_SPAWN.y, z: CAR_SPAWN.z }, true)
      body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)
      body.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }

    // ── Read body state ────────────────────────────────────────────────────────
    const rapierVel = body.linvel()
    const rapierRot = body.rotation()

    _quat.set(rapierRot.x, rapierRot.y, rapierRot.z, rapierRot.w)

    // Car's local axes in world space (-Z = forward in Three.js convention)
    _fwd.set(0, 0, -1).applyQuaternion(_quat)
    _right.set(1, 0, 0).applyQuaternion(_quat)

    _vel.set(rapierVel.x, rapierVel.y, rapierVel.z)
    const forwardSpeed = _vel.dot(_fwd)  // positive → moving forward
    const lateralSpeed = _vel.dot(_right)

    // ── Lateral grip — cancel sideways velocity each frame ─────────────────────
    // This is what makes it feel like a car and not an air hockey puck
    const gripImpulse = -lateralSpeed * LATERAL_GRIP * CAR_MASS * delta
    _impulse.copy(_right).multiplyScalar(gripImpulse)
    body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true)

    // ── Drive / brake ──────────────────────────────────────────────────────────
    if (!handbrake) {
      if (forward && forwardSpeed < MAX_SPEED) {
        // Torque-curve taper: full force until ~80 % of max speed, then ease off
        const taper = Math.max(0, 1 - forwardSpeed / MAX_SPEED)
        _impulse.copy(_fwd).multiplyScalar(ENGINE_FORCE * taper * delta)
        body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true)
      }

      if (backward) {
        if (forwardSpeed > 0.5) {
          // Moving forward: brake
          _impulse.copy(_fwd).multiplyScalar(-BRAKE_FORCE * delta)
          body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true)
        } else if (forwardSpeed > -MAX_REVERSE) {
          // Stopped or reversing: accelerate in reverse
          const taper = Math.max(0, 1 + forwardSpeed / MAX_REVERSE)
          _impulse.copy(_fwd).multiplyScalar(-REVERSE_FORCE * taper * delta)
          body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true)
        }
      }
    }

    // ── Steering ───────────────────────────────────────────────────────────────
    const steerInput = (left ? 1 : 0) - (right ? 1 : 0)
    const absSpeed = Math.abs(forwardSpeed)

    if (steerInput !== 0 && absSpeed > 0.3) {
      // Reduce steer authority at speed — prevents snap-oversteer at high velocity
      const speedFactor = Math.min(absSpeed / MAX_SPEED, 1)
      const steerRate = MAX_STEER_RATE * (1 - speedFactor * 0.65)
      // Flip steer direction when reversing so it feels natural
      const dirSign = forwardSpeed >= 0 ? 1 : -1
      body.setAngvel({ x: 0, y: steerInput * steerRate * dirSign, z: 0 }, true)
    } else {
      // Dampen residual yaw when not actively steering
      const av = body.angvel()
      body.setAngvel({ x: 0, y: av.y * 0.75, z: 0 }, true)
    }

    // ── Step physics ───────────────────────────────────────────────────────────
    world.timestep = Math.min(delta, 1 / 30) // cap at 30 fps equivalent
    world.step()

    // ── Sync mesh ──────────────────────────────────────────────────────────────
    const pos = body.translation()
    const rot = body.rotation()
    meshRef.current.position.set(pos.x, pos.y, pos.z)
    meshRef.current.quaternion.set(rot.x, rot.y, rot.z, rot.w)

    // ── Export to game store ───────────────────────────────────────────────────
    _quat.set(rot.x, rot.y, rot.z, rot.w)
    _euler.setFromQuaternion(_quat)
    setCarState({
      position: [pos.x, pos.y, pos.z],
      rotation: [_euler.x, _euler.y, _euler.z],
      velocity: Math.round(Math.abs(forwardSpeed) * 3.6), // m/s → km/h, integer
      isHandbraking: handbrake,
    })
  })

  return (
    <mesh
      ref={meshRef}
      position={[CAR_SPAWN.x, CAR_SPAWN.y, CAR_SPAWN.z]}
      castShadow
      receiveShadow
    >
      {/* 1.8 m wide × 0.7 m tall × 3.6 m long placeholder body */}
      <boxGeometry args={[1.8, 0.7, 3.6]} />
      <meshStandardMaterial color="#2563eb" roughness={0.45} metalness={0.35} />
    </mesh>
  )
}
