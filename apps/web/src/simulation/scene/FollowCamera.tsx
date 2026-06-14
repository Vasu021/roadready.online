import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../../store/gameStore";

// Pre-allocated to avoid garbage collection pressure
const _wantedPos = new THREE.Vector3();
const _wantedLook = new THREE.Vector3();

const CAM_BACK = 11; // metres behind the car
const CAM_UP = 5; // metres above the car
const CAM_AHEAD = 5; // metres ahead for the look-at target

export default function FollowCamera() {
  // _currentLook persists between frames for smooth look interpolation
  const lookRef = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((state) => {
    const carState = useGameStore.getState().carState;
    if (!carState) return;

    const [cx, cy, cz] = carState.position;
    const rotY = carState.rotation[1]; // Euler-Y yaw from the physics body

    // Car's forward direction in XZ: (-sin θ, 0, -cos θ)
    // Camera sits CAM_BACK units behind, i.e. in the opposite direction.
    const sinY = Math.sin(rotY);
    const cosY = Math.cos(rotY);

    _wantedPos.set(cx + sinY * CAM_BACK, cy + CAM_UP, cz + cosY * CAM_BACK);

    // Look target: slightly ahead of the car at road-level height
    _wantedLook.set(cx - sinY * CAM_AHEAD, cy + 1, cz - cosY * CAM_AHEAD);

    // Camera position: smooth lerp (slight lag for cinematic feel)
    state.camera.position.lerp(_wantedPos, 0.1);

    // Look target: slightly faster lerp so it snaps to turns quickly
    lookRef.current.lerp(_wantedLook, 0.15);
    state.camera.lookAt(lookRef.current);
  });

  return null;
}
