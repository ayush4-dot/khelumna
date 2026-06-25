"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Dark pitch green palette ── */
const COLORS = {
  pitchDark: new THREE.Color("#0f2d1a"),
  pitch: new THREE.Color("#1a472a"),
  gold: new THREE.Color("#E8A317"),
  softGreen: new THREE.Color("#4ADE80"),
  white: new THREE.Color("#FFFFFF"),
};

/* ── Create a football (soccer ball) texture procedurally ── */
function createFootballTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // White base
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  // Draw black pentagon pattern (simplified soccer ball look)
  ctx.fillStyle = "#1a1a1a";
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;

  const pentagons = [
    { x: 256, y: 128, r: 55 },
    { x: 128, y: 280, r: 50 },
    { x: 384, y: 280, r: 50 },
    { x: 180, y: 440, r: 48 },
    { x: 340, y: 440, r: 48 },
    { x: 256, y: 60, r: 42 },
    { x: 60, y: 160, r: 38 },
    { x: 452, y: 160, r: 38 },
    { x: 60, y: 400, r: 38 },
    { x: 452, y: 400, r: 38 },
    { x: 256, y: 480, r: 42 },
  ];

  pentagons.forEach(({ x, y, r }) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Draw hex seam lines between pentagons
  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 2;
  const seams = [
    [pentagons[0], pentagons[1]],
    [pentagons[0], pentagons[2]],
    [pentagons[1], pentagons[3]],
    [pentagons[2], pentagons[4]],
    [pentagons[3], pentagons[4]],
    [pentagons[0], pentagons[5]],
    [pentagons[1], pentagons[6]],
    [pentagons[2], pentagons[7]],
    [pentagons[3], pentagons[8]],
    [pentagons[4], pentagons[9]],
    [pentagons[3], pentagons[10]],
    [pentagons[4], pentagons[10]],
  ];
  seams.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/* ── GPU Particle field ── */
function ParticleField({ count = 120 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [COLORS.gold, COLORS.softGreen, COLORS.white];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3 + 1] += Math.sin(t * 0.3 + i * 0.1) * 0.002;
      posArr[i3] += Math.cos(t * 0.2 + i * 0.15) * 0.001;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Football (soccer ball) ── */
function Football({
  position,
  size = 0.3,
  speed = 1,
  rotationSpeed = 0.5,
}: {
  position: [number, number, number];
  size?: number;
  speed?: number;
  rotationSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const texture = useMemo(() => createFootballTexture(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x += 0.004 * rotationSpeed;
    meshRef.current.rotation.y += 0.006 * rotationSpeed;
    meshRef.current.rotation.z += 0.002 * rotationSpeed;
    meshRef.current.position.y = position[1] + Math.sin(t * speed * 0.5 + offset) * 0.5;
    meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.3 + offset) * 0.25;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.4}
        metalness={0.05}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

/* ── Glowing ring ── */
function GlowRing({ radius = 3, color = COLORS.gold }: { radius?: number; color?: THREE.Color }) {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.15) * 0.1;
    ringRef.current.rotation.z = t * 0.05;
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}

/* ── Mouse-reactive camera ── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x * 0.8 - target.current.x) * 0.03;
    target.current.y += (-mouse.current.y * 0.5 - target.current.y) * 0.03;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y + 0.3;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Stadium lights ── */
function StadiumLights() {
  const light1 = useRef<THREE.PointLight>(null!);
  const light2 = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light1.current) {
      light1.current.intensity = 15 + Math.sin(t * 0.8) * 5;
      light1.current.position.x = Math.sin(t * 0.2) * 4;
    }
    if (light2.current) {
      light2.current.intensity = 10 + Math.cos(t * 0.6) * 3;
      light2.current.position.x = Math.cos(t * 0.3) * 3;
    }
  });

  return (
    <>
      <pointLight ref={light1} position={[3, 5, 3]} color="#FFF5E6" intensity={15} distance={22} decay={2} />
      <pointLight ref={light2} position={[-4, 4, 2]} color="#E8A317" intensity={10} distance={18} decay={2} />
    </>
  );
}

/* ── Football positions — pushed to edges, smaller, behind content ── */
const FOOTBALL_CONFIGS = [
  { pos: [-5.5, 2.0, -3] as [number, number, number], size: 0.35, speed: 0.7, rot: 0.4 },
  { pos: [5.5, -1.0, -4] as [number, number, number], size: 0.3, speed: 1.0, rot: 0.6 },
  { pos: [-4.5, -2.5, -2] as [number, number, number], size: 0.22, speed: 0.9, rot: 0.8 },
  { pos: [4.5, 2.8, -3.5] as [number, number, number], size: 0.28, speed: 1.2, rot: 0.5 },
  { pos: [-6, -0.5, -5] as [number, number, number], size: 0.32, speed: 0.6, rot: 0.3 },
  { pos: [6, 0.5, -5] as [number, number, number], size: 0.25, speed: 1.4, rot: 0.9 },
  { pos: [0.5, -3.5, -4] as [number, number, number], size: 0.2, speed: 0.8, rot: 0.7 },
];

/* ── Main scene ── */
function Scene() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.5} color="#e8e0d0" />
      <directionalLight position={[5, 8, 5]} intensity={1.0} color="#FFF5E6" />
      <StadiumLights />
      <ParticleField count={120} />

      {FOOTBALL_CONFIGS.map((cfg, i) => (
        <Football
          key={i}
          position={cfg.pos}
          size={cfg.size}
          speed={cfg.speed}
          rotationSpeed={cfg.rot}
        />
      ))}

      <GlowRing radius={3.5} color={COLORS.gold} />
      <GlowRing radius={5} color={COLORS.softGreen} />

      <fog attach="fog" args={["#0f2d1a", 5, 16]} />
    </>
  );
}

/* ── Exported component ── */
export const ThreeScene: React.FC = () => {
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    setDpr(window.innerWidth < 768 ? Math.min(pixelRatio, 1) : pixelRatio);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.3, 6], fov: 50 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <Scene />
    </Canvas>
  );
};
