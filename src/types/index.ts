export type FlowMode = 'sequential' | 'supervisor';

export type AgentType = 'search' | 'code' | 'summarize';

export interface AgentTraceStep {
  agent: AgentType;
  reasoning?: string;
  output: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentTrace?: AgentTraceStep[];
  model?: string;
  flowMode?: FlowMode;
  timestamp: string;
}

export interface RagContext {
  fileName: string;
  extractedText: string;
}

export type GeminiModelId = 
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-lite'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-flash-8b';

export const GEMINI_MODELS: { label: string; id: GeminiModelId }[] = [
  { label: 'Gemini 2.0 Flash ⚡', id: 'gemini-2.0-flash' },
  { label: 'Gemini 2.0 Flash Lite', id: 'gemini-2.0-flash-lite' },
  { label: 'Gemini 1.5 Pro', id: 'gemini-1.5-pro' },
  { label: 'Gemini 1.5 Flash', id: 'gemini-1.5-flash' },
  { label: 'Gemini 1.5 Flash 8B', id: 'gemini-1.5-flash-8b' },
];
