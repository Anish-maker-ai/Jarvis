import React, { useState, useEffect } from 'react';
import { SystemVitals, LanguageMode } from '../types';
import { sfx } from '../utils/speech';
import { POPULAR_ANDROID_GAMES, executeAndroidLaunch, AndroidAppConfig } from '../utils/androidAutomation';

interface CoreHudViewProps {
  vitals: SystemVitals;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onQuickAction: (actionKey: string) => void;
  onEmergencyStop: () => void;
  lastTranscript?: string;
  streamLogs: Array<{ time: string; text: string }>;
  onNavigateTab: (tab: 'chat-voice' | 'file-code' | 'settings') => void;
  handsFreeMode: boolean;
  onToggleHandsFree: () => void;
  wakeWordAlert?: string | null;
}

export const CoreHudView: React.FC<CoreHudViewProps> = ({
  vitals,
  language,
  onLanguageChange,
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onQuickAction,
  onEmergencyStop,
  lastTranscript,
  streamLogs,
  onNavigateTab,
  handsFreeMode,
  onToggleHandsFree,
  wakeWordAlert,
}) => {
  const [coreOverdrive, setCoreOverdrive] = useState(false);
  const [showGamesDrawer, setShowGamesDrawer] = useState(false);
  const [showProtocolsModal, setShowProtocolsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [activeSpeechSample, setActiveSpeechSample] = useState(
    '“Jarvis, open YouTube and launch all games...”'
  );

  useEffect(() => {
    if (lastTranscript) {
      setActiveSpeechSample(`“${lastTranscript}”`);
    }
  }, [lastTranscript]);

  const toggleCorePulse = () => {
    setCoreOverdrive((prev) => !prev);
    sfx.playActivate();
  };

  const handleLaunchGame = (game: AndroidAppConfig) => {
    sfx.playAcknowledge();
    executeAndroidLaunch(game);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-24 pt-2 gap-4 relative">
      {/* 1. Core Status Ticker & Latency Bar */}
      <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0a0f1b]/90 border border-[#00f0ff]/25 shadow-[0_0_15px_rgba(0,240,255,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-ping"></span>
          <span className="font-mono text-[11px] text-[#00f0ff] tracking-wider uppercase font-bold truncate">
            CORE.01 // QUANTUM KERNEL v4.8
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#849495]">
          <span className="text-[#98cbff]">NEURAL SYNC: OPTIMAL</span>
          <span>|</span>
          <span className="text-[#00f0ff] font-bold">{vitals.fps} FPS</span>
        </div>
      </div>

      {/* 2. Hero: Massive Concentric Cyber Arc Reactor Core */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#090d18] via-[#0d1322] to-[#080c16] border border-[#00f0ff]/30 overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.15)] p-4 flex flex-col items-center justify-center">
        {/* Holographic HUD Corner Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]/80"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff]/80"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]/80"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]/80"></div>

        {/* Ambient Holographic Glow Aura */}
        <div
          className={`absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#00f0ff]/20 blur-3xl pointer-events-none transition-all duration-700 ${
            coreOverdrive || isSpeaking ? 'opacity-100 scale-125' : 'opacity-50'
          }`}
        ></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#0070f3]/25 blur-3xl pointer-events-none"></div>

        {/* Arc Reactor Core Visualizer - Extra Large & Ultra Futuristic */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center my-3 select-none">
          {/* Outer Holographic Radar Sweep & Calibration Crosshairs */}
          <div className="absolute inset-0 rounded-full border border-[#00f0ff]/20 animate-[spin_40s_linear_infinite] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-[#00f0ff] rounded-full shadow-[0_0_12px_#00f0ff]"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-[#00f0ff] rounded-full shadow-[0_0_12px_#00f0ff]"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_12px_#00f0ff]"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_12px_#00f0ff]"></div>
          </div>

          {/* Tier 1: Outer 360-degree calibrated laser tick ring */}
          <svg
            className={`absolute inset-0 w-full h-full transition-transform ${
              coreOverdrive ? 'animate-[spin_6s_linear_infinite]' : 'animate-[spin_24s_linear_infinite]'
            }`}
            viewBox="0 0 300 300"
          >
            {/* Outer perimeter tick marks */}
            <circle
              cx="150"
              cy="150"
              r="142"
              fill="none"
              stroke="#00f0ff"
              strokeOpacity="0.25"
              strokeDasharray="2 6"
              strokeWidth="2"
            />
            {/* Major cardinal arc segments */}
            <circle
              cx="150"
              cy="150"
              r="134"
              fill="none"
              stroke="#00f0ff"
              strokeOpacity="0.8"
              strokeDasharray="30 20 5 20"
              strokeWidth="2.5"
            />
            {/* High-speed counter tick circle */}
            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="#98cbff"
              strokeOpacity="0.5"
              strokeDasharray="8 16"
              strokeWidth="1.5"
            />
          </svg>

          {/* Tier 2: Counter-Rotating Holographic Segments */}
          <svg
            className={`absolute inset-0 w-full h-full ${
              coreOverdrive ? 'animate-[spin_4s_linear_infinite_reverse]' : 'animate-[spin_14s_linear_infinite_reverse]'
            }`}
            viewBox="0 0 300 300"
          >
            <circle
              cx="150"
              cy="150"
              r="108"
              fill="none"
              stroke="#00f0ff"
              strokeOpacity="0.75"
              strokeDasharray="50 12 10 12"
              strokeWidth="3"
            />
            <circle
              cx="150"
              cy="150"
              r="94"
              fill="none"
              stroke="#0070f3"
              strokeOpacity="0.8"
              strokeDasharray="15 30"
              strokeWidth="2.5"
            />
          </svg>

          {/* Tier 3: Inner Orbital Frequency Wave Ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_10s_ease-in-out_infinite]"
            viewBox="0 0 300 300"
          >
            <circle
              cx="150"
              cy="150"
              r="78"
              fill="none"
              stroke="#00f0ff"
              strokeDasharray="40 18"
              strokeWidth="3.5"
            />
            <circle
              cx="150"
              cy="150"
              r="62"
              fill="none"
              stroke="#7df4ff"
              strokeOpacity="0.6"
              strokeDasharray="6 14"
              strokeWidth="2"
            />
          </svg>

          {/* Central Power Core Orb (Bigger, Interactive & Glowing with JARVIS text) */}
          <div
            onClick={toggleCorePulse}
            className={`relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#050811] via-[#0f172a] to-[#14233c] shadow-[0_0_60px_rgba(0,240,255,0.65)] border-2 border-[#00f0ff]/80 flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-all duration-300 ${
              isListening ? 'ring-8 ring-[#00f0ff]/60 animate-pulse' : ''
            }`}
            title="Click to toggle JARVIS Overdrive"
          >
            {/* Inner plasma energy matrix */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#030610] via-[#0c1424] to-[#112038] flex items-center justify-center overflow-hidden border border-[#00f0ff]/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.45)_0%,transparent_75%)] animate-pulse"></div>

              {/* Inner Glowing Nucleus */}
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative ${
                  isSpeaking
                    ? 'bg-[#00f0ff]/50 shadow-[0_0_45px_rgba(0,240,255,0.95)]'
                    : 'bg-[#00f0ff]/25 shadow-[inset_0_0_25px_rgba(0,240,255,0.9)]'
                }`}
              >
                {/* Triangular Arc Core Accent */}
                <div className="absolute inset-0 border border-[#00f0ff]/40 rounded-full animate-ping opacity-25"></div>

                <span
                  className={`font-mono text-[#00f0ff] font-black tracking-widest text-base sm:text-lg drop-shadow-[0_0_18px_rgba(0,240,255,1)] select-none ${
                    isListening || isSpeaking ? 'scale-110 text-white' : ''
                  }`}
                >
                  JARVIS
                </span>
                <span className="font-mono text-[9px] text-[#7df4ff] tracking-tighter opacity-90 mt-0.5">
                  MARK-VII
                </span>
              </div>
            </div>
          </div>

          {/* Peripheral Calibrator Pointers */}
          <div className="absolute top-1 font-mono text-[10px] text-[#00f0ff] tracking-widest uppercase drop-shadow-[0_0_8px_#00f0ff] font-bold">
            ARK REACTOR // FREQ 432.8 THz
          </div>
          <div className="absolute bottom-1 font-mono text-[10px] text-[#98cbff] tracking-widest uppercase font-semibold">
            {isSpeaking ? 'TRANSMITTING VOICE' : isListening ? 'ACTIVE LISTENING...' : 'QUANTUM SYNC ONLINE'}
          </div>
        </div>

        {/* Live Audio Equalizer Waveform Indicator */}
        <div className="w-full flex items-center justify-center gap-1.5 h-8 my-2">
          {[8, 18, 28, 36, 42, 32, 24, 18, 28, 40, 44, 30, 22, 14, 8].map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                i % 3 === 0
                  ? 'bg-[#98cbff]'
                  : i % 4 === 0
                  ? 'bg-[#0070f3]'
                  : 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]'
              }`}
              style={{
                height: isListening || isSpeaking
                  ? `${Math.min(38, Math.max(6, h * (0.8 + Math.random() * 0.9)))}px`
                  : `${h * 0.5}px`,
                transform: isListening ? 'scaleY(1.3)' : 'scaleY(1)',
              }}
            ></span>
          ))}
        </div>

        {/* Active State Monologue Pill */}
        <div className="w-full mt-1 flex flex-col items-center text-center px-3.5 py-2 rounded-xl bg-[#080d19]/80 border border-[#00f0ff]/20 shadow-inner">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span className="font-mono text-[10px] text-[#00dbe9] uppercase tracking-wider font-bold">
              {isListening
                ? 'RECORDING ACTIVE INPUT // SPEECH RECOGNITION'
                : isSpeaking
                ? 'ELEVENLABS SYNTHESIS // czQ9pLzjRaF61EAYjcPC'
                : 'STANDBY AUDIO INPUT // RUNTIME READY'}
            </span>
          </div>
          <p className="text-xs text-[#dfe2f0] italic line-clamp-2 font-sans">
            {activeSpeechSample}
          </p>
        </div>
      </div>

      {/* Holographic Wake Word Alert Banner */}
      {wakeWordAlert && (
        <div className="w-full p-3 rounded-xl bg-gradient-to-r from-[#00f0ff]/20 via-[#00a2fd]/30 to-[#00f0ff]/20 border-2 border-[#00f0ff] shadow-[0_0_30px_#00f0ff] flex items-center justify-between text-xs font-mono font-bold text-white animate-bounce">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl animate-spin">mic</span>
            <span className="tracking-wider">{wakeWordAlert}</span>
          </div>
          <span className="bg-[#00f0ff] text-[#002830] px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase shadow-sm">
            MIC ACTIVE
          </span>
        </div>
      )}

      {/* 3. Voice HUD Command Control Bay */}
      <div className="w-full flex flex-col gap-2.5 p-3.5 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md">
        {/* Push-to-Talk HUD Trigger Button */}
        <button
          onPointerDown={() => {
            onStartListening();
          }}
          onPointerUp={() => {
            onStopListening();
          }}
          onPointerLeave={() => {
            if (isListening) onStopListening();
          }}
          className={`w-full py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 select-none cursor-pointer border ${
            isListening
              ? 'bg-white text-black border-white shadow-[0_0_35px_#00f0ff] scale-[0.98]'
              : 'bg-gradient-to-r from-[#00f0ff] to-[#00a2fd] text-[#00363a] border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_28px_rgba(0,240,255,0.6)]'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl font-bold"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mic
          </span>
          <span className="font-mono tracking-wider uppercase font-black text-sm sm:text-base">
            {isListening ? 'LISTENING... RELEASE TO SEND' : 'HOLD TO TALK // PUSH TO TALK'}
          </span>
          <span className="font-mono text-[10px] bg-[#00363a]/20 px-2 py-0.5 rounded text-[#00363a] uppercase font-bold">
            PTT
          </span>
        </button>

        {/* Hands-Free Wake Word Mode Banner */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#0e1526]/80 border border-[#00f0ff]/15">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                handsFreeMode
                  ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse'
                  : 'bg-[#849495]'
              }`}
            ></span>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[#dfe2f0]">
                WAKE PHRASE: <span className="text-[#00f0ff]">"HEY ANISH"</span> OR "JARVIS"
              </span>
              <span className="text-[10px] text-[#849495] font-sans">
                Works hands-free or when minimized at home desktop
              </span>
            </div>
          </div>
          <button
            onClick={onToggleHandsFree}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
              handsFreeMode
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-[#1e2738] text-[#849495] border border-transparent'
            }`}
          >
            {handsFreeMode ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>

      {/* 4. Telemetry Vitals 4-Card HUD Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
        {/* CPU Load Card */}
        <div className="flex flex-col p-3 rounded-xl bg-[#090d18] border border-[#00f0ff]/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#849495] uppercase font-bold">
              CPU LOAD
            </span>
            <span className="material-symbols-outlined text-[#00f0ff] text-base">
              memory
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-mono text-xl text-[#00f0ff] font-bold">
              {vitals.cpuPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#1e2738] overflow-hidden my-1">
            <div
              className="h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] rounded-full transition-all duration-300"
              style={{ width: `${vitals.cpuPercent}%` }}
            ></div>
          </div>
          <span className="font-mono text-[9px] text-[#849495] truncate mt-0.5">
            {vitals.cpuGhz}GHz // {vitals.gpuTempC}°C TEMP
          </span>
        </div>

        {/* RAM Usage Card */}
        <div className="flex flex-col p-3 rounded-xl bg-[#090d18] border border-[#00f0ff]/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#849495] uppercase font-bold">
              RAM USAGE
            </span>
            <span className="material-symbols-outlined text-[#98cbff] text-base">
              storage
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-mono text-xl text-[#dfe2f0] font-bold">
              {vitals.ramUsedGb}
            </span>
            <span className="font-mono text-[10px] text-[#849495]">
              / {vitals.ramTotalGb}GB
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#1e2738] overflow-hidden my-1">
            <div
              className="h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] rounded-full transition-all duration-300"
              style={{ width: `${(vitals.ramUsedGb / vitals.ramTotalGb) * 100}%` }}
            ></div>
          </div>
          <span className="font-mono text-[9px] text-[#849495] truncate mt-0.5">
            DDR5 @ 6000MT/s
          </span>
        </div>

        {/* Active Protocols Card (Interactive Modal Trigger) */}
        <div
          onClick={() => setShowProtocolsModal(true)}
          className="flex flex-col p-3 rounded-xl bg-[#090d18] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 transition-all cursor-pointer shadow-sm group hover:bg-[#0d1424]"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#849495] uppercase font-bold group-hover:text-[#00f0ff]">
              PROTOCOLS
            </span>
            <span className="material-symbols-outlined text-[#00f0ff] text-base">
              account_tree
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="font-mono text-xl text-[#00dbe9] font-bold">
              0{vitals.activeProtocols}
            </span>
            <span className="font-mono text-[10px] text-[#7df4ff]">ACTIVE</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#98cbff] animate-pulse"></span>
          </div>
          <span className="font-mono text-[9px] text-[#00f0ff] truncate mt-1 flex items-center gap-0.5">
            <span>INSPECT</span>
            <span className="material-symbols-outlined text-[10px]">open_in_new</span>
          </span>
        </div>

        {/* Security Level Card (Interactive Modal Trigger) */}
        <div
          onClick={() => setShowSecurityModal(true)}
          className="flex flex-col p-3 rounded-xl bg-[#090d18] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 transition-all cursor-pointer shadow-sm group hover:bg-[#0d1424]"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#849495] uppercase font-bold group-hover:text-[#00f0ff]">
              SECURITY HUD
            </span>
            <span className="material-symbols-outlined text-[#00e676] text-base">
              verified_user
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-mono text-base text-[#00f0ff] uppercase font-bold">
              {vitals.securityLevel}
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#00e676] bg-[#00e676]/10 px-1.5 py-0.5 rounded tracking-wide uppercase truncate mt-0.5 border border-[#00e676]/30">
            SANDBOX ACTIVE
          </span>
          <span className="font-mono text-[9px] text-[#849495] truncate mt-1">
            ZERO EXPOSURE
          </span>
        </div>
      </div>

      {/* 5. Android Phone Automations Quick Deck & Games Vault */}
      <div className="w-full flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-b from-[#0a0f1d] to-[#070b14] border border-[#00f0ff]/30 shadow-[0_0_25px_rgba(0,240,255,0.08)]">
        <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/15">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">smartphone</span>
            <span className="font-mono text-xs text-[#dbfcff] uppercase tracking-wider font-bold">
              ANDROID PHONE AUTOMATIONS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuickAction('android_batch_all')}
              className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 text-[10px] font-mono font-bold hover:bg-[#00f0ff]/30 transition-all"
              title="Launch YouTube, Chrome, Instagram, and Games Hub simultaneously"
            >
              LAUNCH ALL 4
            </button>
            <button
              onClick={() => setShowGamesDrawer((p) => !p)}
              className="text-[10px] font-mono text-[#00f0ff] uppercase hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showGamesDrawer ? 'Hide Games' : 'All Games (11+)'}</span>
              <span className="material-symbols-outlined text-[14px]">
                {showGamesDrawer ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Core Quick Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onQuickAction('android_youtube')}
            className="p-3 rounded-xl bg-[#ff0033]/15 hover:bg-[#ff0033]/25 border border-[#ff0033]/40 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer shadow-sm"
            title="Launch YouTube App on Android"
          >
            <span className="material-symbols-outlined text-[#ff0033] text-[24px] group-hover:scale-110 transition-transform">
              smart_display
            </span>
            <span className="font-mono text-xs text-white font-bold truncate">YouTube</span>
            <span className="font-mono text-[9px] text-[#ff8099]">NATIVE INTENT</span>
          </button>

          <button
            onClick={() => onQuickAction('android_chrome')}
            className="p-3 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/40 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer shadow-sm"
            title="Launch Google Chrome Browser on Android"
          >
            <span className="material-symbols-outlined text-[#00f0ff] text-[24px] group-hover:scale-110 transition-transform">
              public
            </span>
            <span className="font-mono text-xs text-white font-bold truncate">Chrome</span>
            <span className="font-mono text-[9px] text-[#7df4ff]">CHROMIUM SESSION</span>
          </button>

          <button
            onClick={() => onQuickAction('android_insta')}
            className="p-3 rounded-xl bg-[#e1306c]/15 hover:bg-[#e1306c]/25 border border-[#e1306c]/40 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer shadow-sm"
            title="Launch Instagram App on Android"
          >
            <span className="material-symbols-outlined text-[#e1306c] text-[24px] group-hover:scale-110 transition-transform">
              photo_camera
            </span>
            <span className="font-mono text-xs text-white font-bold truncate">Instagram</span>
            <span className="font-mono text-[9px] text-[#ff94c2]">CAMERA & FEED</span>
          </button>

          <button
            onClick={() => onQuickAction('android_games')}
            className="p-3 rounded-xl bg-[#00e676]/15 hover:bg-[#00e676]/25 border border-[#00e676]/40 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer shadow-sm"
            title="Launch All Games Hub on Android"
          >
            <span className="material-symbols-outlined text-[#00e676] text-[24px] group-hover:scale-110 transition-transform">
              sports_esports
            </span>
            <span className="font-mono text-xs text-white font-bold truncate">All Games</span>
            <span className="font-mono text-[9px] text-[#80ffbe]">GAME SPACE HUB</span>
          </button>
        </div>

        {/* Expandable Games Matrix (11+ Games Vault) */}
        {showGamesDrawer && (
          <div className="flex flex-col gap-2 pt-2 border-t border-[#00f0ff]/15">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#849495]">
              <span className="text-[#00f0ff] font-bold">1-CLICK GAME LAUNCHERS</span>
              <span>11+ TITLES INSTANT EXECUTION</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_ANDROID_GAMES.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleLaunchGame(game)}
                  className="p-2 rounded-lg bg-[#111827] hover:bg-[#1f293d] border border-[#00f0ff]/15 hover:border-[#00f0ff]/50 flex items-center gap-2.5 transition-all active:scale-95 text-left group cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform"
                    style={{ color: game.color }}
                  >
                    {game.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs text-white font-bold truncate">
                      {game.name}
                    </span>
                    <span className="font-mono text-[9px] text-[#849495] truncate">
                      {game.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Quick Tactical Actions */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[10px] text-[#849495] uppercase tracking-wider font-bold">
            TACTICAL QUICK DIRECTIVES
          </span>
          <span className="font-mono text-[10px] text-[#00dbe9]">
            FAST DISPATCH
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Action 1: Workspace Launcher */}
          <button
            onClick={() => onQuickAction('launch_space')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#090d18] hover:bg-[#131b2e] border border-[#00f0ff]/20 transition-all text-left active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">terminal</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs text-[#dfe2f0] font-bold truncate">
                Dev Workspace
              </span>
              <span className="text-[10px] text-[#849495] truncate font-sans">
                Chrome + VS Code
              </span>
            </div>
          </button>

          {/* Action 2: Volume 40% */}
          <button
            onClick={() => onQuickAction('volume_40')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#090d18] hover:bg-[#131b2e] border border-[#00f0ff]/20 transition-all text-left active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00a2fd]/20 flex items-center justify-center text-[#98cbff] flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">volume_up</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs text-[#dfe2f0] font-bold truncate">
                Set Volume 40%
              </span>
              <span className="text-[10px] text-[#849495] truncate font-sans">
                Acoustic Preset
              </span>
            </div>
          </button>

          {/* Action 3: Downloads Cleanup */}
          <button
            onClick={() => onQuickAction('clean_downloads')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#090d18] hover:bg-[#131b2e] border border-[#00f0ff]/20 transition-all text-left active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#e1d2ff]/20 flex items-center justify-center text-[#d0bcff] flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">mop</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs text-[#dfe2f0] font-bold truncate">
                Purge Temp Cache
              </span>
              <span className="text-[10px] text-[#849495] truncate font-sans">
                Clean temp storage
              </span>
            </div>
          </button>

          {/* Action 4: System Health Scan */}
          <button
            onClick={() => onQuickAction('health_scan')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#090d18] hover:bg-[#131b2e] border border-[#00f0ff]/20 transition-all text-left active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">health_and_safety</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs text-[#dfe2f0] font-bold truncate">
                Thermal & Vitals
              </span>
              <span className="text-[10px] text-[#849495] truncate font-sans">
                Complete Health Scan
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 7. Recent Action Stream Monospace Ticker */}
      <div className="w-full rounded-xl bg-[#060a12] border border-[#00f0ff]/20 p-3 shadow-inner flex flex-col gap-1.5 font-mono">
        <div className="flex items-center justify-between text-[#849495]">
          <span className="text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            STREAM LOG // ACTIVE DISPATCH
          </span>
          <span className="text-[10px] text-[#00dbe9] uppercase font-bold">
            LIVE STREAM
          </span>
        </div>
        <div className="flex flex-col gap-1 max-h-24 overflow-y-auto no-scrollbar">
          {streamLogs.slice(0, 3).map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="text-[#00f0ff] uppercase select-none font-bold">
                [{log.time}]
              </span>
              <p className="text-[#dfe2f0] truncate font-sans">
                {log.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Protocols Holographic Modal */}
      {showProtocolsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-[#00f0ff]/40 rounded-2xl max-w-md w-full p-5 shadow-[0_0_40px_rgba(0,240,255,0.25)] flex flex-col gap-4 text-[#dfe2f0]">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff]">account_tree</span>
                <h3 className="font-mono text-sm font-bold text-[#dbfcff]">
                  AGENT ORCHESTRATION PROTOCOLS
                </h3>
              </div>
              <button
                onClick={() => setShowProtocolsModal(false)}
                className="text-[#849495] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#111827] border border-[#00f0ff]/20 flex items-center justify-between">
                <div>
                  <span className="text-[#00f0ff] font-bold">VOX_ASR.01</span>
                  <p className="text-[11px] text-[#849495] font-sans">Dual Hindi/English voice recognition</p>
                </div>
                <span className="text-[#00e676] text-[10px] bg-[#00e676]/10 px-2 py-0.5 rounded">ONLINE</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111827] border border-[#00f0ff]/20 flex items-center justify-between">
                <div>
                  <span className="text-[#00f0ff] font-bold">ELEVENLABS_TTS.02</span>
                  <p className="text-[11px] text-[#849495] font-sans">Voice model: czQ9pLzjRaF61EAYjcPC</p>
                </div>
                <span className="text-[#00e676] text-[10px] bg-[#00e676]/10 px-2 py-0.5 rounded">STREAMING</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111827] border border-[#00f0ff]/20 flex items-center justify-between">
                <div>
                  <span className="text-[#00f0ff] font-bold">ANDROID_INTENTS.03</span>
                  <p className="text-[11px] text-[#849495] font-sans">YouTube, Chrome, Instagram, Games Matrix</p>
                </div>
                <span className="text-[#00e676] text-[10px] bg-[#00e676]/10 px-2 py-0.5 rounded">BOUND</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111827] border border-[#00f0ff]/20 flex items-center justify-between">
                <div>
                  <span className="text-[#00f0ff] font-bold">NEURAL_WAKE.04</span>
                  <p className="text-[11px] text-[#849495] font-sans">Desktop minimized wake beacon</p>
                </div>
                <span className="text-[#00e676] text-[10px] bg-[#00e676]/10 px-2 py-0.5 rounded">ARMED</span>
              </div>
            </div>

            <button
              onClick={() => setShowProtocolsModal(false)}
              className="py-2 rounded-xl bg-[#00f0ff] text-[#002830] font-mono font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              CLOSE PROTOCOL MONITOR
            </button>
          </div>
        </div>
      )}

      {/* Security Shield Holographic Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-[#00f0ff]/40 rounded-2xl max-w-md w-full p-5 shadow-[0_0_40px_rgba(0,240,255,0.25)] flex flex-col gap-4 text-[#dfe2f0]">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00e676]">verified_user</span>
                <h3 className="font-mono text-sm font-bold text-[#dbfcff]">
                  SECURITY SANDBOX & PRIVACY
                </h3>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="text-[#849495] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-sans">
              <div className="p-3 bg-[#050811] rounded-xl border border-[#00e676]/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-[#00e676]">shield</span>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-[#00e676] font-bold">LOCAL ISOLATION ACTIVE</span>
                  <span className="text-[11px] text-[#849495]">Zero external data leaks or unauthorized system calls</span>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5 text-[#b9cacb] text-xs font-mono">
                <li>✓ Destructive commands strictly sandboxed</li>
                <li>✓ Explicit confirmation for elevated shell actions</li>
                <li>✓ Native Android intents dispatched locally</li>
                <li>✓ Web Speech API encrypted over HTTPS</li>
              </ul>
            </div>

            <button
              onClick={() => setShowSecurityModal(false)}
              className="py-2 rounded-xl bg-[#1c2436] hover:bg-[#253046] text-[#b9cacb] font-mono text-xs"
            >
              CLOSE SECURITY HUD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
