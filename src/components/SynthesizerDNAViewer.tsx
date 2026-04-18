'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree, RootState } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Module-level init keeps Math.random() out of the render phase
type Particle = {
  t: number; factor: number; speed: number;
  xFactor: number; yFactor: number; zFactor: number;
  mx: number; my: number;
};

const PARTICLE_COUNT = 300;

const INITIAL_PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
  t: Math.random() * 100,
  factor: 20 + Math.random() * 100,
  speed: 0.01 + Math.random() / 200,
  xFactor: -20 + Math.random() * 40,
  yFactor: -20 + Math.random() * 40,
  zFactor: -20 + Math.random() * 40,
  mx: 0,
  my: 0,
}));

// Module-level singletons — safe to read in render AND mutate in useFrame
const backboneMaterial = new THREE.MeshStandardMaterial({
  color: '#f0f9ff', emissive: '#f0f9ff',
  transparent: true, opacity: 0.9, emissiveIntensity: 0.2,
});
const rungMaterial = new THREE.MeshStandardMaterial({
  color: '#a855f7', emissive: '#a855f7',
  wireframe: true, transparent: true, opacity: 0.3, emissiveIntensity: 0.2,
});

const DNAShape = ({ isGenerating }: { isGenerating: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: RootState, delta: number) => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      groupRef.current.rotation.y += delta * (isGenerating ? 2.5 : 0.5);
    }
    const glowIntensity = 0.2 + Math.sin(state.clock.elapsedTime * Math.PI) * 0.05;
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

  return <group ref={groupRef} scale={[0, 0, 0]}>{basePairs}</group>;
};

const ParticleField = () => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse } = useThree();
  const dummy = useRef(new THREE.Object3D());
  // Deep-copy module-level data so remounts get fresh state
  const particles = useRef<Particle[]>(INITIAL_PARTICLES.map(p => ({ ...p })));

  useFrame(() => {
    if (!mesh.current) return;
    particles.current.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      particle.t += speed / 2;
      const { t } = particle;
      const a = Math.cos(t) + Math.sin(t) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      particle.mx += (mouse.x * 40 - particle.mx) * 0.03;
      particle.my += (mouse.y * 40 - particle.my) * 0.03;

      dummy.current.position.set(
        particle.mx / 10 + a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t) * factor) / 10,
        particle.my / 10 + b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        particle.my / 10 + b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10,
      );
      dummy.current.scale.set(s, s, s);
      dummy.current.rotation.set(s * 5, s * 5, s * 5);
      dummy.current.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.current.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, PARTICLE_COUNT] as [THREE.BufferGeometry | undefined, THREE.Material | undefined, number]}
    >
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
      lightRef.current.position.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        5,
      );
    }
  });

  return <pointLight ref={lightRef} intensity={2} color="#ffffff" distance={20} />;
};

export default function SynthesizerDNAViewer({ isGenerating = false }: { isGenerating?: boolean }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none' }}>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}>
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
