

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

// FIX: Export missing Ratings and UserVotes types.
export interface Ratings {
  [effectId: string]: {
    likes: number;
    dislikes: number;
  };
}

export interface UserVotes {
  [effectId: string]: 'good' | 'bad';
}
