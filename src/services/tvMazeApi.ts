import axios from 'axios'
import type { TvShow, CastMember } from '../model/tvMaze'

const API_BASE_URL = 'https://api.tvmaze.com'

/**
 * TVMaze API service functions
 */
export const tvMazeApi = {
  /**
   * Search for shows by name
   * @param query - Search query
   */
  searchShows: async (query: string): Promise<TvShow[]> => {
    try {
      const { data } = await axios.get<Array<{ show: TvShow }>>(
        `${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
      )
      return data.map((item) => item.show)
    } catch (error) {
      console.error('Error searching shows:', error)
      throw new Error('Failed to search shows')
    }
  },

  /**
   * Get show details by ID
   * @param id - Show ID
   */
  getShowById: async (id: number): Promise<TvShow> => {
    try {
      const { data } = await axios.get<TvShow>(`${API_BASE_URL}/shows/${id}`)
      return data
    } catch (error) {
      console.error(`Error fetching show ${id}:`, error)
      throw new Error('Failed to load show details')
    }
  },

  /**
   * Get cast for a show by ID
   * @param id - Show ID
   */
  getShowCast: async (id: number): Promise<CastMember[]> => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/shows/${id}/cast`)
      return data
    } catch (error) {
      console.error(`Error fetching cast for show ${id}:`, error)
      throw new Error('Failed to load cast details')
    }
  },

  /**
   * Get shows
   */
  getShows: async (): Promise<TvShow[]> => {
    try {
      const { data } = await axios.get<TvShow[]>(`${API_BASE_URL}/shows`)
      return data
    } catch (error) {
      console.error(`Error fetching shows:`, error)
      throw new Error('Failed to load shows')
    }
  },
}
