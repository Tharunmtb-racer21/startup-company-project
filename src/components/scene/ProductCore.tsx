import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProductCoreProps {
  isActive: boolean;
  isHovered: boolean;
  isDragging: boolean;
  dragRotation: { x: number; y: number };
  onPointerDown: (e: any) => void;
  onPointerUp: (e: any) => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}

export const ProductCore: React.FC<ProductCoreProps> = ({
  isActive,
  isHovered,
  isDragging,
  dragRotation,
  onPointerDown,
  onPointerUp,
  onPointerOver,
  onPointerOut,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const ribbon1Ref = useRef<THREE.Mesh>(null!);
  const ribbon2Ref = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const outerRing2Ref = useRef<THREE.Group>(null!);

  // Materials refs for smooth color & emissive interpolation
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const ribbon1MatRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const ribbon2MatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const glassShellMatRef = useRef<THREE.MeshPhysicalMaterial>(null!);

  // Target values for state transitions
  const stateColorA = useMemo(() => new THREE.Color('#059669'), []); // Emerald state
  const stateColorB = useMemo(() => new THREE.Color('#00ff9d'), []); // Hyper bio-green state
  const emissiveColorA = useMemo(() => new THREE.Color('#047857'), []);
  const emissiveColorB = useMemo(() => new THREE.Color('#34d399'), []);

  // Internal interaction state lerping variables
  const currentScale = useRef(1);
  const currentRotationY = useRef(0);
  const currentRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const pulsePhase = useRef(0);

  // Generate ribbon curve points (Zen Voice inspired fluid 3D ribbon loop)
  const ribbonCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 120;
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * Math.PI * 2;
      const x = Math.sin(t) * (1.8 + Math.sin(t * 2) * 0.4);
      const y = Math.sin(t * 2) * 0.9;
      const z = Math.cos(t) * (1.8 + Math.cos(t * 2) * 0.4);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  const ribbonGeometry = useMemo(() => {
    return new THREE.TubeGeometry(ribbonCurve, 160, 0.08, 16, true);
  }, [ribbonCurve]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    pulsePhase.current += delta * (isActive ? 3.5 : 1.5);

    // 1. Idle Breathing & Floating Motion
    const breathY = Math.sin(time * 1.4) * 0.12;
    const breathX = Math.cos(time * 1.1) * 0.05;

    // 2. Smooth Damped Idle Rotation + Drag Inertia Damping
    const idleSpeedY = isActive ? 0.35 : 0.2;
    const idleSpeedX = isActive ? 0.15 : 0.08;

    if (!isDragging) {
      targetRotationY.current += delta * idleSpeedY;
      targetRotationX.current = Math.sin(time * 0.8) * idleSpeedX;
    }

    // Blend user drag input smoothly with inertia lerp
    const finalRotX = THREE.MathUtils.lerp(
      currentRotationX.current,
      targetRotationX.current + dragRotation.x,
      0.08
    );
    const finalRotY = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotationY.current + dragRotation.y,
      0.08
    );

    currentRotationX.current = finalRotX;
    currentRotationY.current = finalRotY;

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, breathY, 0.1);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, breathX, 0.1);
      groupRef.current.rotation.x = finalRotX;
      groupRef.current.rotation.y = finalRotY;

      // Hover scale lerp
      const targetScale = isHovered ? 1.08 : 1.0;
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
      groupRef.current.scale.setScalar(currentScale.current);
    }

    // 3. Sub-component rotations for complex futuristic depth
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x = time * 0.5;
      innerCoreRef.current.rotation.z = time * 0.7;
    }

    if (ribbon1Ref.current) {
      ribbon1Ref.current.rotation.y = time * 0.25;
      ribbon1Ref.current.rotation.z = Math.sin(time * 0.5) * 0.2;
    }

    if (ribbon2Ref.current) {
      ribbon2Ref.current.rotation.y = -time * 0.3;
      ribbon2Ref.current.rotation.x = Math.cos(time * 0.4) * 0.3;
    }

    if (outerRing2Ref.current) {
      outerRing2Ref.current.rotation.z = time * 0.15;
      outerRing2Ref.current.rotation.x = time * 0.1;
    }

    // 4. Smooth Material Transition between State A and State B
    const lerpFactor = delta * 4;
    const targetMainColor = isActive ? stateColorB : stateColorA;
    const targetEmissiveColor = isActive ? emissiveColorB : emissiveColorA;

    if (coreMatRef.current) {
      coreMatRef.current.color.lerp(targetMainColor, lerpFactor);
      coreMatRef.current.emissive.lerp(targetEmissiveColor, lerpFactor);
      coreMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMatRef.current.emissiveIntensity,
        isActive ? 2.8 + Math.sin(pulsePhase.current) * 0.6 : 1.2,
        lerpFactor
      );
    }

    if (ribbon1MatRef.current) {
      ribbon1MatRef.current.color.lerp(targetMainColor, lerpFactor);
      ribbon1MatRef.current.emissive.lerp(targetEmissiveColor, lerpFactor);
      ribbon1MatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        ribbon1MatRef.current.emissiveIntensity,
        isActive ? 2.2 : 0.8,
        lerpFactor
      );
    }

    if (glassShellMatRef.current) {
      glassShellMatRef.current.roughness = THREE.MathUtils.lerp(
        glassShellMatRef.current.roughness,
        isActive ? 0.05 : 0.15,
        lerpFactor
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* Central Bio-Energy Core (Octahedron Crystal) */}
      <mesh ref={innerCoreRef} scale={0.7}>
        <octahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#059669"
          emissive="#047857"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Primary Fluid Energy Ribbon (ZenVoice Inspired Loop) */}
      <mesh ref={ribbon1Ref} geometry={ribbonGeometry}>
        <meshPhysicalMaterial
          ref={ribbon1MatRef}
          color="#059669"
          emissive="#047857"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.3}
          ior={1.5}
        />
      </mesh>

      {/* Secondary Counter-Rotating Ribbon */}
      <mesh ref={ribbon2Ref} scale={1.15} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusKnotGeometry args={[1.3, 0.04, 180, 16, 2, 5]} />
        <meshStandardMaterial
          ref={ribbon2MatRef}
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={1.0}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Translucent Bio-Glass Outer Armor Shell */}
      <mesh ref={outerRingRef} scale={2.1}>
        <icosahedronGeometry args={[1, 3]} />
        <meshPhysicalMaterial
          ref={glassShellMatRef}
          color="#064e3b"
          transmission={0.9}
          opacity={0.35}
          transparent
          roughness={0.15}
          ior={1.4}
          thickness={0.5}
          specularIntensity={1.2}
        />
      </mesh>

      {/* Orbiting Satellite Tech Ring */}
      <group ref={outerRing2Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.015, 16, 100]} />
          <meshBasicMaterial color={isActive ? '#00ff9d' : '#10b981'} transparent opacity={0.6} />
        </mesh>

        {/* Floating Nano Core Nodes */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5]}
            scale={0.08}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={isActive ? '#34d399' : '#059669'} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
