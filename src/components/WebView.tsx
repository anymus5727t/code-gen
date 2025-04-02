import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface WebViewProps {
  initialUrl: string;
  width?: string | number;
  height?: string | number;
  allowZoom?: boolean;
  showNavigation?: boolean;
  cookiePolicy?: 'none' | 'same-origin' | 'all';
}

export function WebView({
  initialUrl,
  width = '100%',
  height = '500px',
  allowZoom = true,
  showNavigation = true,
  cookiePolicy = 'same-origin',
}: WebViewProps) {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [inputUrl, setInputUrl] = useState(initialUrl);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUrl(inputUrl);
    setIsLoading(true);
  };

  const sandboxOptions = [
    'allow-same-origin',
    'allow-scripts',
    'allow-popups',
    'allow-forms',
    ...(allowZoom ? [] : ['allow-pointer-lock']),
  ].join(' ');

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {showNavigation && (
        <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <form onSubmit={handleSubmit} className="flex-1 flex">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter URL"
            />
          </form>
        </div>
      )}

      <div className="relative" style={{ width, height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-4">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-center text-gray-700">
              Failed to load content. Please check the URL and try again.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {!hasError && (
          <iframe
            src={currentUrl}
            onLoad={handleLoad}
            onError={handleError}
            sandbox={sandboxOptions}
            allow={`accelerometer; camera; geolocation; gyroscope; microphone; ${cookiePolicy === 'all' ? 'fullscreen' : ''}`}
            referrerPolicy="strict-origin-when-cross-origin"
            className={`w-full h-full ${isLoading ? 'invisible' : 'visible'}`}
            style={{ border: 'none' }}
          />
        )}
      </div>
    </div>
  );
}
