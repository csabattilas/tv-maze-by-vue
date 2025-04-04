/**
 * TVMaze API Service
 * Documentation: http://www.tvmaze.com/api
 */

// Base URL for the TVMaze API
const API_BASE_URL = 'https://api.tvmaze.com';

/**
 * Interface for TV Show data
 */
export interface Show {
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
}

/**
 * TVMaze API service functions
 */
export const tvMazeApi = {
  /**
   * Search for shows by name
   * @param query - Search query
   */
  searchShows: async (query: string): Promise<Show[]> => {
    // This will be implemented later
    return [];
  },

  /**
   * Get show details by ID
   * @param id - Show ID
   */
  getShowById: async (id: number): Promise<Show | null> => {
    // This will be implemented later
    return null;
  },

  /**
   * Get shows by page (for browsing)
   * @param page - Page number
   */
  getShowsByPage: async (page: number): Promise<Show[]> => {
    // This will be implemented later
    return [];
  }
};
