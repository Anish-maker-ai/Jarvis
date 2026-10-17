/**
 * ANISH AI Voice & Speech Engine
 * Web Speech API + Web Audio Synthesizer for futuristic sci-fi feedback
 * Enhanced HD Microphone capture with noise suppression, echo cancellation, auto-gain & wake-word detection
 */

// Sci-Fi Audio Chimes using Web Audio API
class SoundEffects {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Futuristic activation chime (Core Online / Push-to-Talk)
  playActivate() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // AudioContext not permitted or muted
    }
  }

  // Sci-Fi Wake Word "HEY ANISH" Chime (Dual ascending harmonic tone)
  playWakeChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.05); // A5
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.22); // A6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.28);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.28);
    } catch {}
  }

  // Acknowledge chime (Task verified / command sent)
  playAcknowledge() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // Abort / Killswitch buzzer
  playAbort() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }
}

export const sfx = new SoundEffects();

export const DEFAULT_ELEVENLABS_VOICE_ID = 'czQ9pLzjRaF61EAYjcPC';
export const DEFAULT_ELEVENLABS_VOICE_URL = 'https://elevenlabs.io/voices/czQ9pLzjRaF61EAYjcPC';

export function getActiveVoiceId(): string {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('elevenlabs_voice_id');
    if (saved && saved.trim()) return saved.trim();
  }
  return DEFAULT_ELEVENLABS_VOICE_ID;
}

export function setActiveVoiceId(id: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('elevenlabs_voice_id', id.trim());
  }
}

let currentAudio: HTMLAudioElement | null = null;

// Fallback Browser Web Speech API tuned for fluent Hindi & futuristic persona
function fallbackWebSpeech(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    language?: 'hinglish' | 'english' | 'hindi';
    onStart?: () => void;
    onEnd?: () => void;
  }
) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this device');
    options.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 0.95;
  utterance.volume = options.volume ?? 1.0;
  utterance.lang = 'hi-IN';

  const speakWithVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prioritize Hindi voices or Indian regional voices
      const hindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('hi') ||
          v.lang.toLowerCase().includes('in') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('lekha') ||
          v.name.toLowerCase().includes('heera')
      ) || voices.find((v) => v.lang.startsWith('hi')) || voices.find((v) => v.lang.startsWith('en-IN'));

      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = hindiVoice.lang;
      }
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = () => {
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      speakWithVoices();
    };
    // Fallback timer if voiceschanged doesn't fire
    setTimeout(speakWithVoices, 100);
  } else {
    speakWithVoices();
  }
}

// Primary Speech Synthesis with ElevenLabs voice czQ9pLzjRaF61EAYjcPC
export async function speakText(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    language?: 'hinglish' | 'english' | 'hindi';
    voiceId?: string;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}
) {
  stopSpeaking();

  const voiceId = options.voiceId || getActiveVoiceId();
  const customApiKey =
    typeof localStorage !== 'undefined' ? localStorage.getItem('elevenlabs_api_key') : null;

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customApiKey ? { 'x-elevenlabs-key': customApiKey } : {}),
      },
      body: JSON.stringify({
        text,
        voiceId,
        language: options.language || 'hinglish',
      }),
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('audio')) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      currentAudio = new Audio(audioUrl);
      currentAudio.volume = options.volume ?? 1.0;
      currentAudio.playbackRate = options.rate ?? 1.0;

      currentAudio.onplay = () => {
        options.onStart?.();
      };
      currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        options.onEnd?.();
      };
      currentAudio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        fallbackWebSpeech(text, options);
      };

      await currentAudio.play();
      return;
    }
  } catch (err) {
    console.warn('ElevenLabs TTS direct call fallback:', err);
  }

  fallbackWebSpeech(text, options);
}

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Wake Word Detection Helper for "HEY ANISH" and "JARVIS"
export interface WakeWordResult {
  detected: boolean;
  wakeWord: 'hey anish' | 'jarvis' | null;
  command: string;
}

export function checkWakeWord(text: string): WakeWordResult {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  const heyAnishRegex = /^(?:(?:hey|hay|he|hi)\s+)?(?:anish|aneesh|aneash|anishh)\b[\s,:]*(.*)$/i;
  const jarvisRegex = /^(?:(?:hey|hi)\s+)?jarvis\b[\s,:]*(.*)$/i;

  const anishMatch = lower.match(heyAnishRegex);
  if (anishMatch) {
    return {
      detected: true,
      wakeWord: 'hey anish',
      command: anishMatch[1]?.trim() || '',
    };
  }

  const jarvisMatch = lower.match(jarvisRegex);
  if (jarvisMatch) {
    return {
      detected: true,
      wakeWord: 'jarvis',
      command: jarvisMatch[1]?.trim() || '',
    };
  }

  const anishKeywords = ['hey anish', 'hey aneesh', 'hay anish', 'he anish'];
  for (const kw of anishKeywords) {
    if (lower.includes(kw)) {
      const idx = lower.indexOf(kw);
      const after = trimmed.slice(idx + kw.length).replace(/^[\s,:]+/, '').trim();
      return {
        detected: true,
        wakeWord: 'hey anish',
        command: after,
      };
    }
  }

  if (lower.includes('jarvis')) {
    const idx = lower.indexOf('jarvis');
    const after = trimmed.slice(idx + 6).replace(/^[\s,:]+/, '').trim();
    return {
      detected: true,
      wakeWord: 'jarvis',
      command: after,
    };
  }

  return {
    detected: false,
    wakeWord: null,
    command: text,
  };
}

// Restored Standard Speech Recognition (ASR) - Ultra-Reliable & Non-Locking
export class VoiceRecognizer {
  public isSupported: boolean = false;
  private recognition: any = null;
  private currentLang: string = 'en-IN';
  public isActive: boolean = false;

  constructor() {
    const SpeechRec =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    this.isSupported = !!SpeechRec;
  }

  setLanguage(lang: 'hinglish' | 'english' | 'hindi') {
    if (lang === 'hindi') {
      this.currentLang = 'hi-IN';
    } else if (lang === 'english') {
      this.currentLang = 'en-US';
    } else {
      this.currentLang = 'en-IN';
    }
  }

  start(callbacks: {
    onStart?: () => void;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (err: any) => void;
    onEnd?: () => void;
    continuous?: boolean;
  }) {
    const SpeechRec =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRec) {
      this.isActive = false;
      callbacks.onError?.('Speech recognition not available in this browser');
      return;
    }

    // Gracefully clean up any stale session before spawning a fresh instance
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch {}
      this.recognition = null;
    }

    try {
      const rec = new SpeechRec();
      this.recognition = rec;
      rec.continuous = callbacks.continuous ?? false;
      rec.interimResults = true;
      rec.lang = this.currentLang;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        this.isActive = true;
        sfx.playActivate();
        callbacks.onStart?.();
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const text = (final || interim).trim();
        if (text) {
          callbacks.onResult?.(text, !!final);
        }
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error event:', e?.error || e);
        this.isActive = false;
        // Always reset state cleanly so microphone never freezes
        callbacks.onError?.(e?.error || 'speech_error');
      };

      rec.onend = () => {
        this.isActive = false;
        callbacks.onEnd?.();
      };

      rec.start();
    } catch (e: any) {
      console.warn('VoiceRecognizer start failed:', e);
      this.isActive = false;
      callbacks.onError?.(e?.message || e);
    }
  }

  stop() {
    this.isActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  abort() {
    this.isActive = false;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
    }
  }
}
