import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, CheckCircle2, RefreshCcw, Download, Play, Shield } from 'lucide-react';
import { sfx } from '../utils/speech';

export const PcBridgeView: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [customCmd, setCustomCmd] = useState('');
  const [executing, setExecuting] = useState(false);
  const [commandLogs, setCommandLogs] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/pc-bridge/status');
      const data = await res.json();
      setStatus(data);
      if (data.logs) {
        setCommandLogs(data.logs);
      }
    } catch (e) {
      console.error('Failed to fetch PC bridge status', e);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRunCommand = async (cmdString: string) => {
    if (!cmdString.trim()) return;
    setExecuting(true);
    sfx.playActivate();
    try {
      const res = await fetch('/api/pc-bridge/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdString })
      });
      const data = await res.json();
      if (data.success) {
        setCustomCmd('');
        fetchStatus();
      }
    } catch (e) {
      console.error('Command dispatch error', e);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full text-xs font-mono tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                JARVIS PC Bridge Link Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide font-mono">
              LOCAL PC AUTOMATION CONTROL CENTER
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Connect your Windows, macOS, or Linux PC to JARVIS via the lightweight local bridge agent. JARVIS will execute your voice and text commands directly on your hardware in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/pc-bridge/script"
              download="jarvis_bridge.py"
              onClick={() => sfx.playAcknowledge()}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all text-sm font-mono"
            >
              <Download className="w-4 h-4" />
              Download Agent (jarvis_bridge.py)
            </a>
          </div>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Bridge Status</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${status?.online ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {status?.online ? 'ONLINE & CONNECTED' : 'AWAITING AGENT'}
            </span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{status?.bridge?.hostname || 'Anish-Windows-PC'}</div>
          <div className="text-xs text-slate-400 mt-1 font-mono">Platform: {status?.bridge?.platform || 'win32'}</div>
        </div>

        <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Command Queue</span>
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{status?.pendingCount || 0} Pending</div>
          <div className="text-xs text-slate-400 mt-1 font-mono">Real-time polling active (2s interval)</div>
        </div>

        <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Security Sandbox</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono">FULL ACCESS ENABLED</div>
          <div className="text-xs text-slate-400 mt-1 font-mono">Local execution authorized by user</div>
        </div>
      </div>

      {/* Quick PC Command Shortcuts */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-semibold text-white font-mono mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Quick PC Automation Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Open Notepad', cmd: 'notepad' },
            { label: 'Open VS Code', cmd: 'code' },
            { label: 'System Info', cmd: 'systeminfo' },
            { label: 'List Downloads', cmd: 'dir C:\\Users\\Administrator\\Downloads' },
            { label: 'Take Screenshot', cmd: 'start snippingtool' },
            { label: 'Task List', cmd: 'tasklist' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => handleRunCommand(action.cmd)}
              disabled={executing}
              className="p-3 bg-slate-800/80 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 rounded-xl text-left transition-all group flex flex-col justify-between"
            >
              <span className="text-xs font-mono text-cyan-400 font-medium group-hover:text-cyan-300">{action.label}</span>
              <span className="text-[10px] text-slate-400 font-mono mt-2 truncate">{action.cmd}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Command Dispatcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-semibold text-white font-mono mb-3">Dispatch Custom PC Command</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={customCmd}
            onChange={(e) => setCustomCmd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunCommand(customCmd)}
            placeholder="e.g. mspaint, start chrome https://github.com, dir, ipconfig..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleRunCommand(customCmd)}
            disabled={executing || !customCmd.trim()}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            Execute on PC
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Pro-tip: You can also activate Hands-Free mode and simply say: "JARVIS, open notepad on my PC" or "JARVIS, run systeminfo".
        </p>
      </div>

      {/* Execution Terminal Output Log */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wider">Live PC Execution Output Logs</h3>
          </div>
          <button
            onClick={fetchStatus}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all"
            title="Refresh Logs"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {commandLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No command execution logs recorded yet. Run a command above!</div>
          ) : (
            commandLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-cyan-400 font-bold">$ {log.command}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {log.status}
                    </span>
                    <span className="text-[10px]">{log.timestamp}</span>
                  </div>
                </div>
                <pre className="text-slate-300 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto text-[11px]">
                  {log.output}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Setup Guide Box */}
      <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          How to connect your PC in 30 seconds:
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-mono leading-relaxed">
          <li>Download the Python agent script using the button at the top: <code className="text-cyan-400">jarvis_bridge.py</code></li>
          <li>Make sure Python 3 is installed on your Windows/Mac/Linux PC (<code className="text-cyan-400">pip install requests</code>)</li>
          <li>Open your PC terminal and run: <code className="text-cyan-400">python jarvis_bridge.py</code></li>
          <li>JARVIS will instantly establish a secure bridge link with your hardware, allowing full hands-free and voice-driven automation of your entire computer!</li>
        </ol>
      </div>
    </div>
  );
};
