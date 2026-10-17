import React, { useState } from 'react';
import { ApprovedApp, TelemetryLog } from '../types';
import { sfx, speakText } from '../utils/speech';
import {
  CORE_ANDROID_APPS,
  POPULAR_ANDROID_GAMES,
  AndroidAppConfig,
  executeAndroidLaunch,
  isAndroidDevice,
  getCustomAndroidGames,
  addCustomAndroidGame,
} from '../utils/androidAutomation';

interface AutomationViewProps {
  volume: number;
  onVolumeChange: (vol: number) => void;
  brightness: number;
  onBrightnessChange: (bright: number) => void;
  onEmergencyAbort: () => void;
  telemetryLogs: TelemetryLog[];
  onFlushLogs: () => void;
  onUpdateLogPriority?: (id: string, priority: 'Critical' | 'Normal' | 'Low') => void;
  onAddTelemetryLog?: (command: string, latencyMs: number, status: 'VERIFIED' | 'FAILED', priority?: 'Critical' | 'Normal' | 'Low') => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  volume,
  onVolumeChange,
  brightness,
  onBrightnessChange,
  onEmergencyAbort,
  telemetryLogs,
  onFlushLogs,
  onUpdateLogPriority,
  onAddTelemetryLog,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'Critical' | 'Normal' | 'Low'>('ALL');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'latency'>('time');

  const priorityWeight = (p: 'Critical' | 'Normal' | 'Low') => {
    if (p === 'Critical') return 3;
    if (p === 'Normal') return 2;
    return 1;
  };

  const filteredLogs = telemetryLogs
    .filter((log) => priorityFilter === 'ALL' || log.priority === priorityFilter)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return priorityWeight(b.priority) - priorityWeight(a.priority);
      } else if (sortBy === 'latency') {
        return b.latencyMs - a.latencyMs;
      } else {
        return b.timestamp.localeCompare(a.timestamp);
      }
    });

  // Task Planner State
  const [step3Checkboxes, setStep3Checkboxes] = useState({
    pdfs: true,
    zips: true,
    purge: false,
  });
  const [pipelineExecuting, setPipelineExecuting] = useState(false);
  const [pipelineCompleted, setPipelineCompleted] = useState(false);
  const [pipelineAborted, setPipelineAborted] = useState(false);

  // Approved Apps State
  const [apps, setApps] = useState<ApprovedApp[]>([
    {
      id: 'chrome',
      name: 'Google Chrome',
      icon: 'public',
      status: 'RUNNING',
      pid: 9021,
      details: 'PID: 9021 • 6 Tabs Active',
      path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    {
      id: 'vscode',
      name: 'VS Code',
      icon: 'code',
      status: 'RUNNING',
      pid: 14208,
      details: 'Workspace: anish-core',
      path: 'C:\\Users\\Anish\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
    },
    {
      id: 'notepad',
      name: 'Notepad',
      icon: 'description',
      status: 'IDLE',
      details: 'Standby for fast notes',
      path: 'C:\\Windows\\System32\\notepad.exe',
    },
    {
      id: 'terminal',
      name: 'Terminal (PWSH)',
      icon: 'terminal',
      status: 'IDLE',
      details: 'Elevation: User',
      path: 'C:\\Program Files\\PowerShell\\pwsh.exe',
    },
    {
      id: 'calc',
      name: 'Calculator',
      icon: 'calculate',
      status: 'IDLE',
      details: 'Math scratchpad',
      path: 'C:\\Windows\\System32\\calc.exe',
    },
    {
      id: 'explorer',
      name: 'File Explorer',
      icon: 'folder_open',
      status: 'ACTIVE',
      pid: 4180,
      details: 'C:\\Users\\Anish',
      path: 'C:\\Windows\\explorer.exe',
    },
  ]);

  const [clipboardCount, setClipboardCount] = useState(3);
  const [workstationLocked, setWorkstationLocked] = useState(false);
  const [voiceHookSimulating, setVoiceHookSimulating] = useState(false);

  const handleGrantPermission = () => {
    setPipelineExecuting(true);
    sfx.playAcknowledge();
    setTimeout(() => {
      setPipelineExecuting(false);
      setPipelineCompleted(true);
      sfx.playAcknowledge();
    }, 1800);
  };

  const handleAbortPipeline = () => {
    setPipelineAborted(true);
    sfx.playAbort();
  };

  const toggleAppStatus = (appId: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const nextStatus = app.status === 'RUNNING' || app.status === 'ACTIVE' ? 'IDLE' : 'RUNNING';
          sfx.playAcknowledge();
          return {
            ...app,
            status: nextStatus,
            pid: nextStatus === 'RUNNING' ? Math.floor(Math.random() * 9000) + 1000 : undefined,
          };
        }
        return app;
      })
    );
  };

  const simulateHindiVoiceHook = () => {
    setVoiceHookSimulating(true);
    sfx.playActivate();
    speakText('Computer ki volume kam kar di hai sir.', {
      language: 'hinglish',
      onEnd: () => {
        onVolumeChange(40);
        setVoiceHookSimulating(false);
      },
    });
  };

  const handleLockWorkstation = () => {
    setWorkstationLocked(true);
    sfx.playActivate();
    setTimeout(() => setWorkstationLocked(false), 3000);
  };

  const handleSyncClipboard = () => {
    setClipboardCount((prev) => prev + 1);
    sfx.playAcknowledge();
  };

  // Platform Mode State
  const [automationMode, setAutomationMode] = useState<'android' | 'pc'>('android');
  const [androidGames, setAndroidGames] = useState<AndroidAppConfig[]>(() => [
    ...POPULAR_ANDROID_GAMES,
    ...getCustomAndroidGames(),
  ]);
  const [customGameName, setCustomGameName] = useState('');
  const [customGamePkg, setCustomGamePkg] = useState('');
  const [gameSearch, setGameSearch] = useState('');
  const [batchProgress, setBatchProgress] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [termuxCopied, setTermuxCopied] = useState(false);

  const isAndroid = isAndroidDevice();

  const handleLaunchAndroidApp = async (app: AndroidAppConfig) => {
    sfx.playActivate();
    setFeedbackMsg(`Dispatching intent for ${app.name}...`);
    speakText(`Opening ${app.name} on your Android phone, sir.`, {
      rate: 1.05,
      volume: 0.9,
      language: 'hinglish',
    });
    await executeAndroidLaunch(app);
    if (onAddTelemetryLog) {
      onAddTelemetryLog(`android_intent("${app.name}")`, 14, 'VERIFIED', 'Normal');
    }
    setTimeout(() => {
      setFeedbackMsg(`✓ Dispatched: ${app.name} (${app.packageName})`);
    }, 500);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleLaunchAllGamesHub = async () => {
    sfx.playActivate();
    setFeedbackMsg('Launching All Games Hub (Google Play Games & Game Space)...');
    speakText('Launching all games on your Android phone, sir.', {
      rate: 1.05,
      volume: 0.9,
      language: 'hinglish',
    });
    const playGamesApp = CORE_ANDROID_APPS[3];
    await executeAndroidLaunch(playGamesApp);
    if (onAddTelemetryLog) {
      onAddTelemetryLog('android_games_space("ALL_GAMES_HUB")', 18, 'VERIFIED', 'Normal');
    }
    setTimeout(() => setFeedbackMsg('✓ Game Hub engaged. All installed games accessible.'), 700);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleBatchLaunchSuite = async () => {
    setBatchProgress(1);
    sfx.playActivate();
    speakText('Executing Android phone automation: YouTube, Chrome, Instagram, and Games Hub.', {
      language: 'hinglish',
    });

    for (let i = 0; i < CORE_ANDROID_APPS.length; i++) {
      const app = CORE_ANDROID_APPS[i];
      setBatchProgress(i + 1);
      setFeedbackMsg(`[${i + 1}/4] Launching ${app.name}...`);
      await executeAndroidLaunch(app);
      if (onAddTelemetryLog) {
        onAddTelemetryLog(`android_suite("${app.name}")`, 16, 'VERIFIED', 'Normal');
      }
      await new Promise((r) => setTimeout(r, 900));
    }
    setBatchProgress(null);
    setFeedbackMsg('✓ Android Suite dispatched: YouTube, Chrome, Instagram & Games Hub.');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleBatchCycleGames = async () => {
    setBatchProgress(1);
    sfx.playActivate();
    speakText('Cycling through installed Android games library, sir.', {
      language: 'hinglish',
    });

    const targetGames = androidGames.slice(0, 4);
    for (let i = 0; i < targetGames.length; i++) {
      const game = targetGames[i];
      setBatchProgress(i + 1);
      setFeedbackMsg(`[${i + 1}/${targetGames.length}] Launching ${game.name}...`);
      await executeAndroidLaunch(game);
      if (onAddTelemetryLog) {
        onAddTelemetryLog(`android_game("${game.name}")`, 18, 'VERIFIED', 'Normal');
      }
      await new Promise((r) => setTimeout(r, 900));
    }
    setBatchProgress(null);
    setFeedbackMsg(`✓ Dispatched ${targetGames.length} game intents to Android device.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleAddCustomGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGamePkg.trim()) return;
    const newGame = addCustomAndroidGame(customGameName || customGamePkg, customGamePkg);
    setAndroidGames((prev) => [newGame, ...prev]);
    setCustomGameName('');
    setCustomGamePkg('');
    sfx.playAcknowledge();
    setFeedbackMsg(`✓ Registered new game: ${newGame.name} (${newGame.packageName})`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleCopyTermuxCmd = () => {
    const cmd = `curl -sL ${typeof window !== 'undefined' ? window.location.origin : ''}/api/android/script | bash`;
    navigator.clipboard.writeText(cmd);
    setTermuxCopied(true);
    sfx.playAcknowledge();
    setTimeout(() => setTermuxCopied(false), 2000);
  };

  const filteredGames = androidGames.filter(
    (g) =>
      g.name.toLowerCase().includes(gameSearch.toLowerCase()) ||
      g.packageName.toLowerCase().includes(gameSearch.toLowerCase()) ||
      (g.badge && g.badge.toLowerCase().includes(gameSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-24 pt-2 gap-4">
      {/* 1. EMERGENCY GLOBAL KILLSWITCH BANNER */}
      <section className="w-full relative overflow-hidden rounded-xl bg-[#93000a]/25 border border-[#ffb4ab]/30 shadow-[0_0_24px_rgba(255,180,171,0.2)] p-3 md:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#93000a] text-[#ffdad6] flex-shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
                <span className="font-label-sm text-[#ffb4ab] uppercase tracking-wider font-bold">
                  KILLSWITCH ARMED
                </span>
              </div>
              <p className="font-body-sm text-[#ffdad6] truncate mt-0.5">
                Tap to instantly abort all robotic mouse, keystroke & script workers
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sfx.playAbort();
              onEmergencyAbort();
            }}
            className="flex-shrink-0 px-3.5 py-2 rounded-lg bg-[#ffb4ab] text-[#690005] font-label-md uppercase font-bold tracking-wider shadow-[0_0_16px_rgba(255,180,171,0.4)] active:scale-95 transition-transform flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">stop_circle</span>
            <span>ABORT ALL</span>
          </button>
        </div>
      </section>

      {/* PLATFORM WORKSPACE SWITCHER */}
      <section className="p-1 rounded-xl bg-[#10141f] border border-[#00f0ff]/30 shadow-lg flex items-center gap-1">
        <button
          onClick={() => {
            sfx.playActivate();
            setAutomationMode('android');
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg font-mono text-xs md:text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            automationMode === 'android'
              ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_18px_rgba(0,240,255,0.5)]'
              : 'text-[#849495] hover:text-[#dfe2f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">smartphone</span>
          <span>Android Phone Automation</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-300 border border-red-500/40 uppercase font-mono">
            Active
          </span>
        </button>
        <button
          onClick={() => {
            sfx.playActivate();
            setAutomationMode('pc');
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg font-mono text-xs md:text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            automationMode === 'pc'
              ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_18px_rgba(0,240,255,0.5)]'
              : 'text-[#849495] hover:text-[#dfe2f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
          <span>Windows PC Host</span>
        </button>
      </section>

      {/* ANDROID AUTOMATION HUB */}
      {automationMode === 'android' && (
        <div className="flex flex-col gap-4">
          {/* Status Feedback Toast */}
          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-xs flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.2)] animate-pulse">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">mobile_friendly</span>
                {feedbackMsg}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#b9cacb]">LIVE INTENT</span>
            </div>
          )}

          {/* Android Device Status Header */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#181b25] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col justify-between shadow-sm">
              <span className="font-label-sm text-[#849495] uppercase tracking-wider">
                HOST DEVICE
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-headline-md text-[#dbfcff] font-bold text-xs md:text-sm truncate">
                  {isAndroid ? 'Android Phone' : 'Remote Phone'}
                </span>
              </div>
              <span className="font-label-sm text-[#b9cacb] mt-0.5 truncate">
                {isAndroid ? 'Native Intent Host' : 'ADB & URI Gateway'}
              </span>
            </div>

            <div className="bg-[#181b25] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col justify-between shadow-sm">
              <span className="font-label-sm text-[#849495] uppercase tracking-wider">
                INSTALLED GAMES
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-headline-md text-[#00e676] font-bold text-sm md:text-base">
                  {androidGames.length} Available
                </span>
              </div>
              <span className="font-label-sm text-[#b9cacb] mt-0.5">
                Play Games Hub Ready
              </span>
            </div>

            <div className="bg-[#181b25] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col justify-between shadow-sm">
              <span className="font-label-sm text-[#849495] uppercase tracking-wider">
                INTENT ENGINE
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
                <span className="font-headline-md text-[#00f0ff] font-bold text-xs md:text-sm">
                  ARMED
                </span>
              </div>
              <span className="font-label-sm text-[#b9cacb] mt-0.5">
                Zero Latency Deep Links
              </span>
            </div>
          </div>

          {/* Master 4 Core Android Apps Grid */}
          <section className="bg-[#181b25] border border-[#00f0ff]/25 rounded-xl p-4 flex flex-col gap-3.5 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
                  apps
                </span>
                <div>
                  <h3 className="font-headline-md text-[#dfe2f0] font-bold text-base">
                    Core Android Mobile Automations
                  </h3>
                  <p className="font-label-sm text-[#849495]">
                    Direct 1-tap launchers for YouTube, Chrome, Instagram & All Games
                  </p>
                </div>
              </div>
              <button
                onClick={handleBatchLaunchSuite}
                disabled={batchProgress !== null}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#00a2fd] text-[#00363a] font-label-sm font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.4)] flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {batchProgress !== null ? 'rotate_right' : 'bolt'}
                </span>
                <span>{batchProgress !== null ? `Running (${batchProgress}/4)...` : 'Launch All 4'}</span>
              </button>
            </div>

            {/* 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CORE_ANDROID_APPS.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-[#111624] border border-[#00f0ff]/15 hover:border-[#00f0ff]/40 flex flex-col justify-between gap-3 shadow-sm transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                        style={{
                          backgroundColor: `${app.color}25`,
                          color: app.color,
                          border: `1px solid ${app.color}50`,
                        }}
                      >
                        <span className="material-symbols-outlined text-[24px]">
                          {app.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-body-md text-[#dfe2f0] font-bold">
                          {app.name}
                        </h4>
                        <span
                          className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${app.color}20`,
                            color: app.color,
                          }}
                        >
                          {app.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="font-label-sm text-[#849495] line-clamp-1">
                    {app.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#00f0ff]/10">
                    <button
                      onClick={() => handleLaunchAndroidApp(app)}
                      className="flex-1 py-1.5 px-3 rounded-lg font-mono text-xs uppercase font-bold transition-all flex items-center justify-center gap-1.5 text-white active:scale-95 shadow-sm"
                      style={{
                        backgroundColor: app.color,
                        boxShadow: `0 0 12px ${app.color}50`,
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      <span>Launch App</span>
                    </button>
                    <a
                      href={app.intentUrl || app.customScheme || app.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 rounded-lg bg-[#1c2233] hover:bg-[#262f45] text-[#b9cacb] font-mono text-xs uppercase transition-colors flex items-center gap-1"
                      title="Open direct Android Intent link"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ALL GAMES AVAILABLE ON ANDROID PHONE (Game Space Matrix) */}
          <section className="bg-[#181b25] border border-[#00e676]/25 rounded-xl p-4 flex flex-col gap-3.5 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[#00e676]/15">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
                  <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-[#dfe2f0] font-bold text-base flex items-center gap-2">
                    All Games Available on Phone
                    <span className="px-2 py-0.2 rounded-full text-[10px] bg-[#00e676]/20 text-[#00e676] font-mono border border-[#00e676]/40">
                      {androidGames.length} GAMES
                    </span>
                  </h3>
                  <p className="font-label-sm text-[#849495]">
                    Open Google Play Games Space or directly launch any individual mobile title
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleLaunchAllGamesHub}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-[#00e676] text-[#003816] font-mono text-xs font-bold uppercase shadow-[0_0_12px_rgba(0,230,118,0.4)] hover:shadow-[0_0_18px_rgba(0,230,118,0.7)] flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">sports_esports</span>
                  <span>Play Games Hub</span>
                </button>
                <button
                  onClick={handleBatchCycleGames}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1c2233] hover:bg-[#262f45] text-[#b9cacb] font-mono text-xs uppercase flex items-center gap-1"
                  title="Cycle launch through top 4 games"
                >
                  <span className="material-symbols-outlined text-[14px]">autorenew</span>
                  <span>Cycle</span>
                </button>
              </div>
            </div>

            {/* Game Search Bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#849495] text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search games (BGMI, Free Fire, Call of Duty, Asphalt, Subway Surfers, Genshin)..."
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                className="w-full bg-[#111624] border border-[#00f0ff]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-[#dfe2f0] placeholder-[#5a6872] outline-none focus:border-[#00e676]/50 transition-colors"
              />
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto no-scrollbar">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="p-3 rounded-xl bg-[#111624] border border-slate-800 hover:border-[#00e676]/40 flex flex-col justify-between gap-2 shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${game.color}20`,
                        color: game.color,
                        border: `1px solid ${game.color}40`,
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {game.icon}
                      </span>
                    </div>
                    <span
                      className="px-1.5 py-0.2 rounded font-mono text-[8px] font-bold uppercase truncate max-w-[90px]"
                      style={{
                        backgroundColor: `${game.color}15`,
                        color: game.color,
                      }}
                    >
                      {game.badge}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h5 className="font-body-md text-[#dfe2f0] font-bold text-xs truncate">
                      {game.name}
                    </h5>
                    <p className="font-mono text-[9px] text-[#849495] truncate mt-0.5">
                      {game.packageName}
                    </p>
                  </div>

                  <button
                    onClick={() => handleLaunchAndroidApp(game)}
                    className="w-full py-1.5 px-2 rounded-lg bg-[#1c2233] hover:bg-[#00e676] hover:text-[#003816] text-[#b9cacb] font-mono text-[10px] uppercase font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[12px]">play_arrow</span>
                    <span>Launch Game</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Game Registration Form */}
            <form
              onSubmit={handleAddCustomGame}
              className="mt-1 p-3 rounded-xl bg-[#111624] border border-[#00f0ff]/15 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Custom Game Name (e.g. Apex Legends Mobile)"
                  value={customGameName}
                  onChange={(e) => setCustomGameName(e.target.value)}
                  className="w-full bg-[#181b25] border border-[#00f0ff]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] placeholder-[#5a6872] outline-none"
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Package Name (e.g. com.ea.gp.apex)"
                  value={customGamePkg}
                  onChange={(e) => setCustomGamePkg(e.target.value)}
                  className="w-full bg-[#181b25] border border-[#00f0ff]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] placeholder-[#5a6872] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#00363a] font-mono text-xs uppercase font-bold border border-[#00f0ff]/40 transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>Register Game</span>
              </button>
            </form>
          </section>

          {/* Wireless ADB & Termux Integration */}
          <section className="bg-[#181b25] border border-[#00f0ff]/20 rounded-xl p-4 flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00a2fd] text-[20px]">
                  terminal
                </span>
                <h4 className="font-headline-md text-[#dfe2f0] font-bold text-sm">
                  Android Termux & Wireless ADB Automation Bridge
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] uppercase border border-emerald-500/30">
                NO ROOT REQUIRED
              </span>
            </div>

            <p className="font-body-sm text-[#b9cacb] text-xs">
              Run this one-line command inside <strong className="text-white">Termux</strong> on your Android phone to allow JARVIS to automatically open YouTube, Chrome, Instagram, and any games directly in the background.
            </p>

            <div className="p-2.5 rounded-lg bg-[#0a0e17] border border-[#00f0ff]/20 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
              <code className="text-[#00f0ff] truncate">
                curl -sL {typeof window !== 'undefined' ? window.location.origin : ''}/api/android/script | bash
              </code>
              <button
                onClick={handleCopyTermuxCmd}
                className="px-2.5 py-1 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#00363a] font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[12px]">
                  {termuxCopied ? 'check' : 'content_copy'}
                </span>
                <span>{termuxCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* WINDOWS PC WORKSPACE SECTIONS */}
      {automationMode === 'pc' && (
        <div className="flex flex-col gap-4">
      {/* 2. TELEMETRY GLANCE */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#181b25] border border-[#00f0ff]/15 rounded-xl p-3 flex flex-col justify-between">
          <span className="font-label-sm text-[#849495] uppercase tracking-wider">
            AGENT RUNNER
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span className="font-headline-md text-[#dbfcff] font-bold text-sm md:text-base">
              STANDBY
            </span>
          </div>
          <span className="font-label-sm text-[#b9cacb] mt-0.5">
            PID 18492 // win32
          </span>
        </div>

        <div className="bg-[#181b25] border border-[#00f0ff]/15 rounded-xl p-3 flex flex-col justify-between">
          <span className="font-label-sm text-[#849495] uppercase tracking-wider">
            ACTIVE QUEUE
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-headline-md text-[#98cbff] font-bold text-sm md:text-base">
              {pipelineCompleted ? '0 TASKS' : '1 TASK'}
            </span>
          </div>
          <span className="font-label-sm text-[#b9cacb] mt-0.5">
            {pipelineCompleted ? 'Idle / Ready' : 'Stage 3 of 5'}
          </span>
        </div>

        <div className="bg-[#181b25] border border-[#00f0ff]/15 rounded-xl p-3 flex flex-col justify-between">
          <span className="font-label-sm text-[#849495] uppercase tracking-wider">
            INPUT LOCK
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00dbe9]"></span>
            <span className="font-headline-md text-[#00f0ff] font-bold text-sm md:text-base">
              SECURE
            </span>
          </div>
          <span className="font-label-sm text-[#b9cacb] mt-0.5">
            pyautogui v0.9.54
          </span>
        </div>
      </div>

      {/* 3. ACTIVE TASK PLANNER PIPELINE */}
      <section className="bg-[#181b25] border border-[#00f0ff]/20 rounded-xl p-4 flex flex-col gap-3.5 shadow-md">
        {/* Pipeline Header */}
        <div className="flex items-start justify-between gap-3 pb-1 border-b border-[#00f0ff]/10">
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-[#849495] uppercase tracking-widest">
              // PLANNER_ID :: 0x882A
            </span>
            <h2 className="font-headline-md text-[#dbfcff] font-semibold truncate flex items-center gap-2 mt-0.5 text-base md:text-lg">
              <span className="material-symbols-outlined text-[20px] text-[#00f0ff]">
                account_tree
              </span>
              Organize Downloads Directory
            </h2>
            <span className="font-label-sm text-[#b9cacb] font-mono">
              Target: C:\Users\Anish\Downloads
            </span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#262a34] border border-[#00f0ff]/20 font-label-sm text-[#00dbe9] flex items-center gap-1.5 flex-shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${pipelineCompleted ? 'bg-green-400' : 'bg-[#00f0ff] animate-ping'}`}></span>
            {pipelineCompleted ? 'EXECUTION COMPLETE' : pipelineAborted ? 'ABORTED' : 'AWAITING CONFIRMATION'}
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="flex flex-col gap-3 relative font-sans">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#00f0ff] text-[#00363a] flex items-center justify-center font-label-sm font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <div className="w-0.5 h-7 bg-[#00f0ff]/40"></div>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between">
                <p className="font-body-md text-[#dfe2f0] font-medium truncate">
                  1. Inspect Target Directory
                </p>
                <span className="font-label-sm text-[#00f0ff]">DONE (18ms)</span>
              </div>
              <p className="font-label-sm text-[#b9cacb] truncate">
                C:\Users\Anish\Downloads • 8 files identified
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#00f0ff] text-[#00363a] flex items-center justify-center font-label-sm font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <div className="w-0.5 h-7 bg-[#00f0ff]/40"></div>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between">
                <p className="font-body-md text-[#dfe2f0] font-medium truncate">
                  2. SHA-256 Duplicate Check
                </p>
                <span className="font-label-sm text-[#00f0ff]">DONE (42ms)</span>
              </div>
              <p className="font-label-sm text-[#b9cacb] truncate">
                2 duplicates found (invoice_v1.pdf, setup.exe)
              </p>
            </div>
          </div>

          {/* Step 3 (Active / Authorization Modal inline preview) */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm font-bold shadow-[0_0_12px_rgba(0,162,253,0.5)] ${
                  pipelineCompleted
                    ? 'bg-[#00f0ff] text-[#00363a]'
                    : 'bg-[#00a2fd] text-[#003354]'
                }`}
              >
                <span className={`material-symbols-outlined text-[14px] ${pipelineExecuting ? 'animate-spin' : ''}`}>
                  {pipelineCompleted ? 'check' : 'sync'}
                </span>
              </div>
              <div className="w-0.5 h-7 bg-[#31353f]"></div>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between">
                <p className="font-body-md text-[#98cbff] font-semibold truncate">
                  3. User Authorization
                </p>
                <span
                  className={`font-label-sm uppercase font-bold tracking-wider ${
                    pipelineCompleted ? 'text-[#00f0ff]' : 'text-[#98cbff]'
                  }`}
                >
                  {pipelineCompleted ? 'APPROVED' : 'BLOCKED'}
                </span>
              </div>
              <p className="font-body-sm text-[#b9cacb]">
                Review pending actions before file migration:
              </p>

              {/* Checkbox Preview Box */}
              <div className="mt-2 p-2.5 rounded-lg bg-[#1c1f29] border border-[#00f0ff]/10 flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={step3Checkboxes.pdfs}
                    onChange={(e) =>
                      setStep3Checkboxes((p) => ({ ...p, pdfs: e.target.checked }))
                    }
                    className="w-4 h-4 rounded bg-[#31353f] accent-[#00f0ff]"
                  />
                  <span className="font-label-sm text-[#dfe2f0] font-medium">
                    Relocate 5 PDFs to{' '}
                    <span className="text-[#00f0ff]">Docs\2025</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={step3Checkboxes.zips}
                    onChange={(e) =>
                      setStep3Checkboxes((p) => ({ ...p, zips: e.target.checked }))
                    }
                    className="w-4 h-4 rounded bg-[#31353f] accent-[#00f0ff]"
                  />
                  <span className="font-label-sm text-[#dfe2f0] font-medium">
                    Move 2 ZIPs to{' '}
                    <span className="text-[#00f0ff]">Archives</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={step3Checkboxes.purge}
                    onChange={(e) =>
                      setStep3Checkboxes((p) => ({ ...p, purge: e.target.checked }))
                    }
                    className="w-4 h-4 rounded bg-[#31353f] accent-[#00f0ff]"
                  />
                  <span className="font-label-sm text-[#b9cacb]">
                    Permanently purge duplicate{' '}
                    <span className="text-[#ffb4ab]">invoice_v1(1).pdf</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Step 4 (Queued / Done) */}
          <div className={`flex items-start gap-3 ${pipelineCompleted ? 'opacity-100' : 'opacity-60'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm font-bold ${
                pipelineCompleted ? 'bg-[#00f0ff] text-[#00363a]' : 'bg-[#262a34] text-[#b9cacb]'
              }`}>
                {pipelineCompleted ? <span className="material-symbols-outlined text-[14px]">check</span> : '4'}
              </div>
              <div className="w-0.5 h-7 bg-[#31353f]"></div>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between">
                <p className="font-body-md text-[#b9cacb] truncate">
                  4. Move & Smart Tag
                </p>
                <span className="font-label-sm text-[#849495]">
                  {pipelineCompleted ? 'DONE (120ms)' : 'QUEUED'}
                </span>
              </div>
              <p className="font-label-sm text-[#849495] truncate">
                Executing atomic file renames & NTFS metadata tags
              </p>
            </div>
          </div>

          {/* Step 5 (Queued / Done) */}
          <div className={`flex items-start gap-3 ${pipelineCompleted ? 'opacity-100' : 'opacity-60'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm font-bold ${
                pipelineCompleted ? 'bg-[#00f0ff] text-[#00363a]' : 'bg-[#262a34] text-[#b9cacb]'
              }`}>
                {pipelineCompleted ? <span className="material-symbols-outlined text-[14px]">check</span> : '5'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-body-md text-[#b9cacb] truncate">
                  5. Result Verification
                </p>
                <span className="font-label-sm text-[#849495]">
                  {pipelineCompleted ? 'VERIFIED' : 'QUEUED'}
                </span>
              </div>
              <p className="font-label-sm text-[#849495] truncate">
                Directory digest validation and toast alert
              </p>
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        {!pipelineCompleted && !pipelineAborted && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleGrantPermission}
              disabled={pipelineExecuting}
              className="flex-1 h-11 rounded-lg bg-[#00f0ff] text-[#00363a] font-label-md uppercase font-bold tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.7)] transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {pipelineExecuting ? 'rotate_right' : 'verified'}
              </span>
              <span>{pipelineExecuting ? 'Executing Atomic Moves...' : 'Grant Permission & Execute'}</span>
            </button>
            <button
              onClick={handleAbortPipeline}
              className="px-4 h-11 rounded-lg bg-[#1c1f29] hover:bg-[#262a34] text-[#b9cacb] hover:text-[#dfe2f0] font-label-md uppercase font-medium transition-colors flex items-center justify-center gap-1 active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              <span>Abort</span>
            </button>
          </div>
        )}

        {pipelineCompleted && (
          <div className="p-2.5 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-between text-[#00f0ff] font-mono text-xs">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              Migration complete: 7 files moved, 0 errors.
            </span>
            <button
              onClick={() => {
                setPipelineCompleted(false);
                setPipelineAborted(false);
              }}
              className="text-[#98cbff] hover:underline uppercase"
            >
              Reset Plan
            </button>
          </div>
        )}
      </section>

      {/* 4. APPROVED APPLICATION MATRIX */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">
              apps
            </span>
            <h3 className="font-headline-md text-[#dfe2f0] font-semibold text-base">
              Approved Application Matrix
            </h3>
          </div>
          <span className="font-label-sm text-[#849495] uppercase font-mono">
            {apps.length} APPROVED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {apps.map((app) => {
            const isRunning = app.status === 'RUNNING' || app.status === 'ACTIVE';
            return (
              <div
                key={app.id}
                className="p-3 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 flex flex-col justify-between gap-2.5 shadow-sm relative overflow-hidden group hover:border-[#00f0ff]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#262a34] flex items-center justify-center text-[#00f0ff]">
                    <span className="material-symbols-outlined text-[20px]">
                      {app.icon}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-label-sm font-mono uppercase flex items-center gap-1 ${
                      isRunning
                        ? 'bg-[#00f0ff]/15 text-[#00f0ff]'
                        : 'bg-[#262a34] text-[#849495]'
                    }`}
                  >
                    {isRunning && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
                    )}
                    {app.status}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="font-body-md text-[#dfe2f0] font-semibold truncate">
                    {app.name}
                  </h4>
                  <p className="font-label-sm text-[#b9cacb] truncate mt-0.5">
                    {app.details}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleAppStatus(app.id)}
                    className={`flex-1 py-1 px-2 rounded font-label-sm uppercase font-mono transition-colors text-center ${
                      isRunning
                        ? 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#00f0ff]'
                        : 'bg-[#00f0ff] text-[#00363a] font-bold shadow-sm'
                    }`}
                  >
                    {isRunning ? 'Focus' : 'Launch'}
                  </button>
                  <button
                    onClick={() => toggleAppStatus(app.id)}
                    className="p-1 rounded bg-[#1c1f29] text-[#849495] hover:text-[#ffb4ab] transition-colors"
                    title={isRunning ? 'Close app' : 'Kill process'}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isRunning ? 'restart_alt' : 'close'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CONTROLLED WINDOWS SYSTEM ACTIONS */}
      <section className="bg-[#181b25] border border-[#00f0ff]/15 rounded-xl p-4 flex flex-col gap-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#98cbff] text-[20px]">
              tune
            </span>
            <h3 className="font-headline-md text-[#dfe2f0] font-semibold text-base">
              System Vitals & Controls
            </h3>
          </div>
          <span className="font-label-sm text-[#00dbe9] uppercase tracking-wider">
            DIRECT WIN32 API
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="flex flex-col gap-3">
          {/* Volume Slider */}
          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[#1c1f29] border border-[#00f0ff]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">
                  volume_up
                </span>
                <span className="font-body-md text-[#dfe2f0] font-medium">
                  Master System Volume
                </span>
              </div>
              <span className="font-label-md text-[#dbfcff] font-mono font-bold">
                {volume}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#31353f] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
            />

            {/* Instant Hindi Voice Trigger Demo Banner */}
            <div className="mt-1 p-2 rounded bg-[#262a34] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#00a2fd] text-[16px] flex-shrink-0 animate-pulse">
                  mic
                </span>
                <span className="font-label-sm text-[#98cbff] truncate">
                  Hindi Voice Hook: “Computer ki volume kam kar do”
                </span>
              </div>
              <button
                onClick={simulateHindiVoiceHook}
                disabled={voiceHookSimulating}
                className="px-2.5 py-1 rounded bg-[#00a2fd] text-[#003354] font-label-sm uppercase font-mono font-bold flex-shrink-0 active:scale-95 transition-transform"
              >
                {voiceHookSimulating ? 'Speaking...' : 'Simulate'}
              </button>
            </div>
          </div>

          {/* Brightness Slider */}
          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[#1c1f29] border border-[#00f0ff]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#98cbff] text-[18px]">
                  brightness_medium
                </span>
                <span className="font-body-md text-[#dfe2f0] font-medium">
                  Display Brightness
                </span>
              </div>
              <span className="font-label-md text-[#98cbff] font-mono font-bold">
                {brightness}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => onBrightnessChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#31353f] rounded-lg appearance-none cursor-pointer accent-[#98cbff]"
            />
          </div>
        </div>

        {/* Quick Quick Toggle Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleLockWorkstation}
            className={`p-3 rounded-lg border transition-all flex items-center gap-2.5 text-left active:scale-98 ${
              workstationLocked
                ? 'bg-[#93000a]/40 border-red-500 text-red-200'
                : 'bg-[#1c1f29] border-[#00f0ff]/10 hover:bg-[#262a34]'
            }`}
          >
            <div className="w-8 h-8 rounded bg-[#31353f] flex items-center justify-center text-[#00f0ff] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="min-w-0">
              <p className="font-body-md text-[#dfe2f0] font-semibold truncate">
                {workstationLocked ? 'Locking...' : 'Lock Workstation'}
              </p>
              <span className="font-label-sm text-[#849495] truncate font-mono">
                Win + L Hook
              </span>
            </div>
          </button>

          <button
            onClick={handleSyncClipboard}
            className="p-3 rounded-lg bg-[#1c1f29] hover:bg-[#262a34] border border-[#00f0ff]/10 transition-colors flex items-center gap-2.5 text-left active:scale-98"
          >
            <div className="w-8 h-8 rounded bg-[#31353f] flex items-center justify-center text-[#98cbff] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">content_paste</span>
            </div>
            <div className="min-w-0">
              <p className="font-body-md text-[#dfe2f0] font-semibold truncate">
                Sync Clipboard
              </p>
              <span className="font-label-sm text-[#849495] truncate font-mono">
                {clipboardCount} Items in Buffer
              </span>
            </div>
          </button>
        </div>
      </section>
        </div>
      )}

      {/* 6. AUTOMATION ACTIVITY LOG TABLE */}
      <section className="bg-[#181b25] border border-[#00f0ff]/15 rounded-xl p-4 flex flex-col gap-3 shadow-md font-mono">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#849495] text-[18px]">
              reorder
            </span>
            <h3 className="font-headline-md text-[#dfe2f0] font-semibold text-base">
              Live Automation Telemetry Log ({filteredLogs.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-[#1c1f29] p-1 rounded-lg border border-[#00f0ff]/10">
              <span className="text-[10px] text-[#849495] px-1 uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'time' | 'priority' | 'latency')}
                className="bg-transparent text-[#00f0ff] text-xs outline-none cursor-pointer pr-1"
              >
                <option value="time" className="bg-[#1c1f29] text-[#dfe2f0]">Timestamp</option>
                <option value="priority" className="bg-[#1c1f29] text-[#dfe2f0]">Priority Level</option>
                <option value="latency" className="bg-[#1c1f29] text-[#dfe2f0]">Latency (ms)</option>
              </select>
            </div>
            <button
              onClick={onFlushLogs}
              className="text-[#00f0ff] font-label-sm uppercase font-mono hover:underline flex items-center gap-1"
            >
              <span>Flush</span>
              <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
            </button>
          </div>
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[#849495] font-label-sm mr-1">Filter Priority:</span>
          {(['ALL', 'Critical', 'Normal', 'Low'] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setPriorityFilter(level);
                sfx.playAcknowledge();
              }}
              className={`px-2.5 py-1 rounded text-xs uppercase font-mono font-bold transition-all ${
                priorityFilter === level
                  ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#dfe2f0] border border-[#00f0ff]/10'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto no-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-center text-[#849495] text-xs">
              No telemetry logs match priority filter [{priorityFilter}].
            </div>
          ) : (
            filteredLogs.map((log) => {
              const priorityColor =
                log.priority === 'Critical'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : log.priority === 'Low'
                  ? 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  : 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/30';

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded bg-[#1c1f29] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border border-transparent hover:border-[#00f0ff]/20 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-label-sm text-[#849495] flex-shrink-0">
                      {log.timestamp}
                    </span>
                    <span className="font-label-sm text-[#98cbff] font-semibold truncate">
                      {log.command}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    {onUpdateLogPriority ? (
                      <select
                        value={log.priority}
                        onChange={(e) =>
                          onUpdateLogPriority(log.id, e.target.value as 'Critical' | 'Normal' | 'Low')
                        }
                        className={`px-2 py-0.5 rounded font-label-sm font-bold uppercase border cursor-pointer ${priorityColor}`}
                        title="Change task priority"
                      >
                        <option value="Critical" className="bg-[#1c1f29] text-red-300">Critical</option>
                        <option value="Normal" className="bg-[#1c1f29] text-[#00f0ff]">Normal</option>
                        <option value="Low" className="bg-[#1c1f29] text-gray-300">Low</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded font-label-sm font-bold uppercase border ${priorityColor}`}>
                        {log.priority}
                      </span>
                    )}

                    <span className="font-label-sm text-[#849495]">
                      {log.latencyMs}ms
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-label-sm font-bold uppercase ${
                        log.status === 'VERIFIED'
                          ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                          : 'bg-[#93000a] text-[#ffdad6]'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
