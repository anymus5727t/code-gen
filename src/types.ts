export interface Model {
  id: string;
  name: string;
  description: string;
  pricePerToken: number;
  contextWindow: number;
}

export interface AppState {
  apiKey: string;
  selectedModel: string;
  appDescription: string;
  generatedCode: {
    html: string;
    css: string;
    js: string;
  };
  isLoading: boolean;
  error: string | null;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setAppDescription: (description: string) => void;
  setGeneratedCode: (code: { html: string; css: string; js: string }) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
