
export interface Effect {
  id: string;
  prompt: string;
  imageCount: 1 | 2;
  imageLabels: string[];
  title: string;
  description: string;
  likes?: number;
  dislikes?: number;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export type SortOption = 'popular' | 'alphabetical' | 'newest';

export interface Ratings {
  [effectId: string]: {
    likes: number;
    dislikes: number;
  };
}
