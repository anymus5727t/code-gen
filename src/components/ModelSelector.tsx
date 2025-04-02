import React from 'react';
import { useStore } from '../store';
import { Brain } from 'lucide-react';

const models = [
  {
    id: 'undi95/toppy-m-7b:free',
    name: 'Toppy M 7B',
    description: 'Powerful open-source model for general tasks low latency',
    pricePerToken: 0.000000,
    contextWindow: 8192,
    free: true
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2B',
    description: 'Google\'s lightweight, state-of-the-art open models low latency',
    pricePerToken: 0.000000,
    contextWindow: 8192,
    free: true
  },
  {
    id: 'google/gemma-3-12b-it:free',
    name: 'Gemma 3B',
    description: 'Google\'s more capable open model with 12B parameters',
    pricePerToken: 0.000000,
    contextWindow: 8192,
    free: true
  },
];

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useStore();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Select Model</h2>
        </div>
        <span className="text-sm text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full">
          Free Models Available
        </span>
      </div>

      <div className="grid gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedModel === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{model.name}</h3>
                  {model.free && (
                    <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{model.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${model.pricePerToken.toFixed(6)}/token
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {model.contextWindow.toLocaleString()} tokens max
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
