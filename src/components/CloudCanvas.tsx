import { Suspense, useMemo, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// ─── Individual cloud layer mesh ─────────────────────────────────────────────
interface LayerConfig {
  position: [number, number, number];
  rotZ: number;
  scale: number;
  opacity: number;
  uvOffset: [number, number];
  uvRepeat: [number, number];
}

interface CloudLayerProps {
  config: LayerConfig;
  baseTex: THREE.Texture;
  alphaMap: THREE.Texture;
}

function CloudLayer({ config, baseTex, alphaMap }: CloudLayerProps) {
  // Clone + configure UV per layer so they all look distinct
  const tex = useMemo(() => {
    const t = baseTex.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.offset.set(...config.uvOffset);
    t.repeat.set(...config.uvRepeat);
    return t;
  }, [baseTex, config.uvOffset, config.uvRepeat]);

  return (
    <mesh
      position={config.position}
      rotation={[0, 0, config.rotZ]}
      scale={config.scale}
    >
      <planeGeometry args={[16, 16]} />
      <meshBasicMaterial
        map={tex}
        alphaMap={alphaMap}
        transparent
        opacity={config.opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Scene: camera + cloud layers ───────────────────────────────────────────
interface CloudFieldProps {
  progressRef: MutableRefObject<number>;
}

function CloudField({ progressRef }: CloudFieldProps) {
  const { camera } = useThree();

  const cloudTex = useLoader(THREE.TextureLoader, "/clouds.png");

  // Procedural radial alpha map so each plane fades at edges (no hard rect corners)
  const alphaMap = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.55, "rgba(255,255,255,0.95)");
    grad.addColorStop(0.8, "rgba(255,255,255,0.3)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Deterministic cloud layer spread — golden-ratio spiral for natural distribution
  const layers = useMemo<LayerConfig[]>(() => {
    const count = 18;
    const φ = 1.6180339887;
    return Array.from({ length: count }, (_, i) => {
      const s = i * φ;
      return {
        position: [
          Math.sin(s * 2.3) * 9,
          Math.cos(s * 1.9) * 4.5 - 2,
          -i * 8.5,
        ] as [number, number, number],
        rotZ: s * 1.15,
        scale: 2.2 + Math.abs(Math.sin(s * 0.8)) * 3.2,
        opacity: 0.42 + Math.abs(Math.cos(s * 0.65)) * 0.45,
        uvOffset: [(i % 4) * 0.25, Math.floor(i / 4) * 0.25] as [number, number],
        uvRepeat: [0.45 + (Math.abs(Math.sin(s)) * 0.3), 0.45 + (Math.abs(Math.cos(s)) * 0.3)] as [number, number],
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const t = clock.getElapsedTime();

    // Camera flies forward through the cloud tunnel as scroll progresses
    const targetZ = 28 - p * 168;
    (camera as THREE.PerspectiveCamera).position.z +=
      (targetZ - (camera as THREE.PerspectiveCamera).position.z) * 0.08;

    // Subtle ambient drift (atmospheric feel)
    (camera as THREE.PerspectiveCamera).position.x = Math.sin(t * 0.16) * 0.7;
    (camera as THREE.PerspectiveCamera).position.y = Math.cos(t * 0.12) * 0.45 - 0.4;
  });

  return (
    <>
      {/* Far background sky plane — full-res, no scaling issues */}
      <mesh position={[0, 0, -160]}>
        <planeGeometry args={[320, 320]} />
        <meshBasicMaterial map={cloudTex} />
      </mesh>

      {/* Depth cloud planes — camera moves through these */}
      {layers.map((config, i) => (
        <CloudLayer key={i} config={config} baseTex={cloudTex} alphaMap={alphaMap} />
      ))}
    </>
  );
}

// ─── Exported canvas component ───────────────────────────────────────────────
interface CloudCanvasProps {
  progressRef: MutableRefObject<number>;
}

export function CloudCanvas({ progressRef }: CloudCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 28], fov: 68, near: 0.1, far: 1200 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, Math.min(window.devicePixelRatio, 2)]}
    >
      <Suspense fallback={null}>
        <CloudField progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
