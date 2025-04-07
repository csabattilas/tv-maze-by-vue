import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { tvMazeApi } from '../tvMazeApi'

vi.mock('axios')

describe('tvMazeApi', () => {
  const API_BASE_URL = 'https://api.tvmaze.com'

  const mockShow = {
    id: 1,
    name: 'Test Show',
    genres: ['Drama', 'Comedy'],
    rating: { average: 8.5 },
    image: { medium: 'medium-image.jpg', original: 'original-image.jpg' },
    summary: 'Test summary',
    status: 'Running',
  }

  const mockShows = [
    mockShow,
    {
      id: 2,
      name: 'Another Show',
      genres: ['Action'],
      rating: { average: 9.0 },
      image: { medium: 'medium-image2.jpg', original: 'original-image2.jpg' },
      summary: 'Another test summary',
      status: 'Ended',
    },
  ]

  const mockSearchResults = [
    { show: mockShow },
    {
      show: {
        id: 3,
        name: 'Third Show',
        genres: ['Sci-Fi'],
        rating: { average: 7.5 },
        image: { medium: 'medium-image3.jpg', original: 'original-image3.jpg' },
        summary: 'Third test summary',
        status: 'Running',
      },
    },
  ]

  const mockCast = [
    {
      person: {
        id: 101,
        name: 'Actor 1',
        image: { medium: 'actor1.jpg', original: 'actor1-original.jpg' },
      },
      character: {
        id: 201,
        name: 'Character 1',
      },
    },
    {
      person: {
        id: 102,
        name: 'Actor 2',
        image: { medium: 'actor2.jpg', original: 'actor2-original.jpg' },
      },
      character: {
        id: 202,
        name: 'Character 2',
      },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    tvMazeApi.clearCache()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('searchShows', () => {
    it('should fetch search results from the API', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockSearchResults })

      const results = await tvMazeApi.searchShows('test')

      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/search/shows?q=test`)
      expect(results).toEqual([mockShow, mockSearchResults[1].show])
      expect(results.length).toBe(2)
    })

    it('should handle empty search results', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: [] })

      const results = await tvMazeApi.searchShows('nonexistent')

      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/search/shows?q=nonexistent`)
      expect(results).toEqual([])
    })

    it('should handle API errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      await expect(tvMazeApi.searchShows('test')).rejects.toThrow('Failed to search shows')
    })

    it('should use cached results when available', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockSearchResults })
      await tvMazeApi.searchShows('test')

      vi.mocked(axios.get).mockClear()

      const results = await tvMazeApi.searchShows('test')

      expect(axios.get).not.toHaveBeenCalled()
      expect(results).toEqual([mockShow, mockSearchResults[1].show])
    })

    it('should normalize search query for caching', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockSearchResults })
      await tvMazeApi.searchShows('test')

      vi.mocked(axios.get).mockClear()

      const results = await tvMazeApi.searchShows('  TEST  ')

      expect(axios.get).not.toHaveBeenCalled()
      expect(results).toEqual([mockShow, mockSearchResults[1].show])
    })
  })

  describe('getShowById', () => {
    it('should fetch show details from the API', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShow })

      const show = await tvMazeApi.getShowById('1')

      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/shows/1`)
      expect(show).toEqual(mockShow)
    })
    it('should handle API errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      await expect(tvMazeApi.getShowById('1')).rejects.toThrow('Failed to fetch show details')
    })

    it('should use cached results when available', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShow })
      await tvMazeApi.getShowById('1')

      vi.mocked(axios.get).mockClear()

      const show = await tvMazeApi.getShowById('1')

      expect(axios.get).not.toHaveBeenCalled()
      expect(show).toEqual(mockShow)
    })
  })

  describe('getShowCast', () => {
    it('should fetch show cast from the API', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCast })

      const cast = await tvMazeApi.getShowCast('1')

      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/shows/1/cast`)
      expect(cast).toEqual(mockCast)
    })

    it('should handle API errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      await expect(tvMazeApi.getShowCast('1')).rejects.toThrow('Failed to fetch show cast')
    })

    it('should use cached results when available', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCast })
      await tvMazeApi.getShowCast('1')

      vi.mocked(axios.get).mockClear()

      const cast = await tvMazeApi.getShowCast('1')

      expect(axios.get).not.toHaveBeenCalled()
      expect(cast).toEqual(mockCast)
    })
  })

  describe('getShows', () => {
    it('should fetch all shows from the API', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShows })

      const shows = await tvMazeApi.getShows()

      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/shows`)
      expect(shows).toEqual(mockShows)
    })

    it('should handle API errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      await expect(tvMazeApi.getShows()).rejects.toThrow('Failed to fetch shows')
    })

    it('should use cached results when available', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShows })
      await tvMazeApi.getShows()

      vi.mocked(axios.get).mockClear()

      const shows = await tvMazeApi.getShows()

      expect(axios.get).not.toHaveBeenCalled()
      expect(shows).toEqual(mockShows)
    })
  })

  describe('clearCache', () => {
    it('should clear all cached data', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockSearchResults })
      await tvMazeApi.searchShows('test')

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShow })
      await tvMazeApi.getShowById('1')

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCast })
      await tvMazeApi.getShowCast('1')

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShows })
      await tvMazeApi.getShows()

      vi.clearAllMocks()

      tvMazeApi.clearCache()

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockSearchResults })
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShow })
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCast })
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShows })

      await tvMazeApi.searchShows('test')
      await tvMazeApi.getShowById('1')
      await tvMazeApi.getShowCast('1')
      await tvMazeApi.getShows()

      expect(axios.get).toHaveBeenCalledTimes(4)
    })
  })

  describe('cache expiration', () => {
    it('should refresh data when cache expires', async () => {
      const originalNow = Date.now

      try {
        const initialTime = 1000
        vi.spyOn(Date, 'now').mockImplementation(() => initialTime)

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockShow })
        await tvMazeApi.getShowById('1')

        vi.mocked(axios.get).mockClear()

        const cachedShow = await tvMazeApi.getShowById('1')
        expect(axios.get).not.toHaveBeenCalled()
        expect(cachedShow).toEqual(mockShow)

        vi.mocked(Date.now).mockImplementation(() => initialTime + 1800001)

        vi.mocked(axios.get).mockResolvedValueOnce({ data: { ...mockShow, name: 'Updated Show' } })

        const refreshedShow = await tvMazeApi.getShowById('1')

        expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/shows/1`)
        expect(refreshedShow.name).toBe('Updated Show')
      } finally {
        vi.mocked(Date.now).mockImplementation(originalNow)
      }
    })
  })
})
