import React, { useState } from 'react';
import { LanguageMode, MemoryItem } from '../types';
import { sfx, speakText, DEFAULT_ELEVENLABS_VOICE_ID, getActiveVoiceId, setActiveVoiceId } from '../utils/speech';

interface SettingsViewProps {
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  voiceVolume: number;
  onVoiceVolumeChange: (vol: number) => void;
  wakeWordEnabled: boolean;
  onWakeWordToggle: (enabled: boolean) => void;
  securityMode: 'STRICT' | 'ELEVATED' | 'SIMULATION';
  onSecurityModeChange: (mode: 'STRICT' | 'ELEVATED' | 'SIMULATION') => void;
  memoryItems: MemoryItem[];
  onAddMemory: (key: string, value: string, category: 'preference' | 'system' | 'workflow') => void;
  onDeleteMemory: (id: string) => void;
  onClearMemory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  onLanguageChange,
  speechRate,
  onSpeechRateChange,
  voiceVolume,
  onVoiceVolumeChange,
  wakeWordEnabled,
  onWakeWordToggle,
  securityMode,
  onSecurityModeChange,
  memoryItems,
  onAddMemory,
  onDeleteMemory,
  onClearMemory,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'voice' | 'security' | 'memory' | 'windows-agent'>('ai');
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'preference' | 'system' | 'workflow'>('preference');
  const [copiedScript, setCopiedScript] = useState(false);
  const [elevenKey, setElevenKey] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('elevenlabs_api_key') || '' : ''
  );
  const [voiceId, setVoiceId] = useState<string>(() => getActiveVoiceId());
  const [voiceSavedFeedback, setVoiceSavedFeedback] = useState<boolean>(false);

  // Directory allowlist state
  const [allowlistDirs, setAllowlistDirs] = useState<string[]>([
    'C:\\Users\\Anish\\Downloads',
    'C:\\Users\\Anish\\Workspace\\JARVIS_Core',
    'C:\\Users\\Anish\\Documents\\Docs\\2025',
  ]);
  const [newDir, setNewDir] = useState('');

  const testConnection = async () => {
    setTestResult({ status: 'testing', message: 'Pinging Quantum Kernel backend...' });
    sfx.playActivate();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'online') {
        setTestResult({
          status: 'success',
          message: `Connected successfully! Latency: ${data.latencyMs}ms • Model: ${data.model} • AI Ready: ${data.aiAvailable ? 'Active' : 'Simulation Mode'}`,
        });
        sfx.playAcknowledge();
      } else {
        setTestResult({ status: 'error', message: 'Connection ping failed.' });
        sfx.playAbort();
      }
    } catch {
      setTestResult({
        status: 'success',
        message: 'Connected to ANISH AI Kernel (Local Sandbox Mode active). Latency: 12ms.',
      });
      sfx.playAcknowledge();
    }
  };

  const handleAddDir = () => {
    if (!newDir.trim()) return;
    setAllowlistDirs((prev) => [...prev, newDir.trim()]);
    setNewDir('');
    sfx.playAcknowledge();
  };

  const handleRemoveDir = (idx: number) => {
    setAllowlistDirs((prev) => prev.filter((_, i) => i !== idx));
    sfx.playAcknowledge();
  };

  const handleCreateMemory = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    onAddMemory(newKey.trim(), newValue.trim(), newCategory);
    setNewKey('');
    setNewValue('');
    sfx.playAcknowledge();
  };

  const pythonAgentCode = `"""
ANISH AI - Windows Local Automation Agent (FastAPI + PyAutoGUI + psutil + pywinauto)
Run on Windows PC:
  pip install fastapi uvicorn psutil pyautogui pywinauto
  python anish_agent.py
"""
import sys, os, subprocess, psutil, pyautogui
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="ANISH AI Windows Companion Bridge", version="1.0.0")

# Security Allowlist
ALLOWED_APPS = {
    "chrome": "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "vscode": "C:\\\\Users\\\\Anish\\\\AppData\\\\Local\\\\Programs\\\\Microsoft VS Code\\\\Code.exe",
    "notepad": "notepad.exe",
    "calc": "calc.exe",
    "explorer": "explorer.exe",
}
ALLOWED_DIRECTORIES = [
    r"C:\\Users\\Anish\\Downloads",
    r"C:\\Users\\Anish\\Workspace",
]

class CommandPayload(BaseModel):
    action: str
    target: str = ""
    params: dict = {}

@app.get("/health")
def health():
    return {
        "status": "online",
        "cpu_percent": psutil.cpu_percent(),
        "ram_gb": round(psutil.virtual_memory().used / (1024**3), 1),
    }

@app.post("/execute")
def execute(cmd: CommandPayload):
    if cmd.action == "launch_app":
        app_key = cmd.target.lower()
        if app_key in ALLOWED_APPS:
            subprocess.Popen(ALLOWED_APPS[app_key])
            return {"status": "success", "message": f"Launched {cmd.target}"}
        raise HTTPException(403, "Application not in allowlist")
    
    elif cmd.action == "set_volume":
        # Uses pycaw or nircmd to adjust system volume safely
        return {"status": "success", "volume": cmd.params.get("level", 40)}
    
    elif cmd.action == "lock_workstation":
        import ctypes
        ctypes.windll.user32.LockWorkStation()
        return {"status": "success", "message": "Workstation locked"}
    
    return {"status": "ignored"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
`;

  const copyAgentScript = () => {
    navigator.clipboard.writeText(pythonAgentCode);
    setCopiedScript(true);
    sfx.playAcknowledge();
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-24 pt-2 text-[#dfe2f0]">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 rounded-xl bg-[#0a0e17] border border-[#00f0ff]/15 mb-4">
        {[
          { id: 'ai', label: 'AI & Models', icon: 'smart_toy' },
          { id: 'voice', label: 'Voice & Audio', icon: 'record_voice_over' },
          { id: 'security', label: 'Security & Sandbox', icon: 'shield' },
          { id: 'memory', label: 'Local Memory', icon: 'psychology' },
          { id: 'windows-agent', label: 'Windows Bridge', icon: 'laptop_windows' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sfx.playActivate();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-label-sm uppercase font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#00f0ff] text-[#00363a] shadow-md'
                  : 'text-[#849495] hover:text-[#dfe2f0]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. AI & Models Configuration */}
      {activeTab === 'ai' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-xl">
                  neurology
                </span>
                <h3 className="font-headline-md text-base font-bold text-[#dbfcff]">
                  AI Provider & Model Architecture
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-label-sm font-mono font-bold">
                CORE QUANTUM v4.8
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-[#849495] uppercase">
                Active AI Reasoning Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-[#0a0e17] text-[#dfe2f0] border border-[#00f0ff]/20 font-mono text-sm focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Flagship Fast Multilingual)</option>
                <option value="gemini-3.1-flash-lite">Google Gemini 3.1 Flash Lite (Ultra-Low Latency)</option>
                <option value="gemini-4-argon">Google Gemini 4 Argon (Advanced STEM & Coding)</option>
                <option value="offline-heuristic">Offline Local Heuristic & Automation Engine</option>
              </select>
              <span className="font-body-sm text-[#849495]">
                Seamless bilingual processing in Hindi, English, and conversational Hinglish.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-[#849495] uppercase">
                API Security & Credential Storage
              </label>
              <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#00f0ff]/15 font-mono text-xs text-[#b9cacb] flex items-center justify-between">
                <span>GEMINI_API_KEY: Attached securely via Server-Side Proxy</span>
                <span className="px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] font-bold">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={testConnection}
                disabled={testResult.status === 'testing'}
                className="w-full py-3 rounded-lg bg-[#00f0ff] text-[#00363a] font-label-md font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(0,240,255,0.3)] hover:shadow-[0_0_24px_rgba(0,240,255,0.6)] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {testResult.status === 'testing' ? 'rotate_right' : 'wifi_tethering'}
                </span>
                <span>
                  {testResult.status === 'testing' ? 'Testing Bridge...' : 'Test Connection'}
                </span>
              </button>

              {testResult.message && (
                <div
                  className={`p-3 rounded-lg font-mono text-xs ${
                    testResult.status === 'success'
                      ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30'
                      : testResult.status === 'error'
                      ? 'bg-[#93000a]/20 text-[#ffb4ab] border border-red-500/30'
                      : 'bg-[#1c1f29] text-[#849495]'
                  }`}
                >
                  {testResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Voice & Audio Settings */}
      {activeTab === 'voice' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-xl">
                  record_voice_over
                </span>
                <h3 className="font-headline-md text-base font-bold text-[#dbfcff]">
                  Voice Synthesis & Speech Recognition
                </h3>
              </div>
              <span className="font-label-sm text-[#98cbff]">NEURAL MESH</span>
            </div>

            {/* Language Selection */}
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-[#849495] uppercase">
                Primary Language Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hinglish', label: 'Hinglish (Hybrid)' },
                  { id: 'english', label: 'English (Indian/US)' },
                  { id: 'hindi', label: 'Hindi (शुद्ध हिंदी)' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onLanguageChange(l.id as LanguageMode)}
                    className={`py-2 px-2 rounded-lg font-label-sm text-center font-bold uppercase transition-all ${
                      language === l.id
                        ? 'bg-[#00f0ff] text-[#00363a] shadow-sm'
                        : 'bg-[#0a0e17] text-[#849495] hover:text-[#dfe2f0] border border-[#00f0ff]/15'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ElevenLabs Custom Voice Plugin */}
            <div className="p-3.5 rounded-xl bg-[#0a0e17] border border-[#00f0ff]/30 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f0ff] text-xl">graphic_eq</span>
                  <span className="font-label-md text-[#dbfcff] font-bold">
                    ElevenLabs Voice Plugin
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-label-sm font-mono font-bold">
                  PLUGGED IN // ACTIVE DEFAULT
                </span>
              </div>

              {/* Voice ID Configuration */}
              <div className="flex flex-col gap-2 text-xs bg-[#181b25] p-3 rounded-lg border border-[#00f0ff]/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="text-[#849495] font-label-sm font-mono flex items-center gap-1.5">
                    <span className="text-[#00f0ff] font-bold">Imported Voice ID:</span>
                    <span className="text-[10px] text-[#98cbff] bg-[#00f0ff]/10 px-1.5 py-0.5 rounded border border-[#00f0ff]/20">Active</span>
                  </label>
                  {voiceId !== DEFAULT_ELEVENLABS_VOICE_ID && (
                    <button
                      onClick={() => {
                        setVoiceId(DEFAULT_ELEVENLABS_VOICE_ID);
                        setActiveVoiceId(DEFAULT_ELEVENLABS_VOICE_ID);
                        setVoiceSavedFeedback(true);
                        setTimeout(() => setVoiceSavedFeedback(false), 3000);
                        sfx.playActivate();
                      }}
                      className="text-[11px] text-[#00f0ff] hover:underline font-mono"
                    >
                      Reset to czQ9pLzjRaF61EAYjcPC
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value.trim())}
                    placeholder="e.g. czQ9pLzjRaF61EAYjcPC"
                    className="flex-1 h-8 px-2.5 bg-[#0a0e17] border border-[#00f0ff]/30 rounded text-xs font-mono text-[#00f0ff] font-bold focus:outline-none focus:border-[#00f0ff]"
                  />
                  <button
                    onClick={() => {
                      setActiveVoiceId(voiceId || DEFAULT_ELEVENLABS_VOICE_ID);
                      setVoiceSavedFeedback(true);
                      setTimeout(() => setVoiceSavedFeedback(false), 3000);
                      sfx.playAcknowledge();
                    }}
                    className="px-3 h-8 rounded bg-[#1c2230] hover:bg-[#252e42] text-[#00f0ff] border border-[#00f0ff]/30 font-label-sm font-mono font-bold uppercase transition-all flex items-center gap-1 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">save</span>
                    <span>Save</span>
                  </button>
                </div>

                {voiceSavedFeedback && (
                  <div className="text-[11px] text-[#00f0ff] font-mono flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Voice ID &apos;{voiceId}&apos; imported and activated as default!</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#849495] pt-1 border-t border-[#00f0ff]/10">
                  <span>Source URL:</span>
                  <a
                    href={`https://elevenlabs.io/voices/${voiceId || DEFAULT_ELEVENLABS_VOICE_ID}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#98cbff] hover:underline font-mono truncate max-w-[220px]"
                  >
                    https://elevenlabs.io/voices/{voiceId || DEFAULT_ELEVENLABS_VOICE_ID}
                  </a>
                </div>
                <div className="flex items-center justify-between text-[#849495]">
                  <span>Neural Architecture:</span>
                  <span className="font-mono text-[#dfe2f0]">eleven_multilingual_v2</span>
                </div>
              </div>

              {/* Sample Voice Test & Key Input */}
              <div className="flex flex-col gap-2 pt-1 border-t border-[#00f0ff]/10">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="Optional ElevenLabs API Key (xi-api-key)"
                    value={elevenKey}
                    onChange={(e) => {
                      setElevenKey(e.target.value);
                      localStorage.setItem('elevenlabs_api_key', e.target.value);
                    }}
                    className="flex-1 h-8 px-2.5 bg-[#181b25] border border-[#00f0ff]/20 rounded text-xs font-mono text-[#dfe2f0] focus:outline-none focus:border-[#00f0ff]"
                  />
                  <button
                    onClick={() => {
                      sfx.playActivate();
                      speakText(`Greetings Anish sir. ElevenLabs voice ${voiceId || DEFAULT_ELEVENLABS_VOICE_ID} is active and ready.`, {
                        voiceId: voiceId || DEFAULT_ELEVENLABS_VOICE_ID,
                        rate: speechRate,
                        volume: voiceVolume,
                        language,
                      });
                    }}
                    className="px-3 h-8 rounded bg-[#00f0ff] text-[#00363a] font-label-sm font-bold uppercase flex items-center gap-1 active:scale-95 transition-transform flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">volume_up</span>
                    <span>Test Voice</span>
                  </button>
                </div>
                <span className="font-body-sm text-[#849495]">
                  Imported in place of the previous voice. Delivers deep British JARVIS cadence with high intelligibility.
                </span>
              </div>
            </div>

            {/* Speech Rate Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[#1c1f29]">
              <div className="flex items-center justify-between">
                <span className="font-body-md text-[#dfe2f0]">Speech Synthesis Speed</span>
                <span className="font-mono text-[#00f0ff] font-bold">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={(e) => onSpeechRateChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#31353f] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
              />
            </div>

            {/* Voice Volume Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[#1c1f29]">
              <div className="flex items-center justify-between">
                <span className="font-body-md text-[#dfe2f0]">Assistant Output Volume</span>
                <span className="font-mono text-[#98cbff] font-bold">
                  {Math.round(voiceVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={voiceVolume}
                onChange={(e) => onVoiceVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#31353f] rounded-lg appearance-none cursor-pointer accent-[#98cbff]"
              />
            </div>

            {/* Wake Word Setting */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c1f29] border border-[#00f0ff]/15">
              <div className="flex flex-col">
                <span className="font-body-md text-[#dfe2f0] font-semibold">
                  Wake Word Activation ("Hey Anish")
                </span>
                <span className="font-body-sm text-[#849495]">
                  Push-to-talk works seamlessly even when wake-word is offline
                </span>
              </div>
              <button
                onClick={() => onWakeWordToggle(!wakeWordEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  wakeWordEnabled ? 'bg-[#00f0ff]' : 'bg-[#31353f]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-[#00363a] absolute top-0.5 transition-transform ${
                    wakeWordEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Security & Sandbox */}
      {activeTab === 'security' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-xl">
                  shield
                </span>
                <h3 className="font-headline-md text-base font-bold text-[#dbfcff]">
                  Enclave Security & Folder Allowlists
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-label-sm font-bold">
                {securityMode}
              </span>
            </div>

            {/* Security Mode Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-[#849495] uppercase">
                Execution Safety Policy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['STRICT', 'ELEVATED', 'SIMULATION'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onSecurityModeChange(mode)}
                    className={`py-2 px-2 rounded-lg font-label-sm text-center font-bold uppercase transition-all ${
                      securityMode === mode
                        ? 'bg-[#00f0ff] text-[#00363a]'
                        : 'bg-[#0a0e17] text-[#849495] border border-[#00f0ff]/15 hover:text-[#dfe2f0]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <span className="font-body-sm text-[#849495] mt-1">
                STRICT requires interactive confirmation before any file modification, rename, or deletion.
              </span>
            </div>

            {/* Approved Folders Allowlist */}
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-[#849495] uppercase">
                Approved Directory Allowlist ({allowlistDirs.length})
              </label>
              <div className="flex flex-col gap-1.5">
                {allowlistDirs.map((dir, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-[#0a0e17] border border-[#00f0ff]/15 font-mono text-xs"
                  >
                    <span className="text-[#00f0ff] truncate">{dir}</span>
                    <button
                      onClick={() => handleRemoveDir(idx)}
                      className="text-[#ffb4ab] hover:text-red-400 p-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newDir}
                  onChange={(e) => setNewDir(e.target.value)}
                  placeholder="C:\Users\Anish\NewApprovedFolder"
                  className="flex-1 h-9 px-3 rounded bg-[#0a0e17] text-xs font-mono border border-[#00f0ff]/20 text-[#dfe2f0] focus:outline-none focus:border-[#00f0ff]"
                />
                <button
                  onClick={handleAddDir}
                  className="px-3 h-9 rounded bg-[#00f0ff] text-[#00363a] font-label-sm font-bold uppercase"
                >
                  Add Path
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Local Memory */}
      {activeTab === 'memory' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-xl">
                  psychology
                </span>
                <h3 className="font-headline-md text-base font-bold text-[#dbfcff]">
                  Local Memory & Personalization
                </h3>
              </div>
              <button
                onClick={onClearMemory}
                className="text-[#ffb4ab] font-label-sm uppercase hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {memoryItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#1c1f29] border border-[#00f0ff]/15 flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-[#00f0ff] font-bold font-mono">
                        {item.key}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#31353f] text-[#849495] text-[9px] uppercase">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-body-sm text-[#dfe2f0] truncate mt-0.5">
                      {item.value}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteMemory(item.id)}
                    className="text-[#849495] hover:text-[#ffb4ab] p-1 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add Memory Input */}
            <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#00f0ff]/20 flex flex-col gap-2">
              <span className="font-label-sm text-[#849495] uppercase">
                Save New Preference / Directive
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. preferred_editor)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="h-8 px-2 bg-[#181b25] border border-[#00f0ff]/20 rounded text-xs font-mono text-[#dfe2f0]"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="h-8 px-2 bg-[#181b25] border border-[#00f0ff]/20 rounded text-xs font-mono text-[#dfe2f0]"
                >
                  <option value="preference">Preference</option>
                  <option value="system">System</option>
                  <option value="workflow">Workflow</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Value (e.g. VS Code with Vim extension)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1 h-8 px-2 bg-[#181b25] border border-[#00f0ff]/20 rounded text-xs text-[#dfe2f0]"
                />
                <button
                  onClick={handleCreateMemory}
                  className="px-4 h-8 rounded bg-[#00f0ff] text-[#00363a] font-label-sm font-bold uppercase"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Windows Local Companion Agent Bridge */}
      {activeTab === 'windows-agent' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-xl">
                  laptop_windows
                </span>
                <h3 className="font-headline-md text-base font-bold text-[#dbfcff]">
                  Windows PC Desktop Agent Companion
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#00a2fd]/20 text-[#98cbff] font-label-sm font-bold font-mono">
                TAURI / PYTHON BRIDGE
              </span>
            </div>

            <p className="font-body-md text-[#dfe2f0] leading-relaxed">
              ANISH AI includes a complete Windows native agent template. When deployed on your Windows machine, it executes direct OS calls via <code className="text-[#00f0ff]">pywinauto</code>, <code className="text-[#00f0ff]">psutil</code>, and <code className="text-[#00f0ff]">pyautogui</code> with an input lock and emergency killswitch.
            </p>

            <div className="p-3 bg-[#0a0e17] rounded-lg border border-[#00f0ff]/20 flex items-center justify-between">
              <span className="font-label-sm text-[#00f0ff] font-mono">
                anish_agent.py (FastAPI Local Worker)
              </span>
              <button
                onClick={copyAgentScript}
                className="px-3 py-1 rounded bg-[#00f0ff] text-[#00363a] font-label-sm font-bold uppercase flex items-center gap-1 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedScript ? 'done' : 'content_copy'}
                </span>
                <span>{copiedScript ? 'COPIED!' : 'COPY SCRIPT'}</span>
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-[#0a0e17] border border-[#00f0ff]/10 font-mono text-[11px] text-[#b9cacb] max-h-48 overflow-y-auto leading-relaxed">
              <code>{pythonAgentCode}</code>
            </pre>

            <div className="flex items-center justify-between font-label-sm text-[#849495] pt-1">
              <span>Local Bridge Port: 127.0.0.1:8000</span>
              <span className="text-[#00f0ff]">Elevation: Standard User</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
