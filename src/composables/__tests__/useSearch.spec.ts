import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearch } from '../useSearch'
import { tvMazeApi } from '@services/tvMazeApi'
import { watchDebounced } from '@vueuse/core'

// mock the api layer
vi.mock('@services/tvMazeApi', () => ({
  tvMazeApi: {
    searchShows: vi.fn(),
  },
}))

interface MockedWatchDebounced {
  callback: (query: string) => Promise<void>
}

// mock the watchDebounced function
vi.mock('@vueuse/core', () => ({
  watchDebounced: vi.fn((_, callback) => {
    ;(vi.mocked(watchDebounced) as unknown as MockedWatchDebounced).callback = callback
    return vi.fn()
  }),
}))

describe('useSearch', () => {
  const mockShows = [
    {
      id: 1,
      name: 'Test Show 1',
      genres: ['Drama'],
      rating: { average: 8.5 },
      image: { medium: 'image1.jpg', original: 'image1-original.jpg' },
      summary: 'Test summary 1',
      status: 'Running',
    },
    {
      id: 2,
      name: 'Test Show 2',
      genres: ['Comedy'],
      rating: { average: 9.0 },
      image: { medium: 'image2.jpg', original: 'image2-original.jpg' },
      summary: 'Test summary 2',
      status: 'Running',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty results and query', () => {
    const { query, results, isSearching, error } = useSearch()

    expect(query.value).toBe('')
    expect(results.value).toEqual([])
    expect(isSearching.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should not search if query is empty or too short', async () => {
    const { query, results } = useSearch()
    const debouncedCallback = (vi.mocked(watchDebounced) as unknown as MockedWatchDebounced)
      .callback

    // Test empty query
    query.value = ''
    await debouncedCallback('')
    expect(tvMazeApi.searchShows).not.toHaveBeenCalled()
    expect(results.value).toEqual([])

    // Test query too short
    query.value = 'a'
    await debouncedCallback('a')
    expect(tvMazeApi.searchShows).not.toHaveBeenCalled()
    expect(results.value).toEqual([])
  })

  it('should search shows when query is valid', async () => {
    vi.mocked(tvMazeApi.searchShows).mockResolvedValue(mockShows)

    const { query, results, isSearching, error } = useSearch()
    const debouncedCallback = (vi.mocked(watchDebounced) as unknown as MockedWatchDebounced)
      .callback

    query.value = 'test query'
    await debouncedCallback('test query')

    expect(tvMazeApi.searchShows).toHaveBeenCalledWith('test query')
    expect(results.value).toEqual(mockShows)
    expect(isSearching.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should handle errors during search', async () => {
    vi.mocked(tvMazeApi.searchShows).mockRejectedValue(new Error('API error'))

    const { query, results, isSearching, error } = useSearch()
    const debouncedCallback = (vi.mocked(watchDebounced) as unknown as MockedWatchDebounced)
      .callback

    query.value = 'test query'
    await debouncedCallback('test query')

    expect(tvMazeApi.searchShows).toHaveBeenCalledWith('test query')
    expect(results.value).toEqual([])
    expect(isSearching.value).toBe(false)
    expect(error.value).toBe('Failed to search shows')
  })

  it('should debounce search when query changes', async () => {
    const { query } = useSearch()
    const debouncedCallback = (vi.mocked(watchDebounced) as unknown as MockedWatchDebounced)
      .callback

    query.value = 'test'
    await debouncedCallback('test')
    expect(tvMazeApi.searchShows).toHaveBeenCalledWith('test')
  })
})
