import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface PostProcessingEffectsProps {
  isActive: boolean;
}

export const PostProcessingEffects: React.FC<PostProcessingEffectsProps> = ({ isActive }) => {
  return (
    <EffectComposer>
      <Bloom
        intensity={isActive ? 1.4 : 0.7}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.8}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.15}
        darkness={0.85}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.015} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
};
