export interface User {
  id: number;
  name: string;
  avatar?: {
    large?: string;
    medium?: string;
  };
}

export interface Media {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    large?: string;
    medium?: string;
    color?: string;
  };
  episodes?: number;
  status: string;
  season?: string;
  seasonYear?: number;
  genres: string[];
  averageScore?: number;
}

export interface MediaListEntry {
  id: number;
  status: string;
  score?: number;
  progress: number;
  progressVolumes?: number;
  repeat: number;
  priority?: number;
  private: boolean;
  notes?: string;
  hiddenFromStatusLists: boolean;
  customLists?: any;
  advancedScores?: any;
  startedAt?: {
    year?: number;
    month?: number;
    day?: number;
  };
  completedAt?: {
    year?: number;
    month?: number;
    day?: number;
  };
  updatedAt?: number;
  createdAt?: number;
  media: Media;
}

export interface AuthData {
  access_token: string;
  token_type: string;
  expires_in: number;
}
