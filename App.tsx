import React, { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { BannerPreview } from './components/BannerPreview';
import { STANDARD_AD_SIZES } from './constants';
import { GeneratedContent, GenerationSettings } from './types';
import { GeminiService } from './services/gemini';
import { GoogleGenAI } from "@google/genai";
import { AlertTriangle, Key } from 'lucide-react';

export default function App() {
  const [productName, setProductName] = useState('SuperKicks');
  const [description, setDescription] = useState('High-performance running shoes with advanced cushioning technology for marathon runners.');
  const [url, setUrl] = useState('https://example.com/superkicks');
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    imageSize: '1K',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [keyError, setKeyError] = useState(false);

  // Check for API key on mount and retry logic
  const checkApiKey = useCallback(async () => {
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
        if (has) setKeyError(false);
      } else {
        // Fallback for dev env without the specific window object, assume logic handles via process.env if available, 
        // but for this specific "App" environment requirement:
        // If window.aistudio is missing, we might be in local dev.
        // We'll rely on process.env.API_KEY if available.
        if (process.env.API_KEY) {
           setHasKey(true);
        }
      }
    } catch (e) {
      console.error("Error checking API key", e);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
    // Poll for key if not present (helps with race conditions if the helper injects late)
    const interval = setInterval(checkApiKey, 1000);
    return () => clearInterval(interval);
  }, [checkApiKey]);

  const handleConnectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success after interaction
      setHasKey(true);
      setKeyError(false);
    } else {
      alert("API Key selection is not available in this environment.");
    }
  };

  const handleGenerate = async () => {
    if (!hasKey) {
      handleConnectKey();
      return;
    }

    setIsGenerating(true);
    setKeyError(false);

    try {
      // Re-initialize service to grab the latest key from environment
      const gemini = new GeminiService();
      
      // 1. Generate Copy & Prompt
      const brief = await gemini.generateCreativeBrief(productName, description, url);
      
      // 2. Generate Image
      const imageUrl = await gemini.generateAdImage(brief.imagePrompt, settings);
      
      setGeneratedContent({
        imageUrl,
        copy: brief
      });

    } catch (error: any) {
      console.error("Generation failed:", error);
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API_KEY")) {
        setKeyError(true);
        setHasKey(false);
      } else {
        alert("Failed to generate ads. Please try again. " + error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasKey || keyError) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md w-full shadow-2xl">
          <div className="bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
             <Key size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect Google Cloud</h1>
          <p className="text-slate-400 mb-6">
            To generate high-quality ads with Gemini Nano Banana Pro, you need to connect a paid Google Cloud Project API key.
          </p>
          
          {keyError && (
             <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-6 flex items-center gap-3 text-left">
                <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                <p className="text-xs text-red-200">
                  The selected key was invalid or not found. Please select a valid key associated with a billing-enabled project.
                </p>
             </div>
          )}

          <button
            onClick={handleConnectKey}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Select API Key
          </button>
           <p className="mt-4 text-[10px] text-slate-500">
            View billing documentation at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">ai.google.dev/gemini-api/docs/billing</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar Controls */}
      <ControlPanel 
        productName={productName}
        setProductName={setProductName}
        description={description}
        setDescription={setDescription}
        url={url}
        setUrl={setUrl}
        settings={settings}
        setSettings={setSettings}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950 relative">
        <div className="p-8 max-w-[1600px] mx-auto">
          {/* Header Area in Main View */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Generated Campaigns</h2>
              <p className="text-slate-400 text-sm">
                Previewing across {STANDARD_AD_SIZES.length} standard IAB formats.
              </p>
            </div>
            
            {generatedContent && (
               <div className="flex gap-2">
                 <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
                    Aspect Ratio: {settings.aspectRatio}
                 </span>
                 <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
                    Quality: {settings.imageSize}
                 </span>
               </div>
            )}
          </div>

          {/* Grid of Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
             {STANDARD_AD_SIZES.map((size) => (
               <div key={size.name} className="flex flex-col items-center">
                 <BannerPreview 
                    size={size} 
                    content={generatedContent} 
                    loading={isGenerating} 
                 />
               </div>
             ))}
          </div>
          
          {/* Empty State / Welcome */}
          {!generatedContent && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center opacity-10">
                <span className="text-9xl font-bold block">ADS</span>
                <span className="text-2xl font-light tracking-[1em]">GENERATOR</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
