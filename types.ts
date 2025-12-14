export interface AdSize {
  name: string;
  width: number;
  height: number;
  label: string;
}

export interface GeneratedCopy {
  headline: string;
  cta: string;
  description: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
}

export interface GeneratedContent {
  imageUrl: string;
  copy: GeneratedCopy;
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

// Augment window for AI Studio helper
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}