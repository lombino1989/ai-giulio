import React, { useState } from 'react';
import { Palette, Image as ImageIcon, Loader2, Download } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!apiKey) {
      setError('Please enter your Stability AI API key');
      return;
    }
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: `Mediterranean landscape painting in vibrant colors, ${prompt}, in the style of traditional Italian countryside art, with detailed brushstrokes, warm lighting, and rich textures`,
              weight: 1
            }
          ],
          cfg_scale: 7,
          steps: 30,
          width: 1024,
          height: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const base64Image = data.artifacts[0].base64;
      setGeneratedImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      setError('Error generating image. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadWebsite = () => {
    if (!generatedImage) return;

    // Create a zip file containing all website files
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mediterranean Artwork Gallery</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to bottom, #EFF6FF, #DBEAFE);
            font-family: system-ui, -apple-system, sans-serif;
            color: #1F2937;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #1F2937;
        }
        .header p {
            color: #4B5563;
            font-size: 1.1rem;
        }
        .artwork {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .artwork img {
            width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .artwork-info {
            text-align: center;
            padding: 1rem;
            background: #F9FAFB;
            border-radius: 0.5rem;
        }
        .artwork-info h2 {
            margin: 0 0 0.5rem 0;
            color: #1F2937;
        }
        .artwork-info p {
            margin: 0;
            color: #6B7280;
        }
        footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Mediterranean AI Artwork</h1>
            <p>Created with Stability AI - Capturing the essence of Mediterranean beauty</p>
        </div>
        
        <div class="artwork">
            <img src="${generatedImage}" alt="Generated Mediterranean landscape">
            <div class="artwork-info">
                <h2>Mediterranean Landscape</h2>
                <p>Generated using advanced AI technology</p>
            </div>
        </div>

        <footer>
            <p>Created with ❤️ using Stability AI</p>
        </footer>
    </div>
</body>
</html>`;

    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mediterranean-artwork.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Palette className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mediterranean AI Art Generator</h1>
          <p className="text-lg text-gray-600">Create beautiful Mediterranean-style landscape paintings using AI</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Stability AI API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your API key"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your scene
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="e.g., coastal village with olive trees, stone houses, and flowering bougainvillea at sunset"
            />
          </div>

          <button
            onClick={generateImage}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2" />
                Generate Painting
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {generatedImage && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Artwork</h2>
              <button
                onClick={downloadWebsite}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors rounded-md hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download as Website
              </button>
            </div>
            <img
              src={generatedImage}
              alt="Generated Mediterranean landscape"
              className="w-full rounded-lg"
            />
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Create stunning Mediterranean landscapes with AI-powered image generation.</p>
          <p>Powered by Stability AI</p>
        </div>
      </div>
    </div>
  );
}

export default App;