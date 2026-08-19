import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProductParticlesProps {
  isActive: boolean;
  burstTrigger: number;
}

export const ProductParticles: React.FC<ProductParticlesProps> = ({ isActive, burstTrigger }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 450;

  // Generate initial particle positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }

    return pos;
  }, []);

  const burstProgress = useRef(0);
  const lastBurstTrigger = useRef(burstTrigger);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const array = positionAttr.array as Float32Array;

    // Trigger burst impulse on state toggle
    if (burstTrigger !== lastBurstTrigger.current) {
      lastBurstTrigger.current = burstTrigger;
      burstProgress.current = 1.0;
    }

    if (burstProgress.current > 0) {
      burstProgress.current = Math.max(0, burstProgress.current - delta * 2.0);
    }

    const activeSpeedMultiplier = isActive ? 1.8 : 1.0;
    const burstForce = burstProgress.current * 1.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Slow orbital rotation around Y axis
      const x = array[i3];
      const z = array[i3 + 2];
      const angle = delta * 0.15 * activeSpeedMultiplier;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      let newX = x * cos - z * sin;
      let newZ = x * sin + z * cos;
      let newY = array[i3 + 1] + Math.sin(time + i) * 0.003 * activeSpeedMultiplier;

      // Apply burst expansion
      if (burstForce > 0.01) {
        const norm = Math.sqrt(newX * newX + newY * newY + newZ * newZ) || 1;
        newX += (newX / norm) * burstForce * 0.08;
        newY += (newY / norm) * burstForce * 0.08;
        newZ += (newZ / norm) * burstForce * 0.08;
      }

      array[i3] = newX;
      array[i3 + 1] = newY;
      array[i3 + 2] = newZ;
    }

    positionAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={isActive ? '#34d399' : '#10b981'}
        transparent
        opacity={isActive ? 0.75 : 0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
