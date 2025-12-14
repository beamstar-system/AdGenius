import { AdSize, AspectRatio, ImageSize } from './types';

export const STANDARD_AD_SIZES: AdSize[] = [
  { name: 'medium_rectangle', width: 300, height: 250, label: 'Medium Rectangle' },
  { name: 'leaderboard', width: 728, height: 90, label: 'Leaderboard' },
  { name: 'wide_skyscraper', width: 160, height: 600, label: 'Wide Skyscraper' },
  { name: 'half_page', width: 300, height: 600, label: 'Half Page' },
  { name: 'large_rectangle', width: 336, height: 280, label: 'Large Rectangle' },
  { name: 'mobile_banner', width: 320, height: 50, label: 'Mobile Banner' },
  { name: 'billboard', width: 970, height: 250, label: 'Billboard' },
];

export const ASPECT_RATIOS: AspectRatio[] = [
  '1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'
];

export const IMAGE_SIZES: ImageSize[] = ['1K', '2K', '4K'];

// Helper to map UI ratios to API supported ratios if necessary
// The API explicitly supports: "1:1", "3:4", "4:3", "9:16", and "16:9"
export const mapAspectRatioToApi = (ratio: AspectRatio): string => {
  switch (ratio) {
    case '2:3': return '3:4'; // Closest approximation
    case '3:2': return '4:3'; // Closest approximation
    case '21:9': return '16:9'; // Closest approximation
    default: return ratio;
  }
};
