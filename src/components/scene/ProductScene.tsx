import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { ProductCore } from './ProductCore';
import { ProductParticles } from './ProductParticles';
import { ProductLighting } from './ProductLighting';
import { CameraRig } from './CameraRig';
import { PostProcessingEffects } from './PostProcessingEffects';

interface ProductSceneProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  onStateChange?: (state: boolean) => void;
}

export const ProductScene: React.FC<ProductSceneProps> = ({ isActive, setIsActive, onStateChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [burstTrigger, setBurstTrigger] = useState(0);

  const pointerStartRef = useRef({ x: 0, y: 0 });
  const rotationStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  // Mouse movement parallax handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = -(e.clientY / innerHeight) * 2 + 1;
    setMousePos({ x: nx, y: ny });

    if (isDragging) {
      const deltaX = (e.clientX - pointerStartRef.current.x) * 0.008;
      const deltaY = (e.clientY - pointerStartRef.current.y) * 0.008;

      if (Math.abs(deltaX) > 0.02 || Math.abs(deltaY) > 0.02) {
        hasDraggedRef.current = true;
      }

      setDragRotation({
        x: rotationStartRef.current.x + deltaY,
        y: rotationStartRef.current.y + deltaX,
      });
    }
  }, [isDragging]);

  // Touch drag support for mobile
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const { innerWidth, innerHeight } = window;
      const nx = (touch.clientX / innerWidth) * 2 - 1;
      const ny = -(touch.clientY / innerHeight) * 2 + 1;
      setMousePos({ x: nx, y: ny });

      const deltaX = (touch.clientX - pointerStartRef.current.x) * 0.01;
      const deltaY = (touch.clientY - pointerStartRef.current.y) * 0.01;

      if (Math.abs(deltaX) > 0.02 || Math.abs(deltaY) > 0.02) {
        hasDraggedRef.current = true;
      }

      setDragRotation({
        x: rotationStartRef.current.x + deltaY,
        y: rotationStartRef.current.y + deltaX,
      });
    }
  }, [isDragging]);

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    hasDraggedRef.current = false;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    pointerStartRef.current = { x: clientX, y: clientY };
    rotationStartRef.current = { ...dragRotation };
  }, [dragRotation]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!hasDraggedRef.current) {
      setIsActive((prev) => {
        const next = !prev;
        if (onStateChange) onStateChange(next);
        return next;
      });
      setBurstTrigger((prev) => prev + 1);
    }
  }, [setIsActive, onStateChange]);

  return (
    <div
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onPointerUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full bg-[#030708]"
      >
        <ProductLighting isActive={isActive} />

        <CameraRig mousePos={mousePos} isActive={isActive} />

        <ProductCore
          isActive={isActive}
          isHovered={isHovered}
          isDragging={isDragging}
          dragRotation={dragRotation}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
          onClick={handleClick}
        />

        <ProductParticles isActive={isActive} burstTrigger={burstTrigger} />

        <PostProcessingEffects isActive={isActive} />
      </Canvas>
    </div>
  );
};
