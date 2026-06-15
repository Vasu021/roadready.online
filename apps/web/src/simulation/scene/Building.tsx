import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type BuildingStyle = "altbau" | "fachwerk" | "shop" | "modern";

interface Props {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  color: string;
  roofColor?: string;
  style?: BuildingStyle;
}

// ─── Geometry helpers (run in useMemo — never per frame) ────────────────────────

const STOREY_H = 2.8;

/** A unit-box instance matrix at (px,py,pz) scaled to (sx,sy,sz), optional Z roll. */
function boxMat(
  px: number,
  py: number,
  pz: number,
  sx: number,
  sy: number,
  sz: number,
  rotZ = 0,
): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(px, py, pz),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, rotZ)),
    new THREE.Vector3(sx, sy, sz),
  );
}

/** Evenly spread `n` columns across a face of length `len` (with edge margin). */
function columns(len: number): number[] {
  const n = Math.max(1, Math.floor((len - 1.0) / 2.2));
  if (n === 1) return [0];
  const span = len - 1.6;
  return Array.from({ length: n }, (_, i) => -span / 2 + (span * i) / (n - 1));
}

function windowMatrices(
  width: number,
  depth: number,
  height: number,
  skipGround: boolean,
): THREE.Matrix4[] {
  const n = Math.max(1, Math.round(height / STOREY_H));
  const sh = height / n;
  const wH = Math.min(1.4, sh * 0.5);
  const wW = 0.8;
  const t = 0.1;
  const colX = columns(width);
  const colZ = columns(depth);
  const out: THREE.Matrix4[] = [];
  for (let s = skipGround ? 1 : 0; s < n; s++) {
    const y = (s + 0.5) * sh;
    for (const x of colX) {
      out.push(boxMat(x, y, depth / 2 + 0.01, wW, wH, t));
      out.push(boxMat(x, y, -depth / 2 - 0.01, wW, wH, t));
    }
    for (const z of colZ) {
      out.push(boxMat(width / 2 + 0.01, y, z, t, wH, wW));
      out.push(boxMat(-width / 2 - 0.01, y, z, t, wH, wW));
    }
  }
  return out;
}

function beamMatrices(
  width: number,
  depth: number,
  height: number,
): THREE.Matrix4[] {
  const n = Math.max(1, Math.round(height / STOREY_H));
  const sh = height / n;
  const bt = 0.16;
  const out: THREE.Matrix4[] = [];
  // Corner posts
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      out.push(
        boxMat(
          sx * (width / 2 - 0.02),
          height / 2,
          sz * (depth / 2 - 0.02),
          bt,
          height,
          bt,
        ),
      );
  // Horizontal beams per storey line on front + back
  for (let s = 0; s <= n; s++) {
    const y = Math.min(s * sh, height - 0.05);
    out.push(boxMat(0, y, depth / 2 - 0.01, width, bt, bt));
    out.push(boxMat(0, y, -depth / 2 + 0.01, width, bt, bt));
  }
  // Vertical studs across the width on front + back
  const studs = Math.max(1, Math.floor(width / 2.0));
  for (let i = 1; i < studs; i++) {
    const x = -width / 2 + (width * i) / studs;
    out.push(boxMat(x, height / 2, depth / 2 - 0.01, bt, height, bt));
    out.push(boxMat(x, height / 2, -depth / 2 + 0.01, bt, height, bt));
  }
  // Diagonal X-braces on front + back
  const diag = Math.sqrt(width * width + height * height);
  const ang = Math.atan2(height, width);
  for (const z of [depth / 2 - 0.01, -depth / 2 + 0.01]) {
    out.push(boxMat(0, height / 2, z, diag, bt, bt, ang));
    out.push(boxMat(0, height / 2, z, diag, bt, bt, -ang));
  }
  return out;
}

// ─── Instanced unit boxes (windows / timber beams) ──────────────────────────────

function InstancedBoxes({
  matrices,
  color,
  emissive,
  emissiveIntensity = 0,
  roughness = 0.8,
  metalness = 0.05,
  castShadow = false,
}: {
  matrices: THREE.Matrix4[];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  castShadow?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [matrices]);

  if (matrices.length === 0) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, matrices.length]}
      castShadow={castShadow}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissiveIntensity}
        roughness={roughness}
        metalness={metalness}
      />
    </instancedMesh>
  );
}

// ─── Modern (legacy) building — flat box + roof lip ─────────────────────────────

function ModernBuilding({
  position,
  width,
  depth,
  height,
  color,
  roofColor,
}: Props) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0, height + 0.12, 0]} castShadow>
        <boxGeometry args={[width + 0.2, 0.24, depth + 0.2]} />
        <meshStandardMaterial color={roofColor ?? "#555"} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── German building — altbau / fachwerk / shop ─────────────────────────────────

function GermanBuilding({
  position,
  width,
  depth,
  height,
  color,
  roofColor,
  style = "altbau",
}: Props) {
  const isFachwerk = style === "fachwerk";
  const isShop = style === "shop";
  const bodyColor = isFachwerk ? "#e8ddc7" : color;

  const windows = useMemo(
    () => windowMatrices(width, depth, height, isShop),
    [width, depth, height, isShop],
  );
  const beams = useMemo(
    () => (isFachwerk ? beamMatrices(width, depth, height) : []),
    [width, depth, height, isFachwerk],
  );

  const roofGeo = useMemo(() => {
    const pitch = isFachwerk ? 0.85 : 0.55;
    const roofH = THREE.MathUtils.clamp(
      Math.min(width, depth) * pitch,
      1.2,
      3.4,
    );
    const w = width + 0.5;
    const d = depth + 0.5;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(0, roofH);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: d,
      bevelEnabled: false,
      steps: 1,
    });
    geo.translate(0, 0, -d / 2);
    geo.computeVertexNormals();
    return geo;
  }, [width, depth, isFachwerk]);

  useEffect(() => () => roofGeo.dispose(), [roofGeo]);

  const n = Math.max(1, Math.round(height / STOREY_H));
  const sh = height / n;

  return (
    <group position={position}>
      {/* Plastered body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.9}
          metalness={0.03}
        />
      </mesh>

      {/* Windows */}
      <InstancedBoxes
        matrices={windows}
        color="#243447"
        emissive="#e8c270"
        emissiveIntensity={0.12}
        roughness={0.4}
        metalness={0.1}
      />

      {/* Half-timber beams */}
      {isFachwerk && (
        <InstancedBoxes
          matrices={beams}
          color="#4a3525"
          roughness={0.85}
          castShadow
        />
      )}

      {/* Cornice trim under the roof */}
      <mesh position={[0, height - 0.18, 0]} castShadow>
        <boxGeometry args={[width + 0.25, 0.3, depth + 0.25]} />
        <meshStandardMaterial color="#d8cdb8" roughness={0.85} />
      </mesh>

      {/* Gabled tile roof */}
      <mesh
        position={[0, height, 0]}
        geometry={roofGeo}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={roofColor ?? "#9b4a3a"} roughness={0.85} />
      </mesh>

      {/* Shopfront on the ground floor */}
      {isShop && (
        <>
          <mesh position={[0, sh * 0.42, depth / 2 + 0.04]}>
            <boxGeometry args={[width * 0.82, sh * 0.62, 0.06]} />
            <meshStandardMaterial
              color="#16222e"
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
          <mesh
            position={[0, sh * 0.82, depth / 2 + 0.3]}
            rotation={[-0.25, 0, 0]}
            castShadow
          >
            <boxGeometry args={[width * 0.86, 0.08, 0.5]} />
            <meshStandardMaterial color="#b23b3b" roughness={0.7} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function Building(props: Props) {
  if ((props.style ?? "modern") === "modern")
    return <ModernBuilding {...props} />;
  return <GermanBuilding {...props} />;
}
