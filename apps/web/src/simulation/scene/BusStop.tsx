import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  /** Yaw so the shelter opening faces the road. */
  rotationY?: number;
}

const PX = 128;

/** German bus-stop "H" plate: yellow square, green ring + green H. */
function makeHSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = PX;
  canvas.height = PX;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#f5c842";
    ctx.fillRect(0, 0, PX, PX);
    ctx.strokeStyle = "#0f7a3d";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(PX / 2, PX / 2, 44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#0f7a3d";
    ctx.fillRect(46, 38, 10, 52); // left bar of H
    ctx.fillRect(72, 38, 10, 52); // right bar
    ctx.fillRect(46, 59, 36, 10); // crossbar
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Bus stop: "H" sign on a pole + a simple glass shelter with a bench. */
export default function BusStop({ position, rotationY = 0 }: Props) {
  const sign = useMemo(makeHSignTexture, []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ── Shelter ───────────────────────────────────────────── */}
      {/* Posts */}
      {(
        [
          [-1.4, -0.55],
          [1.4, -0.55],
          [-1.4, 0.55],
          [1.4, 0.55],
        ] as const
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 1.1, z]} castShadow>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <meshStandardMaterial
            color="#3b3f45"
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
      ))}
      {/* Roof */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <boxGeometry args={[3.1, 0.1, 1.4]} />
        <meshStandardMaterial color="#4a4f55" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Back glass wall */}
      <mesh position={[0, 1.2, -0.6]}>
        <boxGeometry args={[3.0, 1.8, 0.04]} />
        <meshStandardMaterial
          color="#a9c4d8"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* Bench inside */}
      <mesh position={[0, 0.45, -0.35]} castShadow>
        <boxGeometry args={[2.4, 0.08, 0.4]} />
        <meshStandardMaterial color="#6b4f2a" roughness={0.9} />
      </mesh>

      {/* ── H sign on a pole at the kerb side ─────────────────── */}
      <mesh position={[1.9, 1.4, 0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 2.8, 8]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[1.9, 2.7, 0.4]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial
          map={sign}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
