import React from 'react';
import { Settings, Image, Monitor, Link, Type as TypeIcon } from 'lucide-react';
import { AspectRatio, ImageSize, GenerationSettings } from '../types';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';

interface ControlPanelProps {
  productName: string;
  setProductName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  settings: GenerationSettings;
  setSettings: (v: GenerationSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  productName,
  setProductName,
  description,
  setDescription,
  url,
  setUrl,
  settings,
  setSettings,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="bg-slate-800 border-r border-slate-700 w-full md:w-80 flex-shrink-0 flex flex-col h-screen overflow-y-auto sticky top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-gradient-to-br from-indigo-500 to-purple-500 text-transparent bg-clip-text">AdGenius</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">AI-Powered Banner Creator</p>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Product Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <TypeIcon size={14} /> Product Info
          </h2>
          
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. NeoRun 5000"
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Product URL</label>
            <div className="relative">
              <Link size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-9 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product and its key benefits..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <hr className="border-slate-700" />

        {/* Configuration */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Settings size={14} /> Configuration
          </h2>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 flex items-center gap-1">
              <Image size={12} /> Base Image Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSettings({ ...settings, imageSize: size })}
                  className={`text-xs py-1.5 rounded border transition-colors ${
                    settings.imageSize === size
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 flex items-center gap-1">
              <Monitor size={12} /> Base Aspect Ratio
            </label>
            <select
              value={settings.aspectRatio}
              onChange={(e) => setSettings({ ...settings, aspectRatio: e.target.value as AspectRatio })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio} value={ratio}>{ratio}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 pt-1">
              This ratio is used for the master generated image. It will be cropped smartly for specific banner sizes.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !description}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            isGenerating || !description
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Creative...
            </>
          ) : (
            'Generate Ads'
          )}
        </button>
      </div>
    </div>
  );
};
