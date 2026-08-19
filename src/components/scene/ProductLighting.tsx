import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProductLightingProps {
  isActive: boolean;
}

export const ProductLighting: React.FC<ProductLightingProps> = ({ isActive }) => {
  const rimLightRef = useRef<THREE.PointLight>(null!);
  const coreLightRef = useRef<THREE.PointLight>(null!);
  const topLightRef = useRef<THREE.SpotLight>(null!);

  useFrame((_, delta) => {
    const lerpFactor = delta * 4;

    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        isActive ? 12 : 4,
        lerpFactor
      );
      rimLightRef.current.color.lerp(
        isActive ? new THREE.Color('#00ff9d') : new THREE.Color('#10b981'),
        lerpFactor
      );
    }

    if (coreLightRef.current) {
      coreLightRef.current.intensity = THREE.MathUtils.lerp(
        coreLightRef.current.intensity,
        isActive ? 18 : 6,
        lerpFactor
      );
      coreLightRef.current.color.lerp(
        isActive ? new THREE.Color('#34d399') : new THREE.Color('#059669'),
        lerpFactor
      );
    }

    if (topLightRef.current) {
      topLightRef.current.intensity = THREE.MathUtils.lerp(
        topLightRef.current.intensity,
        isActive ? 8 : 4,
        lerpFactor
      );
    }
  });

  return (
    <>
      {/* Ambient background illuminate */}
      <ambientLight intensity={0.4} color="#041210" />

      {/* Main Studio Key Light */}
      <spotLight
        ref={topLightRef}
        position={[6, 10, 8]}
        angle={0.4}
        penumbra={0.9}
        intensity={4}
        color="#e2e8f0"
        castShadow={false}
      />

      {/* Cool Dark Fill Light */}
      <directionalLight position={[-8, -6, -5]} intensity={1.2} color="#0f172a" />

      {/* Sustainable Emerald/Bio-Green Rim Light */}
      <pointLight
        ref={rimLightRef}
        position={[-4, 3, -4]}
        intensity={4}
        distance={15}
        color="#10b981"
      />

      {/* Internal High-Intensity Energy Core PointLight */}
      <pointLight
        ref={coreLightRef}
        position={[0, 0, 0]}
        intensity={6}
        distance={8}
        color="#059669"
      />
    </>
  );
};
