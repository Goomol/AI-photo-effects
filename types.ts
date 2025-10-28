
export interface Effect {
  id: string;
  prompt: string;
  imageCount: 1 | 2;
  imageLabels: string[];
  title: string;
  description: string;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export type SortOption = 'alphabetical' | 'newest';
