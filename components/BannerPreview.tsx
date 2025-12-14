import React from 'react';
import { AdSize, GeneratedContent } from '../types';

interface BannerPreviewProps {
  size: AdSize;
  content: GeneratedContent | null;
  loading: boolean;
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({ size, content, loading }) => {
  // Styles for the specific banner container
  const containerStyle: React.CSSProperties = {
    width: `${size.width}px`,
    height: `${size.height}px`,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1e293b', // Fallback color
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // If we are waiting for content, show a skeleton
  if (loading || !content) {
    return (
      <div className="flex flex-col gap-2 group">
        <div className="text-xs text-slate-400 font-mono mb-1 flex justify-between">
          <span>{size.label}</span>
          <span>{size.width}x{size.height}</span>
        </div>
        <div 
          style={containerStyle} 
          className="rounded border border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center p-4"
        >
          <div className="animate-pulse flex flex-col items-center w-full gap-2">
             <div className="w-12 h-12 bg-slate-700 rounded-full mb-2"></div>
             <div className="h-4 bg-slate-700 w-3/4 rounded"></div>
             <div className="h-3 bg-slate-700 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic Styles based on generated content
  const { imageUrl, copy } = content;
  
  // Choose layout based on aspect ratio of the banner itself
  const isTall = size.height > size.width * 1.5;
  const isWide = size.width > size.height * 2;
  const isSmall = size.width < 300 || size.height < 100;

  // We use the image as background cover
  const bannerStyle: React.CSSProperties = {
    ...containerStyle,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // Overlay gradient to ensure text readability
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: isTall 
      ? `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)`
      : `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)`,
    display: 'flex',
    flexDirection: isTall ? 'column' : 'row',
    justifyContent: isTall ? 'flex-end' : 'flex-start',
    alignItems: isTall ? 'center' : 'center',
    padding: isSmall ? '12px' : '24px',
    textAlign: isTall ? 'center' : 'left',
  };

  const textContainerStyle: React.CSSProperties = {
    maxWidth: isTall ? '100%' : '60%',
    color: copy.textColor || '#ffffff',
    zIndex: 10,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: copy.primaryColor || '#4f46e5',
    color: '#ffffff',
    border: 'none',
    padding: isSmall ? '6px 12px' : '10px 20px',
    borderRadius: '4px',
    fontSize: isSmall ? '10px' : '12px',
    fontWeight: 'bold',
    marginTop: '12px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="flex flex-col gap-2">
       <div className="text-xs text-slate-400 font-mono mb-1 flex justify-between items-center">
          <span className="font-semibold text-slate-300">{size.label}</span>
          <span className="opacity-75">{size.width}x{size.height}</span>
        </div>
      <div style={bannerStyle} className="rounded-sm shadow-xl border border-slate-700/50 group-hover:border-indigo-500/50 transition-all">
        <div style={overlayStyle}>
          <div style={textContainerStyle}>
            <h3 
              style={{ 
                fontSize: isSmall ? '14px' : '20px', 
                fontWeight: 800, 
                lineHeight: 1.1, 
                marginBottom: '4px',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)' 
              }}
            >
              {copy.headline}
            </h3>
            {!isSmall && (
              <p 
                style={{ 
                  fontSize: '11px', 
                  opacity: 0.9, 
                  lineHeight: 1.4,
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
                }}
              >
                {copy.description}
              </p>
            )}
            <button style={buttonStyle}>{copy.cta}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
