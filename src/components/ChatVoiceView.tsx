import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LanguageMode } from '../types';
import { sfx, speakText, stopSpeaking } from '../utils/speech';

interface ChatVoiceViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, isVoice?: boolean) => void;
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  language: LanguageMode;
  onExecuteCardAction: (actionId: string) => void;
  onRunInTerminal: (codeSnippet: string) => void;
  wakeWordAlert?: string | null;
}

export const ChatVoiceView: React.FC<ChatVoiceViewProps> = ({
  messages,
  onSendMessage,
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  language,
  onExecuteCardAction,
  onRunInTerminal,
  wakeWordAlert,
}) => {
  const [inputText, setInputText] = useState('');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), false);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePlayVoice = (msg: ChatMessage) => {
    if (playingMessageId === msg.id) {
      stopSpeaking();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msg.id);
    speakText(msg.content, {
      language: msg.detectedLanguage || language,
      onStart: () => setPlayingMessageId(msg.id),
      onEnd: () => setPlayingMessageId(null),
    });
  };

  const hints = [
    'HEY ANISH',
    'Hey Anish, YouTube kholo',
    'Hey Anish, saare games open karo',
    'Hey Anish, Chrome open karo',
    'System health scan karo',
    'Volume 40% set karo',
  ];

  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-[#00f0ff] font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#0a0e17] text-[#00f0ff] font-mono text-xs border border-[#00f0ff]/20">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="flex flex-col gap-1.5 font-sans leading-relaxed text-sm">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-mono text-sm font-bold text-[#dbfcff] mt-2 mb-1 uppercase tracking-wider">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-[#00f0ff] mt-1 text-xs">•</span>
                <span>{formatInline(line.replace('- ', ''))}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx}>{formatInline(line)}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-24 pt-2 gap-3 min-h-[calc(100vh-140px)]">
      {/* Wake Word HUD Banner */}
      {wakeWordAlert && (
        <div className="w-full p-2.5 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-between text-xs font-mono font-bold text-white animate-bounce">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-lg animate-spin">mic</span>
            <span>{wakeWordAlert}</span>
          </div>
          <span className="bg-[#00f0ff] text-[#00363a] px-2 py-0.5 rounded text-[10px]">MIC OPEN</span>
        </div>
      )}

      {/* Messages List Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pt-2 pb-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 max-w-[88%] ${
                isUser ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#849495] px-1">
                <span>{isUser ? 'ANISH (OPERATOR)' : 'JARVIS // CORE AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.isVoice && (
                  <span className="flex items-center gap-0.5 text-[#00f0ff]">
                    <span className="material-symbols-outlined text-[12px]">mic</span>
                    <span>VOICE</span>
                  </span>
                )}
              </div>

              <div
                className={`p-3.5 rounded-2xl border backdrop-blur-md shadow-lg ${
                  isUser
                    ? 'bg-[#00f0ff]/15 border-[#00f0ff]/40 text-[#dbfcff] rounded-tr-none'
                    : 'bg-[#090e1a]/90 border-[#00f0ff]/25 text-[#dfe2f0] rounded-tl-none'
                }`}
              >
                {/* Voice player header for assistant responses */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#00f0ff]/15 text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayVoice(msg)}
                        className="w-6 h-6 rounded-full bg-[#00f0ff] text-[#002830] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_8px_#00f0ff]"
                        title="Replay Voice Synthesis"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {playingMessageId === msg.id ? 'pause' : 'volume_up'}
                        </span>
                      </button>
                      <span className="text-[#00f0ff] font-bold">JARVIS VOICE</span>
                    </div>
                    <span className="text-[#849495]">czQ9pLzjRaF61EAYjcPC</span>
                  </div>
                )}

                {renderFormattedText(msg.content)}

                {/* Interactive Action Buttons */}
                {msg.interactiveCards && msg.interactiveCards.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#00f0ff]/15">
                    {msg.interactiveCards.map((card, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          sfx.playAcknowledge();
                          onExecuteCardAction(card.actionId);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                          card.type === 'primary'
                            ? 'bg-[#00f0ff] text-[#002830] shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:bg-[#7df4ff]'
                            : card.type === 'danger'
                            ? 'bg-red-600 text-white hover:bg-red-500'
                            : 'bg-[#182234] text-[#98cbff] hover:bg-[#253652] border border-[#00f0ff]/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>{card.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Active Speech Bar */}
      {isSpeaking && (
        <div className="sticky bottom-20 z-20 flex items-center justify-between p-2.5 rounded-xl bg-[#090d18]/95 backdrop-blur-xl border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.3)] animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span className="font-mono text-xs text-[#00f0ff] font-bold">
              ELEVENLABS STREAMING AUDIO OUTPUT...
            </span>
          </div>
          <button
            onClick={() => {
              sfx.playAbort();
              onStopSpeaking();
            }}
            className="px-2 py-0.5 rounded bg-red-600/80 hover:bg-red-600 text-white font-mono text-[10px] font-bold uppercase transition-all"
          >
            STOP AUDIO
          </button>
        </div>
      )}

      {/* Bottom Command Input Dock */}
      <div className="sticky bottom-0 z-30 flex flex-col gap-2 pt-2 bg-[#060a12]/95 backdrop-blur-2xl border-t border-[#00f0ff]/20 pb-1">

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Spell 'HEY ANISH' to open mic, or type command..."
              className="w-full py-2.5 pl-3.5 pr-20 rounded-xl bg-[#0a0f1d] border border-[#00f0ff]/30 text-white placeholder-[#849495] text-xs font-mono focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            />
            <span className="absolute right-2.5 top-2.5 text-[10px] font-mono text-[#00f0ff] uppercase opacity-75">
              UTF-8
            </span>
          </div>

          {/* Quick Microphone Open / Toggle Button */}
          <button
            onClick={() => {
              if (isListening) {
                onStopListening();
              } else {
                onStartListening();
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              isListening
                ? 'bg-white text-black border-white shadow-[0_0_20px_#00f0ff] animate-pulse'
                : 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40 hover:bg-[#00f0ff] hover:text-[#002830]'
            }`}
            title="Open Microphone (Enhanced HD Input)"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isListening ? 'mic' : 'mic_none'}
            </span>
          </button>

          {/* Send Directive Button */}
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-xl bg-[#00f0ff] text-[#002830] flex items-center justify-center hover:bg-[#7df4ff] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
            title="Send Directive"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>

        {/* Hints carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[9px] font-mono text-[#849495] uppercase font-bold flex-shrink-0">
            HINTS:
          </span>
          {hints.map((hint, idx) => (
            <button
              key={idx}
              onClick={() => {
                sfx.playAcknowledge();
                setInputText(hint);
              }}
              className="px-2 py-0.5 rounded-md bg-[#131a29] hover:bg-[#1f2b42] text-[#98cbff] hover:text-[#00f0ff] text-[10px] font-mono whitespace-nowrap transition-all border border-[#00f0ff]/10 cursor-pointer"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
