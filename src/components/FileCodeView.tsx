import React, { useState } from 'react';
import { FileItem, SystemVitals } from '../types';
import { sfx } from '../utils/speech';

interface FileCodeViewProps {
  vitals: SystemVitals;
  onRunScript: (scriptName: string) => void;
}

export const FileCodeView: React.FC<FileCodeViewProps> = ({ vitals, onRunScript }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'code' | 'vitals'>('files');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Subprocess spawned in isolated cgroup...',
    '[ENCLAVE] Syscall whitelist loaded: 42 rules applied.',
    '>> [STDOUT] psutil.virtual_memory() -> OK. Active processes scanned: 142.',
    '>> [STDOUT] Memory usage: 14.2 / 32 GB. CPU Load: 28%.',
  ]);
  const [isRunningSandbox, setIsRunningSandbox] = useState(false);
  const [summaryModal, setSummaryModal] = useState<string | null>(null);

  const files: FileItem[] = [
    {
      id: 'f1',
      name: 'agent_tools.py',
      size: '18.4 KB',
      modified: '12 mins ago',
      type: 'Python Source',
      extension: '.py',
      tag: 'v3.8.4',
      contentPreview: 'import psutil, sys\nfrom anish_core import SecurityShield\n...',
    },
    {
      id: 'f2',
      name: 'neural_weights_config.json',
      size: '4.1 KB',
      modified: '2 hrs ago',
      type: 'JSON Configuration',
      extension: '.json',
      tag: 'Structured',
    },
    {
      id: 'f3',
      name: 'quarterly_audit_brief.pdf',
      size: '1.2 MB',
      modified: 'Yesterday',
      type: 'PDF Document',
      extension: '.pdf',
      tag: 'OCR Synced',
    },
    {
      id: 'f4',
      name: 'executive_summary_q4.docx',
      size: '840 KB',
      modified: '3 days ago',
      type: 'Word Document',
      extension: '.docx',
      tag: 'Verified',
    },
    {
      id: 'f5',
      name: 'win32_hooks.py',
      size: '12.2 KB',
      modified: 'Yesterday',
      type: 'Python Source',
      extension: '.py',
      tag: 'v1.4.0',
    },
  ];

  const filteredFiles = selectedFormat === 'all'
    ? files
    : files.filter((f) => f.extension === selectedFormat);

  const handleExecuteSandbox = () => {
    setIsRunningSandbox(true);
    sfx.playActivate();
    const timestamp = new Date().toTimeString().split(' ')[0];

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[${timestamp}] Executing agent_tools.py in sandboxed PyPy3...`,
        `>> [STDOUT] psutil audit vitals: Nominal. Zero threads hung.`,
        `[EXIT] Subprocess finished with exit status 0 (clean).`,
      ]);
      setIsRunningSandbox(false);
      sfx.playAcknowledge();
    }, 900);
  };

  const handleClearTerminal = () => {
    setTerminalLogs(['[CLEARED] Buffer reset by user.']);
    sfx.playAcknowledge();
  };

  const handleAgenticAction = (actionName: string) => {
    sfx.playActivate();
    setSummaryModal(actionName);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-24 pt-2 text-[#dfe2f0]">
      {/* 1. Top Segment HUD Bar / Tab Controls */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between font-label-sm text-[#849495] uppercase tracking-widest px-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span className="text-[#00dbe9]">
              WORKSPACE RUNTIME // SECURE ENCLAVE
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#98cbff]">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>SANDBOXED</span>
          </div>
        </div>

        {/* Neon Glazed Tab Switcher */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-[#0a0e17] border border-[#00f0ff]/15 shadow-lg gap-1">
          <button
            onClick={() => {
              sfx.playActivate();
              setActiveTab('files');
            }}
            className={`relative flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg font-label-md transition-all duration-200 ${
              activeTab === 'files'
                ? 'bg-[#262a34] text-[#00f0ff] font-bold shadow-md'
                : 'text-[#b9cacb] hover:text-[#dfe2f0]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              folder_special
            </span>
            <span className="truncate">Files</span>
          </button>

          <button
            onClick={() => {
              sfx.playActivate();
              setActiveTab('code');
            }}
            className={`relative flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg font-label-md transition-all duration-200 ${
              activeTab === 'code'
                ? 'bg-[#262a34] text-[#00f0ff] font-bold shadow-md'
                : 'text-[#b9cacb] hover:text-[#dfe2f0]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span className="truncate">Python Lab</span>
          </button>

          <button
            onClick={() => {
              sfx.playActivate();
              setActiveTab('vitals');
            }}
            className={`relative flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg font-label-md transition-all duration-200 ${
              activeTab === 'vitals'
                ? 'bg-[#262a34] text-[#00f0ff] font-bold shadow-md'
                : 'text-[#b9cacb] hover:text-[#dfe2f0]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">monitoring</span>
            <span className="truncate">Vitals</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FILE ORGANIZER & EXPLORER */}
      {activeTab === 'files' && (
        <section className="flex flex-col gap-4">
          {/* Active Directory Header Card */}
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[#849495] uppercase tracking-wider font-mono">
                // DIR_WORKSPACE_INDEX
              </span>
              <div className="px-2 py-0.5 rounded bg-[#31353f] text-[#00dbe9] font-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  lock_clock
                </span>
                <span>SYNCED 0.4s AGO</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0e17] text-[#00f0ff] border border-[#00f0ff]/10">
              <span className="material-symbols-outlined text-[#98cbff] text-[20px]">
                folder_open
              </span>
              <span className="font-label-md truncate select-all">
                C:\Users\Anish\Workspace\JARVIS_Core
              </span>
            </div>

            {/* Quick Format Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {[
                { ext: 'all', label: 'ALL', count: 28 },
                { ext: '.py', label: '.PY', count: 12 },
                { ext: '.pdf', label: '.PDF', count: 8 },
                { ext: '.docx', label: '.DOCX', count: 3 },
                { ext: '.json', label: '.JSON', count: 5 },
              ].map((chip) => {
                const isSelected = selectedFormat === chip.ext;
                return (
                  <button
                    key={chip.ext}
                    onClick={() => setSelectedFormat(chip.ext)}
                    className={`px-3 py-1 rounded font-label-sm uppercase flex items-center gap-1.5 flex-shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#00f0ff] text-[#00363a] font-bold shadow-sm'
                        : 'bg-[#31353f] text-[#b9cacb] hover:text-[#00f0ff]'
                    }`}
                  >
                    <span>{chip.label}</span>
                    <span
                      className={`px-1 rounded text-[9px] ${
                        isSelected ? 'bg-[#00363a]/25 text-[#00363a]' : 'bg-[#181b25] text-[#849495]'
                      }`}
                    >
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Items List */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-sm text-[#849495] uppercase font-mono">
                INDEXED ASSETS ({filteredFiles.length})
              </span>
              <button className="text-[#98cbff] hover:text-[#00f0ff] font-label-sm uppercase flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[14px]">tune</span>
                <span>Sort: Modified</span>
              </button>
            </div>

            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-xl bg-[#1c1f29] border border-[#00f0ff]/10 flex items-center justify-between shadow-sm hover:border-[#00f0ff]/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      file.extension === '.py'
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                        : file.extension === '.json'
                        ? 'bg-[#00a2fd]/20 text-[#98cbff]'
                        : 'bg-[#93000a]/20 text-[#ffb4ab]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {file.extension === '.py'
                        ? 'code'
                        : file.extension === '.json'
                        ? 'data_object'
                        : 'description'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-md text-[#dbfcff] font-semibold truncate">
                      {file.name}
                    </span>
                    <span className="font-label-sm text-[#849495]">
                      {file.size} • {file.modified} • {file.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab('code');
                      sfx.playActivate();
                    }}
                    className="p-2 rounded-lg bg-[#31353f] text-[#98cbff] hover:text-[#00f0ff] transition-colors"
                    title="Load in Sandbox"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      terminal
                    </span>
                  </button>
                  <button
                    onClick={() => handleAgenticAction(`Viewing metadata for ${file.name}`)}
                    className="p-2 rounded-lg bg-[#31353f] text-[#b9cacb] hover:text-[#00f0ff] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      more_vert
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Safe File Operations Hub */}
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[#849495] uppercase tracking-wider font-mono">
                // AGENTIC FILE ACTIONS
              </span>
              <span className="font-label-sm text-[#98cbff] font-mono">READY</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAgenticAction('Generate AI Summary')}
                className="p-3 rounded-xl bg-[#262a34] hover:bg-[#31353f] border border-[#00f0ff]/10 text-left flex flex-col gap-1 transition-all active:scale-98"
              >
                <div className="flex items-center justify-between text-[#00f0ff]">
                  <span className="material-symbols-outlined text-[20px]">
                    summarize
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#849495]">
                    arrow_forward
                  </span>
                </div>
                <span className="font-headline-md text-sm md:text-base text-[#dfe2f0] font-semibold">
                  Generate AI Summary
                </span>
                <span className="font-body-sm text-[#849495]">
                  Synthesize key points
                </span>
              </button>

              <button
                onClick={() => handleAgenticAction('SHA-256 Deduplicate')}
                className="p-3 rounded-xl bg-[#262a34] hover:bg-[#31353f] border border-[#00f0ff]/10 text-left flex flex-col gap-1 transition-all active:scale-98"
              >
                <div className="flex items-center justify-between text-[#98cbff]">
                  <span className="material-symbols-outlined text-[20px]">
                    content_copy
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#849495]">
                    arrow_forward
                  </span>
                </div>
                <span className="font-headline-md text-sm md:text-base text-[#dfe2f0] font-semibold">
                  Deduplicate
                </span>
                <span className="font-body-sm text-[#849495]">
                  Hash matching scan
                </span>
              </button>

              <button
                onClick={() => handleAgenticAction('Batch Semantic Rename')}
                className="p-3 rounded-xl bg-[#262a34] hover:bg-[#31353f] border border-[#00f0ff]/10 text-left flex flex-col gap-1 transition-all active:scale-98"
              >
                <div className="flex items-center justify-between text-[#d0bcff]">
                  <span className="material-symbols-outlined text-[20px]">
                    drive_file_rename_outline
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#849495]">
                    arrow_forward
                  </span>
                </div>
                <span className="font-headline-md text-sm md:text-base text-[#dfe2f0] font-semibold">
                  Batch Rename
                </span>
                <span className="font-body-sm text-[#849495]">
                  Semantic regex schema
                </span>
              </button>

              <button
                onClick={() => handleAgenticAction('Create Executive Report')}
                className="p-3 rounded-xl bg-[#262a34] hover:bg-[#31353f] border border-[#00f0ff]/10 text-left flex flex-col gap-1 transition-all active:scale-98"
              >
                <div className="flex items-center justify-between text-[#00dbe9]">
                  <span className="material-symbols-outlined text-[20px]">
                    lab_profile
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#849495]">
                    arrow_forward
                  </span>
                </div>
                <span className="font-headline-md text-sm md:text-base text-[#dfe2f0] font-semibold">
                  Create Report
                </span>
                <span className="font-body-sm text-[#849495]">
                  Export audit markdown
                </span>
              </button>
            </div>
          </div>

          {/* Security Quarantine Notice */}
          <div className="p-3.5 rounded-xl bg-[#0a0e17] border border-[#00f0ff]/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#98cbff] text-[22px] flex-shrink-0 mt-0.5">
              verified_user
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[#98cbff] font-semibold uppercase">
                Enclave Security Policy active
              </span>
              <span className="font-body-sm text-[#849495] mt-0.5">
                Restricted to authorized user folders only. System root & OS partitions are strictly locked.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: PYTHON CODE SANDBOX & SAFE EXECUTION */}
      {activeTab === 'code' && (
        <section className="flex flex-col gap-4">
          <div className="rounded-xl bg-[#181b25] border border-[#00f0ff]/20 shadow-md overflow-hidden flex flex-col">
            {/* Editor Header */}
            <div className="px-4 py-2.5 bg-[#262a34] border-b border-[#00f0ff]/15 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]"></span>
                <span className="font-label-md text-[#00f0ff] font-bold truncate">
                  agent_tools.py
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#1c1f29] text-[#849495] font-label-sm">
                  PYTHON 3.11
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExecuteSandbox}
                  disabled={isRunningSandbox}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-label-sm font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isRunningSandbox ? 'rotate_right' : 'play_arrow'}
                  </span>
                  <span>{isRunningSandbox ? 'RUNNING...' : 'SAFE RUN'}</span>
                </button>
              </div>
            </div>

            {/* Syntax Highlighted Code Viewer */}
            <div className="p-4 bg-[#0a0e17] font-mono text-xs overflow-x-auto leading-relaxed select-text">
              <div className="flex gap-4">
                <div className="select-none text-[#849495]/40 flex flex-col text-right font-mono text-xs">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                  <span>05</span>
                  <span>06</span>
                  <span>07</span>
                  <span>08</span>
                  <span>09</span>
                  <span>10</span>
                </div>
                <div className="flex flex-col min-w-0 text-[#dfe2f0]">
                  <div>
                    <span className="text-[#d0bcff] font-bold">import</span>{' '}
                    <span className="text-[#00f0ff]">psutil</span>,{' '}
                    <span className="text-[#00f0ff]">sys</span>
                  </div>
                  <div>
                    <span className="text-[#d0bcff] font-bold">from</span>{' '}
                    <span className="text-[#00f0ff]">anish_core</span>{' '}
                    <span className="text-[#d0bcff] font-bold">import</span>{' '}
                    <span className="text-[#98cbff]">SecurityShield</span>
                  </div>
                  <div className="text-[#849495]"># Initialize sandbox telemetry</div>
                  <div>
                    <span className="text-[#98cbff]">shield</span> ={' '}
                    <span className="text-[#00f0ff]">SecurityShield</span>(isolation=
                    <span className="text-[#00f0ff]">True</span>)
                  </div>
                  <div className="text-[#849495]"># Inspect virtual memory allocated</div>
                  <div>
                    <span className="text-[#d0bcff] font-bold">def</span>{' '}
                    <span className="text-[#00dbe9]">audit_vitals</span>():
                  </div>
                  <div className="pl-4">
                    <span className="text-[#98cbff]">mem</span> = psutil.
                    <span className="text-[#00f0ff]">virtual_memory</span>()
                  </div>
                  <div className="pl-4">
                    <span className="text-[#98cbff]">p_count</span> = len(psutil.
                    <span className="text-[#00f0ff]">pids</span>())
                  </div>
                  <div className="pl-4">
                    <span className="text-[#d0bcff] font-bold">return</span> f
                    <span className="text-[#98cbff]">
                      "OK. Active processes scanned: &#123;p_count&#125;."
                    </span>
                  </div>
                  <div>
                    <span className="text-[#00dbe9]">print</span>(audit_vitals())
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Micro-Status */}
            <div className="px-4 py-2 bg-[#262a34]/60 border-t border-[#00f0ff]/10 flex items-center justify-between font-label-sm text-[#849495]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a2fd]"></span>
                <span>MEMORY LIMIT: 512 MB</span>
              </span>
              <span>TIMEOUT: 5000ms</span>
            </div>
          </div>

          {/* Output Terminal HUD */}
          <div className="rounded-xl bg-[#0a0e17] border border-[#00f0ff]/20 shadow-md flex flex-col overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 bg-[#1c1f29] border-b border-[#00f0ff]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[16px]">
                  terminal
                </span>
                <span className="font-label-sm text-[#00f0ff] uppercase font-bold tracking-wider">
                  SANDBOX STDOUT // LOG TERMINAL
                </span>
              </div>
              <button
                onClick={handleClearTerminal}
                className="text-[#849495] hover:text-[#dfe2f0] font-label-sm uppercase"
              >
                Clear
              </button>
            </div>

            <div className="p-4 flex flex-col gap-1.5 min-h-[140px] text-[#dfe2f0] overflow-x-auto leading-relaxed">
              {terminalLogs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.startsWith('>>')
                      ? 'text-[#00f0ff] font-medium'
                      : log.startsWith('[EXIT')
                      ? 'text-green-400'
                      : 'text-[#849495]'
                  }
                >
                  {log}
                </div>
              ))}
              <div className="text-[#b9cacb] flex items-center gap-1.5 pt-1">
                <span className="text-[#00f0ff]">SYS.READY:</span>
                <span>sandbox idling safely.</span>
                <span className="inline-block w-2 h-4 bg-[#00f0ff] animate-pulse ml-0.5"></span>
              </div>
            </div>
          </div>

          {/* Code Sandbox Quick Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                sfx.playAcknowledge();
                setTerminalLogs((p) => [
                  ...p,
                  '[LINT] Ruff v0.4 & MyPy checked 1 file. 0 errors, 0 warnings found.',
                ]);
              }}
              className="p-3 rounded-lg bg-[#1c1f29] border border-[#00f0ff]/15 flex items-center gap-2.5 text-[#dfe2f0] hover:bg-[#262a34] transition-colors"
            >
              <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
                bug_report
              </span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm font-semibold">Static Lint</span>
                <span className="font-body-sm text-[#849495]">0 warnings detected</span>
              </div>
            </button>

            <button
              onClick={() => {
                sfx.playAcknowledge();
                setTerminalLogs((p) => [
                  ...p,
                  `[SNAPSHOT] Checkpoint saved at ${new Date().toLocaleTimeString()} (rev_9b8a).`,
                ]);
              }}
              className="p-3 rounded-lg bg-[#1c1f29] border border-[#00f0ff]/15 flex items-center gap-2.5 text-[#dfe2f0] hover:bg-[#262a34] transition-colors"
            >
              <span className="material-symbols-outlined text-[#98cbff] text-[20px]">
                history
              </span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm font-semibold">Snapshot State</span>
                <span className="font-body-sm text-[#849495]">Restore revision</span>
              </div>
            </button>
          </div>
        </section>
      )}

      {/* TAB 3: REAL-TIME SYSTEM TELEMETRY GAUGES */}
      {activeTab === 'vitals' && (
        <section className="flex flex-col gap-4">
          {/* Quick Vitals Snapshot Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* CPU Usage Dial Card */}
            <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col items-center justify-between relative overflow-hidden">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="font-label-sm text-[#849495] uppercase font-mono">
                  // CPU LOAD
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-label-sm font-bold">
                  24 CORES
                </span>
              </div>

              {/* Radial Dial */}
              <div className="relative w-28 h-28 flex items-center justify-center my-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-[#31353f]"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    className="text-[#00f0ff]"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.3"
                    strokeDashoffset={`${251.3 - (251.3 * vitals.cpuPercent) / 100}`}
                    strokeLinecap="round"
                    strokeWidth="8"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline-lg text-[#dbfcff] font-bold">
                    {vitals.cpuPercent}
                    <span className="font-label-md">%</span>
                  </span>
                  <span className="font-label-sm text-[#849495]">
                    {vitals.cpuGhz} GHz
                  </span>
                </div>
              </div>

              {/* Cores Activity Breakdown */}
              <div className="w-full mt-2">
                <div className="flex items-center justify-between font-label-sm text-[#849495] mb-1">
                  <span>CORE MESH BALANCED</span>
                  <span className="text-[#00dbe9]">C0-C7</span>
                </div>
                <div className="grid grid-cols-8 gap-1 h-3">
                  {[100, 80, 40, 60, 20, 30, 25, 50].map((v, i) => (
                    <div
                      key={i}
                      className="bg-[#00f0ff] rounded-xs"
                      style={{ opacity: v / 100 }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* RAM Usage Ring Card */}
            <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col items-center justify-between relative overflow-hidden">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="font-label-sm text-[#849495] uppercase font-mono">
                  // RAM DENSITY
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#98cbff]/10 text-[#98cbff] font-label-sm font-bold">
                  DDR5
                </span>
              </div>

              {/* Radial Dial */}
              <div className="relative w-28 h-28 flex items-center justify-center my-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-[#31353f]"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    className="text-[#98cbff]"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.3"
                    strokeDashoffset={`${251.3 - (251.3 * vitals.ramUsedGb) / vitals.ramTotalGb}`}
                    strokeLinecap="round"
                    strokeWidth="8"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-headline-lg text-[#98cbff] font-bold">
                    {vitals.ramUsedGb}
                  </span>
                  <span className="font-label-sm text-[#849495]">
                    OF {vitals.ramTotalGb} GB
                  </span>
                </div>
              </div>

              <div className="w-full mt-2 flex flex-col gap-0.5 text-center">
                <span className="font-label-sm text-[#849495] uppercase">
                  SWAP POOL
                </span>
                <span className="font-label-md text-[#dfe2f0]">
                  1.1 GB Used (Paged)
                </span>
              </div>
            </div>
          </div>

          {/* GPU Load & Thermal Diagnostics */}
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
                  memory
                </span>
                <span className="font-label-md text-[#00f0ff] font-bold">
                  NVIDIA GeForce RTX 4080
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#262a34] text-[#00dbe9] font-label-sm">
                PCIE GEN 4
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#1c1f29] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[#849495]">CORE TEMP</span>
                  <span className="font-headline-md text-[#dbfcff] font-bold">
                    {vitals.gpuTempC}°C
                  </span>
                  <span className="font-body-sm text-[#00f0ff]">
                    Normal Operating
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#00f0ff] text-[28px]">
                  thermostat
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#1c1f29] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[#849495]">VRAM POOL</span>
                  <span className="font-headline-md text-[#98cbff] font-bold">
                    {vitals.vramUsedPercent}%
                  </span>
                  <span className="font-body-sm text-[#849495]">
                    2.88 / 16 GB
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#98cbff] text-[28px]">
                  speed
                </span>
              </div>
            </div>

            {/* Tensor Cores Sparkline */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center justify-between font-label-sm text-[#849495]">
                <span>TENSOR ENGINE INFERENCE LOAD</span>
                <span className="text-[#00f0ff]">ACTIVE // 44 TFLOPS</span>
              </div>
              <div className="h-8 w-full bg-[#0a0e17] rounded flex items-end gap-1 px-1 py-1">
                {[3, 5, 4, 7, 6, 5, 7, 8, 4, 3, 5, 3].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#00f0ff] rounded-xs"
                    style={{
                      height: `${h * 10}%`,
                      opacity: 0.3 + (h / 8) * 0.7,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Network Throughput Meter */}
          <div className="p-4 rounded-xl bg-[#181b25] border border-[#00f0ff]/15 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[#849495] uppercase tracking-wider font-mono">
                // DUPLEX FIBER THROUGHPUT
              </span>
              <div className="flex items-center gap-1.5 font-label-sm text-[#98cbff]">
                <span className="w-2 h-2 rounded-full bg-[#00a2fd]"></span>
                <span>1000 Mbps NIC</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#1c1f29] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#262a34] flex items-center justify-center text-[#00f0ff]">
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_downward
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-[#849495]">INGRESS</span>
                  <span className="font-headline-md text-[#dbfcff] font-bold">
                    {vitals.ingressMbps} <span className="font-label-sm">MB/s</span>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#1c1f29] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#262a34] flex items-center justify-center text-[#98cbff]">
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_upward
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-[#849495]">EGRESS</span>
                  <span className="font-headline-md text-[#98cbff] font-bold">
                    {vitals.egressMbps} <span className="font-label-sm">KB/s</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal for Agentic Action Simulation */}
      {summaryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181b25] border border-[#00f0ff]/40 rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/20">
              <div className="flex items-center gap-2 text-[#00f0ff]">
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                <h3 className="font-headline-md text-base font-bold text-[#dbfcff]">
                  {summaryModal}
                </h3>
              </div>
              <button
                onClick={() => setSummaryModal(null)}
                className="text-[#849495] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-md text-[#dfe2f0] leading-relaxed">
              Agentic inspection completed for approved path{' '}
              <code className="text-[#00f0ff] font-mono">C:\Users\Anish\Workspace\JARVIS_Core</code>.
              All operations validated against Enclave security policies.
            </p>
            <div className="p-3 bg-[#0a0e17] rounded-lg border border-[#00f0ff]/15 font-mono text-xs text-[#98cbff]">
              SHA-256 Digest: 8f4a13d8c2e7109b83f... [VERIFIED SAFE]
            </div>
            <button
              onClick={() => {
                sfx.playAcknowledge();
                setSummaryModal(null);
              }}
              className="mt-2 w-full py-2.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-label-md font-bold uppercase active:scale-98 transition-all"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
