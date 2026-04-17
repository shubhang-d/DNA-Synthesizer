/// <reference types="@react-three/fiber" />
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const DNAShape = ({ isGenerating }: { isGenerating: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  const backboneMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#f0f9ff",
    emissive: "#f0f9ff",
    wireframe: false,
    transparent: true,
    opacity: 0.9,
    emissiveIntensity: 0.2
  }), []);

  const rungMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#a855f7",
    emissive: "#a855f7",
    wireframe: true,
    transparent: true,
    opacity: 0.3,
    emissiveIntensity: 0.2
  }), []);

  useFrame((state: any, delta: number) => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      const speed = isGenerating ? 2.5 : 0.5;
      groupRef.current.rotation.y += delta * speed;
    }

    const pulse = Math.sin(state.clock.elapsedTime * Math.PI);
    const glowIntensity = 0.2 + (pulse * 0.05);
    backboneMaterial.emissiveIntensity = glowIntensity;
    rungMaterial.emissiveIntensity = glowIntensity;
  });

  const numBasePairs = 40;
  const radius = 2.5;
  const height = 15;
  const turns = 2.5;

  const basePairs = Array.from({ length: numBasePairs }).map((_, i) => {
    const t = i / (numBasePairs - 1);
    const y = (t - 0.5) * height;
    const angle = t * Math.PI * 2 * turns;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    return (
      <group key={i} position={[0, y, 0]}>
        <mesh position={[x1, 0, z1]} material={backboneMaterial}>
          <sphereGeometry args={[0.16, 16, 16]} />
        </mesh>
        <mesh position={[x2, 0, z2]} material={backboneMaterial}>
          <sphereGeometry args={[0.16, 16, 16]} />
        </mesh>
        <mesh rotation={[0, -angle, 0]} rotation-z={Math.PI / 2} material={rungMaterial}>
          <cylinderGeometry args={[0.05, 0.05, radius * 2, 8]} />
        </mesh>
      </group>
    );
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {basePairs}
    </group>
  );
};

const ParticleField = () => {
  const count = 300;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state: any) => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      particle.mx += (mouse.x * 40 - particle.mx) * 0.03;
      particle.my += (mouse.y * 40 - particle.my) * 0.03;

      dummy.position.set(
        (particle.mx / 10) + a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) + b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) + b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
    </instancedMesh>
  );
};

const CursorLight = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      lightRef.current.position.set(x, y, 5);
    }
  });

  return <pointLight ref={lightRef} intensity={2} color="#ffffff" distance={20} />;
};

export default function SynthesizerDNAViewer({ isGenerating = false }: { isGenerating?: boolean }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: true
        }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <CursorLight />
        <DNAShape isGenerating={isGenerating} />
        <ParticleField />
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
