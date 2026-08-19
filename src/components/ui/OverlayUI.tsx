import React from 'react';
import { Sparkles, Move, Zap, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OverlayUIProps {
  isActive: boolean;
  onToggleState: () => void;
  onReset: () => void;
}

export const OverlayUI: React.FC<OverlayUIProps> = ({ isActive, onToggleState, onReset }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 z-10 select-none">
      {/* Top minimal status bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
          <span className="text-xs uppercase tracking-[0.25em] text-emerald-400/80 font-mono font-medium">
            ECO-CORE 3D PROTOTYPE // v2.4
          </span>
        </div>

        <button
          onClick={onReset}
          className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel text-xs text-slate-300 hover:text-white transition-all duration-300 hover:border-emerald-500/40"
          title="Reset Camera & State"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline tracking-wider font-mono">RESET</span>
        </button>
      </div>

      {/* Center Interactive Callout (Fades out when interacting) */}
      <div className="self-center text-center max-w-sm pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={isActive ? 'active' : 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="px-4 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-md">
              <span className="text-[11px] font-mono tracking-widest text-emerald-300 uppercase">
                {isActive ? 'STATUS: HYPER BIO-ENERGY ACTIVATED' : 'STATUS: AMBIENT SUSTAINABLE MODE'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Interaction Dock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        {/* Interaction hints */}
        <div className="flex items-center space-x-4 text-xs font-mono text-slate-400 glass-panel px-4 py-2.5 rounded-full">
          <div className="flex items-center space-x-2">
            <Move className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>DRAG / TOUCH TO ROTATE</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>CLICK TO TRANSFORM</span>
          </div>
        </div>

        {/* State Toggle Button */}
        <button
          onClick={onToggleState}
          className={`pointer-events-auto flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-500 font-mono text-xs tracking-wider shadow-lg ${
            isActive
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:bg-emerald-400'
              : 'glass-panel text-emerald-300 hover:border-emerald-400/50 hover:text-white'
          }`}
        >
          <Zap className={`w-4 h-4 ${isActive ? 'fill-slate-950 text-slate-950' : 'text-emerald-400'}`} />
          <span>{isActive ? 'STATE B: ACTIVE ENERGY' : 'STATE A: AMBIENT MODE'}</span>
        </button>
      </div>
    </div>
  );
};
