// TV Show type definitions
export interface TvShow {
  id: number;
  name: string;
  genres: string[];
  rating: {
    average: number | null;
  };
  image?: {
    medium: string;
    original: string;
  };
  summary: string;
  premiered?: string;
  ended?: string;
  status: string;
  network?: {
    name: string;
  };
  schedule?: {
    time: string;
    days: string[];
  };
  officialSite?: string;
  url?: string;
}
