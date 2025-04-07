import axios from 'axios'
import type { TvShow, CastMember } from '../model/tvMaze'

const API_BASE_URL = 'https://api.tvmaze.com'

interface Cache {
  shows: Map<string, TvShow[]>
  showDetails: Map<number, TvShow>
  showCast: Map<number, CastMember[]>
  timestamp: Map<string, number>
}

const CACHE_EXPIRATION = 30 * 60 * 1000

// simple memory cache to avoid unnecessary api calls
const cache: Cache = {
  shows: new Map(),
  showDetails: new Map(),
  showCast: new Map(),
  timestamp: new Map(),
}

const isCacheValid = (key: string): boolean => {
  const timestamp = cache.timestamp.get(key)
  if (!timestamp) return false
  return Date.now() - timestamp < CACHE_EXPIRATION
}

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
    const cacheKey = `show_${id}`

    if (cache.showDetails.has(id) && isCacheValid(cacheKey)) {
      console.log(`Using cached data for show ${id}`)
      return cache.showDetails.get(id)!
    }

    try {
      const { data } = await axios.get<TvShow>(`${API_BASE_URL}/shows/${id}`)

      cache.showDetails.set(id, data)
      cache.timestamp.set(cacheKey, Date.now())

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
    const cacheKey = `cast_${id}`

    if (cache.showCast.has(id) && isCacheValid(cacheKey)) {
      console.log(`Using cached data for cast of show ${id}`)
      return cache.showCast.get(id)!
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/shows/${id}/cast`)

      cache.showCast.set(id, data)
      cache.timestamp.set(cacheKey, Date.now())

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
    const cacheKey = 'all_shows'

    if (cache.shows.has(cacheKey) && isCacheValid(cacheKey)) {
      console.log('Using cached data for all shows')
      return cache.shows.get(cacheKey)!
    }

    try {
      const { data } = await axios.get<TvShow[]>(`${API_BASE_URL}/shows`)

      cache.shows.set(cacheKey, data)
      cache.timestamp.set(cacheKey, Date.now())

      return data
    } catch (error) {
      console.error(`Error fetching shows:`, error)
      throw new Error('Failed to load shows')
    }
  },

  // not used as on refresh the cache will reinitialise, but left for future use
  clearCache: (): void => {
    cache.shows.clear()
    cache.showDetails.clear()
    cache.showCast.clear()
    cache.timestamp.clear()
    console.log('Cache cleared')
  },
}
