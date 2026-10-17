import React, { useState, useEffect } from 'react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  latencyMs: number;
  isOnline: boolean;
  onKillswitch: () => void;
  killswitchArmed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  latencyMs,
  isOnline,
  onKillswitch,
  killswitchArmed,
}) => {
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sysTime, setSysTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setSysTime(now.toTimeString().split(' ')[0]);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const getScreenTitle = () => {
    switch (currentTab) {
      case 'core-hud':
        return 'CORE QUANTUM HUD';
      case 'chat-voice':
        return 'VOICE & INTELLIGENCE';
      case 'file-code':
        return 'SYSTEM TERMINAL & CODE';
      case 'settings':
        return 'NEURAL CONFIG & PARAMS';
      default:
        return 'JARVIS MK-VII';
    }
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#060a12]/90 backdrop-blur-2xl border-b border-[#00f0ff]/20 shadow-[0_4px_30px_rgba(0,240,255,0.08)]">
      {/* Top holographic laser highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-70"></div>
      
      <div className="h-16 px-3 md:px-6 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Holographic Reactor Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-[#060a12] via-[#0f172a] to-[#002f34] border border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.5)] flex-shrink-0 group cursor-pointer">
            {/* Spinning orbital ticks */}
            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#00f0ff]/60 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border border-dotted border-[#00a2fd]/80 animate-[spin_6s_linear_infinite_reverse]"></div>
            
            {/* Glowing Core center */}
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#0070f3] flex items-center justify-center shadow-[0_0_12px_#00f0ff]">
              <span className="font-mono text-[#060a12] text-[9px] font-black tracking-tighter">AI</span>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse' : 'bg-red-400'}`}></span>
              <span className="font-mono text-xs md:text-sm font-black text-[#dbfcff] tracking-widest uppercase truncate drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                ANISH AI <span className="text-[#00f0ff] font-light text-[10px] md:text-xs">// {getScreenTitle()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#849495]">
              <span className="text-[#00e5ff] font-semibold">JARVIS ONLINE</span>
              <span>•</span>
              <span>PING: <span className="text-white font-bold">{latencyMs}ms</span></span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-[#98cbff]">{sysTime} UTC</span>
            </div>
          </div>
        </div>

        {/* Center / Right: HUD Telemetry & Tactical Controls */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Tactical Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0e1726]/80 border border-[#00f0ff]/20 text-[10px] font-mono">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
              <span className="text-[#98cbff]">PROTOCOL:</span>
            </div>
            <span className="text-[#00f0ff] font-bold tracking-wider">MARK-VII MK</span>
          </div>

          {/* Android Mobile Access Hub Button */}
          <button
            onClick={() => setShowAndroidModal(true)}
            title="Launch Android Automation Deck"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all active:scale-95 text-xs font-mono font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            <span className="hidden sm:inline">ANDROID APPS</span>
          </button>

          {/* Quick Emergency Abort / Stop Button */}
          <button
            onClick={onKillswitch}
            title="Emergency Global Stop"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 border ${
              killswitchArmed
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_20px_rgba(255,50,50,0.8)] animate-pulse'
                : 'bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-900/60 hover:border-red-400'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">power_settings_new</span>
            <span className="hidden xs:inline">ABORT</span>
          </button>

          {/* User Halo Badge */}
          <div className="relative flex items-center justify-center p-0.5 rounded-full ring-1 ring-[#00f0ff]/50 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00363a] via-[#005570] to-[#00f0ff] flex items-center justify-center font-mono font-bold text-xs text-[#060a12] shadow-inner">
              JARVIS
            </div>
          </div>
        </div>
      </div>

      {/* Android Phone Automation Setup Modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-[#00f0ff]/40 rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col gap-4 text-[#dfe2f0] relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f0ff]/10 blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3 border-b border-[#00f0ff]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-2xl">smartphone</span>
                <h3 className="font-mono text-base font-bold text-[#dbfcff] tracking-wide">
                  ANDROID AUTOMATION MATRIX
                </h3>
              </div>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="text-[#849495] hover:text-[#00f0ff] transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-3 bg-[#050811] rounded-xl border border-[#00f0ff]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00f0ff]/15 flex items-center justify-center text-[#00f0ff] flex-shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs text-[#00f0ff] uppercase font-bold">1-Click Native Android Execution</span>
                <span className="text-[11px] text-[#b9cacb]">Direct Deep-linking & Intent triggers for YouTube, Chrome, Instagram, & Games</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-[#dfe2f0] font-sans leading-relaxed">
              <div className="flex items-start gap-2.5 bg-[#121927] p-2.5 rounded-lg border border-[#00f0ff]/15">
                <span className="font-mono text-[#00f0ff] font-bold text-sm">01</span>
                <div>
                  <p className="font-semibold text-white">Open directly on Android phone:</p>
                  <p className="text-[11px] text-[#849495]">Add to Home Screen as PWA or open in Chrome to grant intent permissions.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-[#121927] p-2.5 rounded-lg border border-[#00f0ff]/15">
                <span className="font-mono text-[#00f0ff] font-bold text-sm">02</span>
                <div>
                  <p className="font-semibold text-white">Voice & Quick Action Automation:</p>
                  <p className="text-[11px] text-[#849495]">Say <span className="text-[#00f0ff] font-mono">"Open YouTube"</span>, <span className="text-[#00f0ff] font-mono">"Open Chrome"</span>, <span className="text-[#00f0ff] font-mono">"Open Instagram"</span>, or <span className="text-[#00f0ff] font-mono">"Open All Games"</span>.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={copyAppUrl}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_16px_rgba(0,240,255,0.4)]"
              >
                <span className="material-symbols-outlined text-sm">{copiedLink ? 'check' : 'content_copy'}</span>
                <span>{copiedLink ? 'LINK COPIED TO CLIPBOARD!' : 'COPY MOBILE APP URL'}</span>
              </button>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="py-2.5 px-4 rounded-xl bg-[#1c2436] hover:bg-[#253046] text-[#b9cacb] font-mono text-xs transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
