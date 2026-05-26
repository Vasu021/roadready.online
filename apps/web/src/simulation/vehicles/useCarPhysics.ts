import RAPIER from '@dimforge/rapier3d-compat'
import type { World, RigidBody } from '@dimforge/rapier3d-compat'
import { useEffect, useRef } from 'react'

// Start WASM init as soon as this module is imported — resolves before first frame
const rapierReady = RAPIER.init()

export const CAR_SPAWN = { x: 0, y: 1.5, z: 40 } as const

// Car collider half-extents (metres)
const CAR_HX = 0.9  // half-width  → 1.8 m total
const CAR_HY = 0.35 // half-height → 0.70 m total
const CAR_HZ = 1.8  // half-length → 3.6 m total
const CAR_MASS = 1200 // kg

export function useCarPhysics() {
  const worldRef = useRef<World | null>(null)
  const bodyRef = useRef<RigidBody | null>(null)
  const readyRef = useRef(false)

  useEffect(() => {
    rapierReady.then(() => {
      const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

      // Static ground plane (top surface at Y = 0, matches visual ground mesh)
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(250, 0.1, 250).setTranslation(0, -0.1, 0),
      )

      // Car dynamic body — lock X/Z rotations to prevent tipping
      const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(CAR_SPAWN.x, CAR_SPAWN.y, CAR_SPAWN.z)
        .setLinearDamping(0.9)
        .setAngularDamping(5.0)
      const body = world.createRigidBody(bodyDesc)
      body.setEnabledRotations(false, true, false, true) // only Y (yaw) allowed

      world.createCollider(
        RAPIER.ColliderDesc.cuboid(CAR_HX, CAR_HY, CAR_HZ)
          .setMass(CAR_MASS)
          .setFriction(0.5)
          .setRestitution(0.05),
        body,
      )

      worldRef.current = world
      bodyRef.current = body
      readyRef.current = true
    })

    return () => {
      worldRef.current?.free()
      worldRef.current = null
      bodyRef.current = null
      readyRef.current = false
    }
  }, [])

  return { worldRef, bodyRef, readyRef }
}
