import axios from 'axios'
import type { TvShow, CastMember } from '@model/tvMaze'

const API_BASE_URL = 'https://api.tvmaze.com'
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes

interface CachedItem<T> {
  data: T
  timestamp: number
}

interface Cache {
  shows: Map<string, CachedItem<TvShow[]>>
  showDetails: Map<string, CachedItem<TvShow>>
  showCast: Map<string, CachedItem<CastMember[]>>
  searchResults: Map<string, CachedItem<TvShow[]>>
}

// simple memory cache to avoid unnecessary api calls
const cache: Cache = {
  shows: new Map(),
  showDetails: new Map(),
  showCast: new Map(),
  searchResults: new Map(),
}

const isCacheValid = <T>(cachedItem: CachedItem<T>): boolean => {
  return Date.now() - cachedItem.timestamp < CACHE_EXPIRATION
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
    const cacheKey = query.toLowerCase().trim()

    const cachedItem = cache.searchResults.get(cacheKey)
    if (cachedItem && isCacheValid(cachedItem)) {
      return cachedItem.data
    }

    try {
      const { data } = await axios.get<Array<{ show: TvShow }>>(
        `${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
      )
      const results = data.map((item) => item.show)

      cache.searchResults.set(cacheKey, {
        data: results,
        timestamp: Date.now(),
      })

      return results
    } catch (error) {
      console.error('Error searching shows:', error)
      throw new Error('Failed to search shows')
    }
  },

  /**
   * Get show details by ID
   * @param id - Show ID
   */
  getShowById: async (id: string): Promise<TvShow> => {
    const cachedItem = cache.showDetails.get(id)
    if (cachedItem && isCacheValid(cachedItem)) {
      return cachedItem.data
    }

    try {
      const { data } = await axios.get<TvShow>(`${API_BASE_URL}/shows/${id}`)

      cache.showDetails.set(id, {
        data,
        timestamp: Date.now(),
      })

      return data
    } catch (error) {
      console.error(`Error fetching show ${id}:`, error)
      throw new Error('Failed to fetch show details')
    }
  },

  /**
   * Get cast for a show by ID
   * @param id - Show ID
   */
  getShowCast: async (id: string): Promise<CastMember[]> => {
    const cachedItem = cache.showCast.get(id)

    if (cachedItem && isCacheValid(cachedItem)) {
      return cachedItem.data
    }

    try {
      const { data } = await axios.get<CastMember[]>(`${API_BASE_URL}/shows/${id}/cast`)

      cache.showCast.set(id, {
        data,
        timestamp: Date.now(),
      })

      return data
    } catch (error) {
      console.error(`Error fetching cast for show ${id}:`, error)
      throw new Error('Failed to fetch show cast')
    }
  },

  /**
   * Get all shows
   */
  getShows: async (): Promise<TvShow[]> => {
    const cacheKey = 'all_shows'
    const cachedItem = cache.shows.get(cacheKey)

    if (cachedItem && isCacheValid(cachedItem)) {
      return cachedItem.data
    }

    try {
      const { data } = await axios.get<TvShow[]>(`${API_BASE_URL}/shows`)

      cache.shows.set(cacheKey, {
        data,
        timestamp: Date.now(),
      })

      return data
    } catch (error) {
      console.error('Error fetching shows:', error)
      throw new Error('Failed to fetch shows')
    }
  },

  /**
   * Clear all cached data
   */
  clearCache: () => {
    cache.shows.clear()
    cache.showDetails.clear()
    cache.showCast.clear()
    cache.searchResults.clear()
  },
}
