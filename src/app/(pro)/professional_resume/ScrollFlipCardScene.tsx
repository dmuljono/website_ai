"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll /*, Html, Environment*/, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";

// ---- Credit-card shape (1.586:1) and smaller footprint ----
const CARD_WIDTH = 2.4;
const CARD_HEIGHT = CARD_WIDTH / 1.586;
const CARD_RADIUS = CARD_WIDTH * 0.06;
const FLIP_PAGES = 1.0;

function roundedRectShape(w: number, h: number, r: number) {
  const x = -w / 2, y = -h / 2, rr = Math.min(r, Math.min(w, h) / 2);
  const s = new THREE.Shape();
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.quadraticCurveTo(x + w, y, x + w, y + rr);
  s.lineTo(x + w, y + h - rr);
  s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  s.lineTo(x + rr, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - rr);
  s.lineTo(x, y + rr);
  s.quadraticCurveTo(x, y, x + rr, y);
  return s;
}

function Card({ frontUrl, backUrl }: { frontUrl?: string; backUrl?: string }) {
  const group = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  // Load textures (keep small in dev, e.g., <= 1024px)
  const textures = useTexture([frontUrl || "", backUrl || ""]);
  const [frontTex, backTex] = textures as [THREE.Texture, THREE.Texture];
  frontTex.wrapS = frontTex.wrapT = THREE.ClampToEdgeWrapping;
  backTex.wrapS = backTex.wrapT = THREE.ClampToEdgeWrapping;
  frontTex.anisotropy = 2;
  backTex.anisotropy = 2;

  // Fewer segments to lighten geometry
  const bodyGeom = useMemo(() => {
    const shape = roundedRectShape(CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 0.028,
      bevelEnabled: false,
      curveSegments: 16,
    });
    extrude.center();
    return extrude;
  }, []);

  const edgeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.9, metalness: 0.05 }),
    []
  );
  const plane = useMemo(() => new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT, 1, 1), []);

  useFrame((_s, delta) => {
    const t = scroll.offset; // 0..1
    const targetY = Math.PI * (t / FLIP_PAGES); // 0..π (180°)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 8, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, Math.sin(t * Math.PI * 2) * 0.01, 6, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, Math.sin(t * Math.PI * 2) * 0.035, 6, delta);
  });

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      {/* Edge/body */}
      <mesh geometry={bodyGeom} material={edgeMat} />
      {/* Front */}
      <mesh geometry={plane} position={[0, 0, 0.015]}>
        <meshPhysicalMaterial
          map={frontUrl ? frontTex : undefined}
          color={frontUrl ? undefined : 0x222531}
          roughness={0.5}
          clearcoat={0.4}
        />
      </mesh>
      {/* Back */}
      <mesh geometry={plane} position={[0, 0, -0.015]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial
          map={backUrl ? backTex : undefined}
          color={backUrl ? undefined : 0x101217}
          roughness={0.6}
          clearcoat={0.25}
        />
      </mesh>
    </group>
  );
}

// Optional: if you want to see labels later, re-enable and add inside <ScrollControls>
// function OverlayLabels() { /* ... */ }

function CanvasGuard() {
  // Attach context lost/restored handlers (prevents default reload)
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement as HTMLCanvasElement;
    const onLost = (e: Event) => e.preventDefault();
    const onRestored = () => {};
    canvas.addEventListener("webglcontextlost", onLost as any, false);
    canvas.addEventListener("webglcontextrestored", onRestored as any, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost as any, false);
      canvas.removeEventListener("webglcontextrestored", onRestored as any, false);
    };
  }, [gl]);
  return null;
}

export default function ScrollFlipCardScene() {
  return (
    <div className="relative h-full w-full">
      {/* Minimal heading; keep it simple while debugging */}
      <div className="pointer-events-none absolute top-6 left-0 right-0 z-10 text-center text-white/80">
        <h2 className="text-xl md:text-2xl font-semibold">Projects — scroll to flip</h2>
      </div>

      <Canvas
        className="h-full w-full"
        dpr={1}
        frameloop="demand"
        shadows={false}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ fov: 28, position: [0, 0.55, 4.2] }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(1); // keep VRAM usage low in dev
        }}
      >
        <CanvasGuard />
        <ambientLight intensity={0.55} />
        <directionalLight position={[2.8, 3.5, 4]} intensity={0.75} />
        {/* No Environment / fog / ground / shadows for now */}

        {/* Map one sticky viewport (section) to a 180° flip */}
        <ScrollControls pages={1} damping={0.18}>
          <Card frontUrl="/images/card-front.png" backUrl="/images/card-back.png" />
          {/* <OverlayLabels /> */}
        </ScrollControls>
      </Canvas>
    </div>
  );
}
