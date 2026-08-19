import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  mousePos: { x: number; y: number };
  isActive: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({ mousePos, isActive }) => {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7.2));
  const currentCamPos = useRef(new THREE.Vector3(0, 0, 7.2));

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Mouse Parallax (Cinematic subtle offset)
    const parallaxX = mousePos.x * 0.8;
    const parallaxY = mousePos.y * 0.6;

    // 2. Base camera z position: slightly closer when hyper-activated
    const targetZ = isActive ? 6.4 : 7.2;

    // 3. Subtle camera float breathing
    const floatX = Math.sin(time * 0.5) * 0.08;
    const floatY = Math.cos(time * 0.6) * 0.08;

    targetCamPos.current.set(parallaxX + floatX, parallaxY + floatY, targetZ);

    // Smooth position interpolation
    currentCamPos.current.lerp(targetCamPos.current, delta * 3.5);
    camera.position.copy(currentCamPos.current);

    // Camera always looks smoothly at center product core with slight parallax offset compensation
    camera.lookAt(parallaxX * 0.15, parallaxY * 0.15, 0);
  });

  return null;
};
