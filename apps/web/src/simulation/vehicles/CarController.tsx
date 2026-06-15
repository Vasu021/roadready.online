import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { World, RigidBody } from "@dimforge/rapier3d-compat";
import { useCarControls } from "./useCarControls";
import { useCarPhysics, CAR_SPAWN } from "./useCarPhysics";
import { useGameStore } from "../../store/gameStore";
import type { Waypoint } from "../scenarios/types";

// ─── Physics tuning ───────────────────────────────────────────────────────────
const ENGINE_FORCE = 12_000;
const BRAKE_FORCE = 22_000;
const REVERSE_FORCE = 6_000;
const MAX_SPEED = 14.0;
const MAX_REVERSE = 4.0;
const LATERAL_GRIP = 0.92;
const MAX_STEER_RATE = 1.5;
const CAR_MASS = 1200;

const AUTO_STEER_GAIN = 3.0;
const AUTO_STEER_MAX = 2.2;
const WAYPOINT_REACH_DIST = 3.0;

// ─── Pre-allocated vectors ────────────────────────────────────────────────────
const _vel = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _impulse = new THREE.Vector3();

// ─── Procedural car mesh ──────────────────────────────────────────────────────
// Physics body center is at y≈0.35 when the car rests on the ground.
// All local positions below are relative to that center.

const BODY_COLOR = "#1e3a8a";
const CABIN_COLOR = "#1e40af";
const GLASS_COLOR = "#7dd3fc";
const WHEEL_COLOR = "#111827";
const HUB_COLOR = "#9ca3af";

const WHEEL_POSITIONS: [number, number, number][] = [
  [-0.95, -0.07, 1.28],
  [0.95, -0.07, 1.28],
  [-0.95, -0.07, -1.22],
  [0.95, -0.07, -1.22],
];

function CarMesh() {
  return (
    <group>
      {/* Chassis */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.7, 3.8]} />
        <meshStandardMaterial
          color={BODY_COLOR}
          roughness={0.3}
          metalness={0.65}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.62, 0.08]} castShadow>
        <boxGeometry args={[1.55, 0.52, 1.95]} />
        <meshStandardMaterial
          color={CABIN_COLOR}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.6, 1.02]}>
        <boxGeometry args={[1.5, 0.46, 0.06]} />
        <meshStandardMaterial
          color={GLASS_COLOR}
          transparent
          opacity={0.55}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.6, -0.88]}>
        <boxGeometry args={[1.5, 0.44, 0.06]} />
        <meshStandardMaterial
          color={GLASS_COLOR}
          transparent
          opacity={0.5}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Side windows */}
      {([-0.79, 0.79] as const).map((x, i) => (
        <mesh key={i} position={[x, 0.61, 0.08]}>
          <boxGeometry args={[0.06, 0.42, 1.72]} />
          <meshStandardMaterial
            color={GLASS_COLOR}
            transparent
            opacity={0.45}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Wheels */}
      {WHEEL_POSITIONS.map(([wx, wy, wz], i) => (
        <group key={i} position={[wx, wy, wz]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
            <meshStandardMaterial color={WHEEL_COLOR} roughness={0.85} />
          </mesh>
          {/* Hubcap facing outward */}
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            position={[Math.sign(wx) * 0.12, 0, 0]}
          >
            <cylinderGeometry args={[0.14, 0.14, 0.03, 8]} />
            <meshStandardMaterial
              color={HUB_COLOR}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {([-0.52, 0.52] as const).map((x, i) => (
        <mesh key={i} position={[x, 0.05, 1.92]}>
          <boxGeometry args={[0.38, 0.18, 0.05]} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Taillights */}
      {([-0.52, 0.52] as const).map((x, i) => (
        <mesh key={i} position={[x, 0.05, -1.92]}>
          <boxGeometry args={[0.38, 0.18, 0.05]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Front bumper */}
      <mesh position={[0, -0.22, 1.9]} castShadow>
        <boxGeometry args={[1.72, 0.22, 0.12]} />
        <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[0, -0.22, -1.9]} castShadow>
        <boxGeometry args={[1.72, 0.22, 0.12]} />
        <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Main controller ──────────────────────────────────────────────────────────

interface Props {
  waypoints?: Waypoint[];
}

export default function CarController({ waypoints = [] }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const controls = useCarControls();
  const { worldRef, bodyRef, readyRef } = useCarPhysics();
  const setCarState = useGameStore((s) => s.setCarState);

  const waypointIndexRef = useRef(0);
  const runIdRef = useRef(useGameStore.getState().runId);

  useEffect(() => {
    waypointIndexRef.current = 0;
  }, [waypoints]);

  useFrame((_, delta) => {
    if (!readyRef.current || !bodyRef.current || !worldRef.current) return;

    const body = bodyRef.current;
    const world = worldRef.current;
    const store = useGameStore.getState();

    if (store.isPaused || store.scenarioPhase !== "running") return;

    // ── New run (mount / Retry): snap the car back to spawn ────────────────────
    if (runIdRef.current !== store.runId) {
      runIdRef.current = store.runId;
      body.setTranslation(
        { x: CAR_SPAWN.x, y: CAR_SPAWN.y, z: CAR_SPAWN.z },
        true,
      );
      body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      waypointIndexRef.current = 0;
    }

    const { forward, backward, left, right, handbrake, reset } =
      controls.current;

    // ── Reset ─────────────────────────────────────────────────────────────────
    if (reset) {
      body.setTranslation(
        { x: CAR_SPAWN.x, y: CAR_SPAWN.y, z: CAR_SPAWN.z },
        true,
      );
      body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      waypointIndexRef.current = 0;
    }

    // ── Read physics state ────────────────────────────────────────────────────
    const rapierVel = body.linvel();
    const rapierRot = body.rotation();

    _quat.set(rapierRot.x, rapierRot.y, rapierRot.z, rapierRot.w);
    _euler.setFromQuaternion(_quat);
    _fwd.set(0, 0, -1).applyQuaternion(_quat);
    _right.set(1, 0, 0).applyQuaternion(_quat);
    _vel.set(rapierVel.x, rapierVel.y, rapierVel.z);

    const forwardSpeed = _vel.dot(_fwd);
    const lateralSpeed = _vel.dot(_right);

    // ── Lateral grip ──────────────────────────────────────────────────────────
    const gripImpulse = -lateralSpeed * LATERAL_GRIP * CAR_MASS * delta;
    _impulse.copy(_right).multiplyScalar(gripImpulse);
    body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true);

    // ── Paused for input: brake car while an overlay is open ───────────────────
    // Any decision overlay (legacy key-press challenge, teaching panel, or MCQ
    // popup) holds the car still. TriggerWatcher opens these; the car resumes
    // once the store clears them.
    const pausedForInput =
      store.activeChallenge?.result === "pending" ||
      store.activeTeaching !== null ||
      store.activeMcq !== null;
    if (pausedForInput) {
      if (forwardSpeed > 0.05) {
        _impulse.copy(_fwd).multiplyScalar(-BRAKE_FORCE * delta);
        body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true);
      }
      const av = body.angvel();
      body.setAngvel({ x: 0, y: av.y * 0.4, z: 0 }, true);
      syncAndExport(body, world, delta, forwardSpeed, handbrake);
      return;
    }

    const isAuto = store.driveMode === "auto" && waypoints.length > 0;

    if (isAuto) {
      const pos = body.translation();

      // Autopilot waypoint following
      const wp = waypoints[waypointIndexRef.current];
      if (wp) {
        const dx = wp.x - pos.x;
        const dz = wp.z - pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < WAYPOINT_REACH_DIST) {
          waypointIndexRef.current = Math.min(
            waypointIndexRef.current + 1,
            waypoints.length - 1,
          );
        } else {
          // Proportional steering: desired yaw = atan2(-dx, -dz)
          const desiredYaw = Math.atan2(-dx, -dz);
          let angleDiff = desiredYaw - _euler.y;
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

          const steerY = Math.max(
            -AUTO_STEER_MAX,
            Math.min(AUTO_STEER_MAX, angleDiff * AUTO_STEER_GAIN),
          );
          body.setAngvel({ x: 0, y: steerY, z: 0 }, true);

          if (forwardSpeed < wp.speed - 0.2) {
            const taper = Math.max(0, 1 - forwardSpeed / MAX_SPEED);
            _impulse.copy(_fwd).multiplyScalar(ENGINE_FORCE * taper * delta);
            body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true);
          } else if (forwardSpeed > wp.speed + 0.5) {
            _impulse.copy(_fwd).multiplyScalar(-BRAKE_FORCE * 0.35 * delta);
            body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true);
          }
        }
      }
    } else {
      // ── Manual controls ───────────────────────────────────────────────────────
      if (!handbrake) {
        if (forward && forwardSpeed < MAX_SPEED) {
          const taper = Math.max(0, 1 - forwardSpeed / MAX_SPEED);
          _impulse.copy(_fwd).multiplyScalar(ENGINE_FORCE * taper * delta);
          body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true);
        }
        if (backward) {
          if (forwardSpeed > 0.5) {
            _impulse.copy(_fwd).multiplyScalar(-BRAKE_FORCE * delta);
            body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true);
          } else if (forwardSpeed > -MAX_REVERSE) {
            const taper = Math.max(0, 1 + forwardSpeed / MAX_REVERSE);
            _impulse.copy(_fwd).multiplyScalar(-REVERSE_FORCE * taper * delta);
            body.applyImpulse({ x: _impulse.x, y: 0, z: _impulse.z }, true);
          }
        }
      }
      const steerInput = (left ? 1 : 0) - (right ? 1 : 0);
      const absSpeed = Math.abs(forwardSpeed);
      if (steerInput !== 0 && absSpeed > 0.3) {
        const speedFactor = Math.min(absSpeed / MAX_SPEED, 1);
        const steerRate = MAX_STEER_RATE * (1 - speedFactor * 0.65);
        const dirSign = forwardSpeed >= 0 ? 1 : -1;
        body.setAngvel(
          { x: 0, y: steerInput * steerRate * dirSign, z: 0 },
          true,
        );
      } else {
        const av = body.angvel();
        body.setAngvel({ x: 0, y: av.y * 0.75, z: 0 }, true);
      }
    }

    syncAndExport(body, world, delta, forwardSpeed, handbrake);
  });

  function syncAndExport(
    body: RigidBody | null,
    world: World | null,
    delta: number,
    forwardSpeed: number,
    handbrake: boolean,
  ) {
    if (!body || !world) return;
    world.timestep = Math.min(delta, 1 / 30);
    world.step();

    const pos = body.translation();
    const rot = body.rotation();
    groupRef.current.position.set(pos.x, pos.y, pos.z);
    groupRef.current.quaternion.set(rot.x, rot.y, rot.z, rot.w);

    _quat.set(rot.x, rot.y, rot.z, rot.w);
    _euler.setFromQuaternion(_quat);
    setCarState({
      position: [pos.x, pos.y, pos.z],
      rotation: [_euler.x, _euler.y, _euler.z],
      velocity: Math.round(Math.abs(forwardSpeed) * 3.6),
      isHandbraking: handbrake,
    });
  }

  return (
    <group ref={groupRef} position={[CAR_SPAWN.x, CAR_SPAWN.y, CAR_SPAWN.z]}>
      <CarMesh />
    </group>
  );
}
