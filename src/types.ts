export type TabType = 'core-hud' | 'chat-voice' | 'file-code' | 'settings';

export type LanguageMode = 'hinglish' | 'english' | 'hindi';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isVoice?: boolean;
  asrConfidence?: number;
  detectedLanguage?: LanguageMode;
  audioDuration?: string;
  action?: {
    type: string;
    target?: string | null;
    params?: any;
    verified?: boolean;
    requiresConfirmation?: boolean;
  };
  interactiveCards?: Array<{
    label: string;
    actionId: string;
    type: 'primary' | 'secondary' | 'danger';
  }>;
  codeSnippet?: string | null;
  findings?: {
    title: string;
    detail: string;
    size?: string;
  };
}

export interface ApprovedApp {
  id: string;
  name: string;
  icon: string;
  status: 'RUNNING' | 'IDLE' | 'ACTIVE';
  pid?: number;
  details: string;
  path: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  command: string;
  latencyMs: number;
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
  priority: 'Critical' | 'Normal' | 'Low';
}

export interface PipelineStep {
  id: number;
  title: string;
  detail: string;
  status: 'DONE' | 'BLOCKED' | 'QUEUED' | 'RUNNING';
  duration?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  modified: string;
  type: string;
  extension: '.py' | '.pdf' | '.docx' | '.json';
  tag?: string;
  contentPreview?: string;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'preference' | 'system' | 'workflow';
  updatedAt: string;
}

export interface SystemVitals {
  cpuPercent: number;
  cpuGhz: number;
  ramUsedGb: number;
  ramTotalGb: number;
  activeProtocols: number;
  securityLevel: 'STRICT' | 'ELEVATED' | 'SIMULATION';
  volumePercent: number;
  brightnessPercent: number;
  gpuTempC: number;
  vramUsedPercent: number;
  ingressMbps: number;
  egressMbps: number;
  fps: number;
  latencyMs: number;
}
