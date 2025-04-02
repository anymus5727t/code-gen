import React from 'react';
import { useStore } from './store';
import { Auth } from './components/Auth';
import { ModelSelector } from './components/ModelSelector';
import { AppGenerator } from './components/AppGenerator';
import { CodeViewer } from './components/CodeViewer';

function App() {
  const { apiKey, error } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI App Generator</h1>
          <p className="text-lg text-gray-600">Transform your ideas into working applications</p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {!apiKey ? (
            <Auth />
          ) : (
            <>
              <ModelSelector />
              <AppGenerator />
              <CodeViewer />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
