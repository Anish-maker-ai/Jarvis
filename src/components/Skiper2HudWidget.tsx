import React from 'react';
import { sfx } from '../utils/speech';

interface Skiper2HudWidgetProps {
  onTriggerQuickScan: () => void;
}

export const Skiper2HudWidget: React.FC<Skiper2HudWidgetProps> = ({ onTriggerQuickScan }) => {
  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto hidden md:block">
      <div className="relative bg-[#060a12]/95 backdrop-blur-2xl border-x border-b border-[#00f0ff]/40 rounded-b-2xl px-5 py-1.5 shadow-[0_8px_30px_rgba(0,240,255,0.2)] flex items-center gap-3.5 text-xs font-mono text-[#00f0ff]">
        {/* Top laser line */}
        <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent"></div>
        
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-ping"></span>
          <span className="font-black tracking-widest text-[11px] text-[#dbfcff]">SKIPER-2 QUANTUM HUD</span>
        </div>

        <span className="text-[#849495] opacity-50">/</span>

        <span className="text-[#98cbff] text-[10px] tracking-wider">NEURAL COGNITION: ONLINE</span>

        <button
          onClick={() => {
            sfx.playActivate();
            onTriggerQuickScan();
          }}
          className="px-2.5 py-0.5 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 font-bold transition-all text-[10px] uppercase flex items-center gap-1 cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.2)]"
        >
          <span className="material-symbols-outlined text-[13px]">radar</span>
          <span>QUICK SCAN</span>
        </button>
      </div>
    </div>
  );
};
