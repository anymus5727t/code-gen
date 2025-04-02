import { create } from 'zustand';

interface GeneratedCode {
  html: string;
  css: string;
  js: string;
}

interface AppState {
  apiKey: string;
  selectedModel: string;
  appDescription: string;
  generatedCode: GeneratedCode;
  isLoading: boolean;
  error: string | null;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setAppDescription: (description: string) => void;
  setGeneratedCode: (code: GeneratedCode) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  apiKey: '',
  selectedModel: 'gpt-4',
  appDescription: '',
  generatedCode: {
    html: '',
    css: '',
    js: '',
  },
  isLoading: false,
  error: null,
  setApiKey: (key) => set({ apiKey: key }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setAppDescription: (description) => set({ appDescription: description }),
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
}));
