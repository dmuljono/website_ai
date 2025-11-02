"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

function SpinBox() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_s, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.8;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#7cc4ff" />
    </mesh>
  );
}

export default function DebugBoxScene() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        className="h-full w-full"
        // Keep VRAM usage tiny in dev to avoid context lost
        dpr={1}
        shadows={false}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ fov: 35, position: [0, 0, 4] }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} />
        <SpinBox />
      </Canvas>
    </div>
  );
}
