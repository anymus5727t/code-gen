import React, { useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { useStore } from '../store';

export function AppGenerator() {
  const { 
    appDescription, 
    setAppDescription, 
    isLoading,
    setIsLoading,
    setGeneratedCode,
    setError,
    selectedModel,
    apiKey,
    setApiKey
  } = useStore();

  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey);
    }
  }, [apiKey]);

  const handleGenerate = async () => {
    if (!appDescription.trim()) {
      setError('Please provide an app description');
      return;
    }

    if (!apiKey || apiKey.trim() === '') {
      setError('Please enter your OpenRouter API key in the authentication section above');
      return;
    }

    if (!selectedModel) {
      setError('Please select a model before generating the app');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI App Generator'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: `You are an expert web developer. Generate HTML, CSS, and JavaScript code for the requested web application. 
              Provide clean, modern, and well-structured code. Format your response with clearly marked code blocks:
              
              \`\`\`html
              <!-- HTML code here -->
              \`\`\`
              
              \`\`\`css
              /* CSS code here */
              \`\`\`
              
              \`\`\`javascript
              // JavaScript code here
              \`\`\`
              
              Include all necessary code to make the application work.`
            },
            {
              role: 'user',
              content: `Create a complete web application with the following requirements: ${appDescription}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error?.message || 
          `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const generatedContent = data.choices?.[0]?.message?.content || '';
      
      if (!generatedContent) {
        throw new Error('No content received from API');
      }

      const extractCode = (lang: string) => {
        const regex = new RegExp(`\`\`\`${lang}(?:\\n|\\r\\n|\\r)([\\s\\S]*?)(?:\\n|\\r\\n|\\r)\`\`\``, 'm');
        const match = generatedContent.match(regex);
        return match ? match[1].trim() : ''; 
      };

      const html = extractCode("html");
      const css = extractCode("css");
      const js = extractCode("javascript");

      if (!html && !css && !js) {
        throw new Error('Could not extract code from response. The API might have returned an unexpected format.');
      }

      setGeneratedCode({ 
        html: html || '<div>No HTML generated</div>',
        css: css || '/* No CSS generated */',
        js: js || '// No JavaScript generated'
      });
    } catch (err) {
      let errorMessage = 'Failed to generate app. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        if (errorMessage.includes('401')) {
          errorMessage = 'Invalid API key. Please check your OpenRouter API key.';
        } else if (errorMessage.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        }
      }
      
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Wand2 className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Generate Your App</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            App Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your app requirements (e.g., 'Create a todo list app with dark mode support')"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate App'}
        </button>
      </div>
    </div>
  );
}
