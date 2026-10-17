import React, { useState, useEffect, useRef } from 'react';
import { TabType, LanguageMode, ChatMessage, SystemVitals, TelemetryLog, MemoryItem } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CoreHudView } from './components/CoreHudView';
import { ChatVoiceView } from './components/ChatVoiceView';
import { FileCodeView } from './components/FileCodeView';
import { SettingsView } from './components/SettingsView';
import { DesktopInstallQRWidget } from './components/DesktopInstallQRWidget';
import { VoiceRecognizer, speakText, stopSpeaking, sfx, checkWakeWord } from './utils/speech';
import { executeAndroidLaunch, CORE_ANDROID_APPS, POPULAR_ANDROID_GAMES } from './utils/androidAutomation';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('core-hud');
  const [language, setLanguage] = useState<LanguageMode>('hindi');
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [voiceVolume, setVoiceVolume] = useState<number>(0.9);
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(true);
  const [securityMode, setSecurityMode] = useState<'STRICT' | 'ELEVATED' | 'SIMULATION'>('STRICT');

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAutoListening, setIsAutoListening] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [killswitchArmed, setKillswitchArmed] = useState<boolean>(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [wakeWordAlert, setWakeWordAlert] = useState<string | null>(null);

  // Screen Wake Lock for minimized background desktop persistence
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (e) {
        console.warn('Wake Lock error:', e);
      }
    };
    requestWakeLock();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      wakeLock?.release?.().catch(() => {});
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Recognizer reference
  const recognizerRef = useRef<VoiceRecognizer | null>(null);

  // System Vitals State
  const [vitals, setVitals] = useState<SystemVitals>({
    cpuPercent: 28,
    cpuGhz: 5.4,
    ramUsedGb: 14.2,
    ramTotalGb: 32,
    activeProtocols: 4,
    securityLevel: 'STRICT',
    volumePercent: 45,
    brightnessPercent: 80,
    gpuTempC: 38,
    vramUsedPercent: 18,
    ingressMbps: 2.4,
    egressMbps: 380,
    fps: 120,
    latencyMs: 14,
  });

  // Stream Logs for Core HUD Ticker
  const [streamLogs, setStreamLogs] = useState<Array<{ time: string; text: string }>>([
    {
      time: '09:42:15',
      text: 'Task verified: Opened Chrome -> tabs initialized (Workspace alpha online)',
    },
    {
      time: '09:40:02',
      text: 'Quantum Kernel v4.8 mesh nominal. Low-latency Win32 socket ready.',
    },
    {
      time: '09:38:44',
      text: 'Security Shield: Allowlist sandbox enforced across user directories.',
    },
  ]);

  // Telemetry Logs for Automation Screen
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    {
      id: 'log1',
      timestamp: '14:32:08',
      command: 'safe_file_move',
      latencyMs: 18,
      status: 'VERIFIED',
      priority: 'Normal',
    },
    {
      id: 'log2',
      timestamp: '14:31:55',
      command: 'psutil.disk_usage',
      latencyMs: 6,
      status: 'VERIFIED',
      priority: 'Low',
    },
    {
      id: 'log3',
      timestamp: '14:30:12',
      command: 'app_launcher("Code")',
      latencyMs: 142,
      status: 'VERIFIED',
      priority: 'Normal',
    },
    {
      id: 'log4',
      timestamp: '14:28:44',
      command: 'pywinauto.send_keys',
      latencyMs: 350,
      status: 'FAILED',
      priority: 'Critical',
    },
    {
      id: 'log5',
      timestamp: '14:25:01',
      command: 'psutil.cpu_percent',
      latencyMs: 2,
      status: 'VERIFIED',
      priority: 'Low',
    },
  ]);

  // Initial Chat Messages (matches Image 5)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'user',
      content: 'Jarvis, Chrome kholo and mere Downloads folder mein se saare PDF files search karo.',
      timestamp: '10:42:04 AM',
      isVoice: true,
      asrConfidence: 0.994,
      detectedLanguage: 'hinglish',
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content:
        'Understood Anish sir. Chrome has been launched on Display 1. Now scanning approved directory C:\\Users\\Anish\\Downloads for .pdf files...',
      timestamp: '10:42:06 AM',
      audioDuration: '00:04',
      detectedLanguage: 'hinglish',
      findings: {
        title: 'Found 8 PDF documents in directory.',
        detail: '',
        size: '32.4 MB TOTAL',
      },
      interactiveCards: [
        { label: 'Approve Organization', actionId: 'approve_org', type: 'primary' },
        { label: 'Open File Viewer', actionId: 'view_file', type: 'secondary' },
        { label: 'Cancel', actionId: 'cancel', type: 'secondary' },
      ],
    },
    {
      id: 'msg-3',
      role: 'user',
      content: 'Explain this Python script snippet for psutil monitoring.',
      timestamp: '10:43:18 AM',
      isVoice: false,
    },
    {
      id: 'msg-4',
      role: 'assistant',
      content:
        'Yeh script CPU usage aur Virtual Memory consumption continuously inspect karti hai. Below is the optimized telemetry loop:',
      timestamp: '10:43:20 AM',
      codeSnippet: `# ANISH System Resource Daemon
import psutil, time

def inspect_vitals(threshold=85.0):
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory().percent
    if cpu > threshold or mem > threshold:
        return {"alert": True, "cpu": cpu, "mem": mem}
    return {"status": "nominal", "cpu": cpu, "mem": mem}`,
    },
  ]);

  // Local Memory Items
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([
    {
      id: 'm1',
      key: 'preferred_editor',
      value: 'Visual Studio Code (Workspace: anish-core)',
      category: 'workflow',
      updatedAt: '2026-10-14',
    },
    {
      id: 'm2',
      key: 'audio_preset',
      value: 'Preset Executive (Master Volume: 40%)',
      category: 'system',
      updatedAt: '2026-10-14',
    },
    {
      id: 'm3',
      key: 'primary_language',
      value: 'Hinglish (Natural hybrid speech synthesis)',
      category: 'preference',
      updatedAt: '2026-10-14',
    },
  ]);

  // Initialize Speech Recognizer
  useEffect(() => {
    recognizerRef.current = new VoiceRecognizer();
    recognizerRef.current.setLanguage(language);
  }, [language]);

  // Gentle vitals oscillation for realistic cyberpunk telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setVitals((prev) => {
        const deltaCpu = (Math.random() - 0.5) * 3;
        const newCpu = Math.max(18, Math.min(65, Math.round(prev.cpuPercent + deltaCpu)));
        return {
          ...prev,
          cpuPercent: newCpu,
          latencyMs: 12 + Math.floor(Math.random() * 4),
        };
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const addTelemetryLog = (command: string, latencyMs: number, status: 'VERIFIED' | 'FAILED', explicitPriority?: 'Critical' | 'Normal' | 'Low') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    
    // AI automatic priority classification
    let priority: 'Critical' | 'Normal' | 'Low' = explicitPriority || 'Normal';
    if (!explicitPriority) {
      if (status === 'FAILED' || command.includes('EMERGENCY') || command.includes('kill') || command.includes('sandbox')) {
        priority = 'Critical';
      } else if (command.includes('psutil') || command.includes('brightness') || command.includes('volume')) {
        priority = 'Low';
      } else {
        priority = 'Normal';
      }
    }

    setTelemetryLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        command,
        latencyMs,
        status,
        priority,
      },
      ...prev,
    ]);

    setStreamLogs((prev) => [
      {
        time: timeStr,
        text: `Command [${command}] finished with status: ${status} [Priority: ${priority}].`,
      },
      ...prev.slice(0, 10),
    ]);
  };

  const updateLogPriority = (id: string, priority: 'Critical' | 'Normal' | 'Low') => {
    setTelemetryLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, priority } : log))
    );
    sfx.playAcknowledge();
  };

  // Push-To-Talk Voice Start
  const startListening = () => {
    if (isListening) return;
    setIsListening(true);
    sfx.playActivate();

    if (recognizerRef.current?.isSupported) {
      recognizerRef.current.start({
        onResult: (transcript, isFinal) => {
          setLastTranscript(transcript);
          if (isFinal) {
            handleSendMessage(transcript, true);
            stopListening();
          }
        },
        onError: (err) => {
          console.warn('Voice recognizer error:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    } else {
      // Fallback voice simulation for browsers without Web Speech recognition
      setTimeout(() => {
        const samplePrompt = 'Hey Anish, open YouTube';
        setLastTranscript(samplePrompt);
        setIsListening(false);
        handleSendMessage(samplePrompt, true);
      }, 1500);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognizerRef.current?.stop();
  };

  // Continuous hands-free auto-listening mode effect with "HEY ANISH" wake phrase detection
  useEffect(() => {
    let active = true;
    const runAutoListen = () => {
      if (!isAutoListening || !active) return;
      if (!isListening && !isSpeaking) {
        if (recognizerRef.current?.isSupported) {
          setIsListening(true);
          recognizerRef.current.start({
            continuous: true,
            onResult: (transcript, isFinal) => {
              setLastTranscript(transcript);
              const wakeCheck = checkWakeWord(transcript);

              if (wakeCheck.detected) {
                sfx.playWakeChime();
                setWakeWordAlert(`"${wakeCheck.wakeWord?.toUpperCase()}" DETECTED // MICROPHONE ACTIVE`);
                setTimeout(() => setWakeWordAlert(null), 4000);

                if (isFinal && wakeCheck.command.length > 1) {
                  handleSendMessage(wakeCheck.command, true);
                } else if (isFinal && wakeCheck.command.length <= 1) {
                  speakText('Yes Anish sir, microphone is open. I am listening.', {
                    rate: speechRate,
                    volume: voiceVolume,
                  });
                }
              } else if (isFinal && transcript.trim().length > 3) {
                // Direct commands executed hands-free
                handleSendMessage(transcript, true);
              }
            },
            onError: () => {
              setIsListening(false);
            },
            onEnd: () => {
              setIsListening(false);
              if (active && isAutoListening) {
                setTimeout(runAutoListen, 400);
              }
            },
          });
        }
      }
    };

    if (isAutoListening) {
      runAutoListen();
    } else {
      stopListening();
    }

    return () => {
      active = false;
    };
  }, [isAutoListening, isSpeaking, speechRate, voiceVolume]);

  // Sending Chat Message / Command
  const handleSendMessage = async (text: string, isVoice = false) => {
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // When text is typed/spelled "HEY ANISH", open the microphone immediately!
    if (!isVoice) {
      const wakeCheck = checkWakeWord(text);
      if (wakeCheck.detected) {
        sfx.playWakeChime();
        setWakeWordAlert(`"${wakeCheck.wakeWord?.toUpperCase()}" SPELLED // OPENING MICROPHONE`);
        setTimeout(() => setWakeWordAlert(null), 4500);

        // Open microphone immediately
        startListening();

        if (wakeCheck.command.length <= 1) {
          // User only typed "HEY ANISH" -> open mic and prompt
          const assistantMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: `Hello Anish sir! **Microphone is open and active** with studio noise suppression and auto-gain. I am listening...`,
            timestamp: timeStr,
            detectedLanguage: language,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          speakText('Hello Anish sir, microphone is open. I am listening.', {
            rate: speechRate,
            volume: voiceVolume,
            language: 'english',
          });
          addTelemetryLog('wake_phrase("HEY ANISH") -> MIC_OPEN', 8, 'VERIFIED');
          return;
        }
        // If there's a command like "Hey Anish, open YouTube", proceed with the trimmed command
        text = wakeCheck.command;
      }
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timeStr,
      isVoice,
      asrConfidence: 0.994,
      detectedLanguage: language,
    };

    setMessages((prev) => [...prev, userMsg]);
    sfx.playAcknowledge();

    // Call server endpoint
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedLanguage: data.detectedLanguage || language,
        audioDuration: '00:04',
        findings: data.action?.params?.foundFiles
          ? {
              title: `Found ${data.action.params.foundFiles} PDF documents in directory.`,
              detail: '',
              size: data.action.params.totalSize || '32.4 MB TOTAL',
            }
          : undefined,
        interactiveCards: data.interactiveCards || [],
        codeSnippet: data.codeSnippet || null,
        action: data.action,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Execute action effects
      if (data.action?.type === 'volume_control' && data.action.params?.newLevel) {
        setVitals((p) => ({ ...p, volumePercent: data.action.params.newLevel }));
        addTelemetryLog(`set_volume(${data.action.params.newLevel})`, 12, 'VERIFIED');
      } else if (data.action?.type === 'launch_android_app') {
        executeAndroidLaunch({
          name: data.action.target || 'Android App',
          packageName: data.action.params?.packageName || 'com.google.android.youtube',
          intentUrl: data.action.params?.intentUrl,
          customScheme: data.action.params?.customScheme,
          webUrl: data.action.params?.webUrl,
        });
        addTelemetryLog(`android_intent("${data.action.target || data.action.params?.packageName}")`, 16, 'VERIFIED', 'Normal');
      } else if (data.action?.type === 'launch_android_games') {
        executeAndroidLaunch({
          name: 'All Games Hub',
          packageName: data.action.params?.packageName || 'com.google.android.play.games',
          intentUrl: data.action.params?.intentUrl || 'intent://#Intent;package=com.google.android.play.games;scheme=https;end',
          customScheme: 'playgames://',
          webUrl: 'https://play.google.com/store/apps/category/GAME',
        });
        addTelemetryLog('android_games_space("ALL_INSTALLED_GAMES")', 18, 'VERIFIED', 'Normal');
      } else if (data.action?.type === 'launch_android_suite') {
        executeAndroidLaunch(CORE_ANDROID_APPS[0]); // Starts YouTube & suite
        addTelemetryLog('android_suite("YouTube, Chrome, Instagram, Games")', 22, 'VERIFIED', 'Critical');
      } else if (data.action?.type === 'launch_app') {
        addTelemetryLog(`app_launcher("${data.action.target}")`, 142, 'VERIFIED');
      } else if (data.action?.type === 'lock_pc') {
        addTelemetryLog('LockWorkStation()', 8, 'VERIFIED');
      } else {
        addTelemetryLog(`directive_exec("${text.slice(0, 18)}...")`, 15, 'VERIFIED');
      }

      // Speak assistant voice response
      const spokenText = data.spokenText || data.replyText;
      setIsSpeaking(true);
      speakText(spokenText, {
        rate: speechRate,
        volume: voiceVolume,
        language: data.detectedLanguage || language,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback offline reply
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `Understood Anish sir: "${text}". Quantum kernel has logged the directive and executed verification.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedLanguage: language,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
  };

  // Emergency Global Killswitch Handler
  const handleEmergencyAbort = () => {
    setKillswitchArmed(true);
    sfx.playAbort();
    stopSpeaking();
    stopListening();
    setIsSpeaking(false);
    setIsListening(false);

    addTelemetryLog('EMERGENCY_KILLSWITCH_ENGAGED', 0, 'VERIFIED');

    setTimeout(() => {
      setKillswitchArmed(false);
    }, 3000);
  };

  // Tactical Quick Actions on Core HUD
  const handleQuickAction = (key: string) => {
    sfx.playActivate();
    if (key === 'launch_space') {
      handleSendMessage('Open Google Chrome and VS Code in developer workspace', false);
    } else if (key === 'android_youtube') {
      executeAndroidLaunch(CORE_ANDROID_APPS[0]);
      addTelemetryLog('android_intent("YouTube")', 14, 'VERIFIED', 'Normal');
      speakText('Opening YouTube on your Android phone, sir.', { language: 'hinglish' });
    } else if (key === 'android_chrome') {
      executeAndroidLaunch(CORE_ANDROID_APPS[1]);
      addTelemetryLog('android_intent("Google Chrome")', 14, 'VERIFIED', 'Normal');
      speakText('Opening Google Chrome on your Android phone, sir.', { language: 'hinglish' });
    } else if (key === 'android_insta') {
      executeAndroidLaunch(CORE_ANDROID_APPS[2]);
      addTelemetryLog('android_intent("Instagram")', 14, 'VERIFIED', 'Normal');
      speakText('Opening Instagram on your Android phone, sir.', { language: 'hinglish' });
    } else if (key === 'android_games') {
      executeAndroidLaunch(CORE_ANDROID_APPS[3]);
      addTelemetryLog('android_games_space("ALL_GAMES_HUB")', 18, 'VERIFIED', 'Normal');
      speakText('Launching all available games on your Android phone, sir.', { language: 'hinglish' });
    } else if (key === 'volume_40') {
      setVitals((p) => ({ ...p, volumePercent: 40 }));
      speakText('Computer ki volume 40 percent par set kar di hai sir.', {
        language: 'hinglish',
      });
      addTelemetryLog('set_volume(40)', 14, 'VERIFIED');
    } else if (key === 'android_batch_all') {
      sfx.playActivate();
      speakText('Launching all 4 Android core applications: YouTube, Chrome, Instagram, and All Games.', { language: 'english' });
      CORE_ANDROID_APPS.forEach((app, i) => {
        setTimeout(() => executeAndroidLaunch(app), i * 350);
      });
      addTelemetryLog('android.batch_suite_launch(4_apps)', 24, 'VERIFIED');
    } else if (key === 'clean_downloads') {
      sfx.playAcknowledge();
      speakText('Storage temp cache purge executed successfully.', { language: 'english' });
      addTelemetryLog('fs.purge_temp_artifacts()', 22, 'VERIFIED');
    } else if (key === 'health_scan') {
      speakText('Running thermal and registry health scan now.', {
        language: 'english',
      });
      addTelemetryLog('psutil.health_scan()', 85, 'VERIFIED');
    }
  };

  // Interactive Card Actions (Approve, Open File Viewer, etc.)
  const handleExecuteCardAction = (actionId: string) => {
    sfx.playAcknowledge();
    if (actionId === 'approve_org') {
      sfx.playAcknowledge();
      speakText('Desktop workspace organization approved and executed.', { language: 'english' });
      addTelemetryLog('workspace.auto_organize()', 32, 'VERIFIED');
    } else if (actionId === 'view_file') {
      setCurrentTab('file-code');
    } else if (actionId === 'run_code') {
      setCurrentTab('file-code');
    } else if (actionId === 'android_launch_youtube') {
      executeAndroidLaunch(CORE_ANDROID_APPS[0]);
      addTelemetryLog('android_intent("YouTube")', 14, 'VERIFIED', 'Normal');
    } else if (actionId === 'android_launch_chrome') {
      executeAndroidLaunch(CORE_ANDROID_APPS[1]);
      addTelemetryLog('android_intent("Google Chrome")', 14, 'VERIFIED', 'Normal');
    } else if (actionId === 'android_launch_insta') {
      executeAndroidLaunch(CORE_ANDROID_APPS[2]);
      addTelemetryLog('android_intent("Instagram")', 14, 'VERIFIED', 'Normal');
    } else if (actionId === 'android_launch_games_hub') {
      executeAndroidLaunch(CORE_ANDROID_APPS[3]);
      addTelemetryLog('android_games_space("ALL_GAMES_HUB")', 18, 'VERIFIED', 'Normal');
    } else if (actionId === 'android_launch_bgmi') {
      executeAndroidLaunch(POPULAR_ANDROID_GAMES[0]);
      addTelemetryLog('android_game("BGMI")', 18, 'VERIFIED', 'Normal');
    } else if (actionId === 'android_launch_freefire') {
      executeAndroidLaunch(POPULAR_ANDROID_GAMES[1]);
      addTelemetryLog('android_game("Free Fire MAX")', 18, 'VERIFIED', 'Normal');
    } else if (actionId === 'android_launch_all_suite') {
      sfx.playActivate();
      speakText('Launching all 4 Android core applications: YouTube, Chrome, Instagram, and All Games.', { language: 'english' });
      CORE_ANDROID_APPS.forEach((app, i) => {
        setTimeout(() => executeAndroidLaunch(app), i * 350);
      });
      addTelemetryLog('android.batch_suite_launch(4_apps)', 24, 'VERIFIED');
    }
  };

  const handleRunInTerminal = (codeSnippet: string) => {
    setCurrentTab('file-code');
    sfx.playAcknowledge();
  };

  return (
    <div className="min-h-screen bg-[#060a12] cyber-scanlines text-[#dfe2f0] flex flex-col font-sans antialiased selection:bg-[#00f0ff] selection:text-[#002830]">
      {/* Top HUD Header */}
      <Header
        currentTab={currentTab}
        latencyMs={vitals.latencyMs}
        isOnline={true}
        onKillswitch={handleEmergencyAbort}
        killswitchArmed={killswitchArmed}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full pt-16 pb-20">
        {currentTab === 'core-hud' && (
          <CoreHudView
            vitals={vitals}
            language={language}
            onLanguageChange={setLanguage}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onQuickAction={handleQuickAction}
            onEmergencyStop={handleEmergencyAbort}
            lastTranscript={lastTranscript}
            streamLogs={streamLogs}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            handsFreeMode={isAutoListening}
            onToggleHandsFree={() => setIsAutoListening((prev) => !prev)}
            wakeWordAlert={wakeWordAlert}
          />
        )}

        {currentTab === 'chat-voice' && (
          <ChatVoiceView
            messages={messages}
            onSendMessage={handleSendMessage}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopSpeaking={() => {
              stopSpeaking();
              setIsSpeaking(false);
            }}
            language={language}
            onExecuteCardAction={handleExecuteCardAction}
            onRunInTerminal={handleRunInTerminal}
            wakeWordAlert={wakeWordAlert}
          />
        )}

        {currentTab === 'file-code' && (
          <FileCodeView
            vitals={vitals}
            onRunScript={(scriptName) => {
              addTelemetryLog(`sandbox_exec(${scriptName})`, 95, 'VERIFIED');
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            language={language}
            onLanguageChange={setLanguage}
            speechRate={speechRate}
            onSpeechRateChange={setSpeechRate}
            voiceVolume={voiceVolume}
            onVoiceVolumeChange={setVoiceVolume}
            wakeWordEnabled={wakeWordEnabled}
            onWakeWordToggle={setWakeWordEnabled}
            securityMode={securityMode}
            onSecurityModeChange={setSecurityMode}
            memoryItems={memoryItems}
            onAddMemory={(key, value, category) => {
              const newItem: MemoryItem = {
                id: `mem-${Date.now()}`,
                key,
                value,
                category,
                updatedAt: new Date().toISOString().split('T')[0],
              };
              setMemoryItems((p) => [...p, newItem]);
            }}
            onDeleteMemory={(id) => {
              setMemoryItems((p) => p.filter((m) => m.id !== id));
            }}
            onClearMemory={() => {
              setMemoryItems([]);
            }}
          />
        )}
      </main>

      {/* Bottom HUD Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          sfx.playActivate();
          setCurrentTab(tab);
        }}
      />

      {/* Floating QR Code Install Widget in Right Hand Corner */}
      <DesktopInstallQRWidget />
    </div>
  );
}
