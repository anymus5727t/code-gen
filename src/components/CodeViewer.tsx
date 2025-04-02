import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { WebView } from './WebView';
import { Copy, Check } from 'lucide-react';

export function CodeViewer() {
  const { generatedCode } = useStore();
  const [copied, setCopied] = useState({
    html: false,
    css: false,
    js: false
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (generatedCode.html || generatedCode.css || generatedCode.js) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${generatedCode.css}</style>
            <base target="_blank">
          </head>
          <body>
            ${generatedCode.html}
            <script>
              // Prevent parent frame navigation
              document.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && e.target.href) {
                  e.preventDefault();
                  window.open(e.target.href, '_blank');
                }
              });
              
              // Handle form submissions within the preview
              document.addEventListener('submit', function(e) {
                if (e.target.tagName === 'FORM') {
                  e.preventDefault();
                  alert('Form submission would go here in a real implementation');
                }
              });
              
              ${generatedCode.js}
            </script>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [generatedCode]);

  const copyToClipboard = (code: string, type: 'html' | 'css' | 'js') => {
    navigator.clipboard.writeText(code);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Interactive Preview</h2>
      <div className="border rounded-lg overflow-hidden">
        {previewUrl ? (
          <WebView 
            initialUrl={previewUrl}
            height="600px"
            showNavigation={false}
            cookiePolicy="none"
            allowZoom={true}
          />
        ) : (
          <div className="h-[600px] flex items-center justify-center bg-gray-50 text-gray-500">
            Generate code to see preview
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Generated Code</h2>
        
        <div className="space-y-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b">
              <span className="font-medium">HTML</span>
              <button 
                onClick={() => copyToClipboard(generatedCode.html, 'html')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                disabled={!generatedCode.html}
              >
                {copied.html ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-white overflow-auto text-sm">
              <code>{generatedCode.html || 'No HTML generated yet'}</code>
            </pre>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b">
              <span className="font-medium">CSS</span>
              <button 
                onClick={() => copyToClipboard(generatedCode.css, 'css')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                disabled={!generatedCode.css}
              >
                {copied.css ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-white overflow-auto text-sm">
              <code>{generatedCode.css || 'No CSS generated yet'}</code>
            </pre>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b">
              <span className="font-medium">JavaScript</span>
              <button 
                onClick={() => copyToClipboard(generatedCode.js, 'js')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                disabled={!generatedCode.js}
              >
                {copied.js ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-white overflow-auto text-sm">
              <code>{generatedCode.js || 'No JavaScript generated yet'}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
