import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useShowDetails } from '../useShowDetails'
import { tvMazeApi } from '@services/tvMazeApi'

// mock the api layer
vi.mock('@services/tvMazeApi', () => ({
  tvMazeApi: {
    getShowById: vi.fn(),
    getShowCast: vi.fn(),
  },
}))

describe('useShowDetails', () => {
  const mockShow = {
    id: 1,
    name: 'Test Show',
    genres: ['Drama', 'Comedy'],
    rating: { average: 8.5 },
    image: { medium: 'medium-image.jpg', original: 'original-image.jpg' },
    summary: 'Test summary',
    status: 'Running',
  }

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
  })

  it('should initialize with empty show and cast', () => {
    const { show, cast, isLoading, error } = useShowDetails()

    expect(show.value).toBeNull()
    expect(cast.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should fetch show details and cast successfully', async () => {
    vi.mocked(tvMazeApi.getShowById).mockResolvedValue(mockShow)
    vi.mocked(tvMazeApi.getShowCast).mockResolvedValue(mockCast)

    const { show, cast, isLoading, error, fetchShowDetails } = useShowDetails()

    expect(isLoading.value).toBe(false)

    const fetchPromise = fetchShowDetails('1')
    expect(isLoading.value).toBe(true)

    await fetchPromise

    expect(tvMazeApi.getShowById).toHaveBeenCalledWith('1')
    expect(tvMazeApi.getShowCast).toHaveBeenCalledWith('1')

    expect(show.value).toEqual(mockShow)
    expect(cast.value).toEqual(mockCast)
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should handle errors when fetching show details', async () => {
    vi.mocked(tvMazeApi.getShowById).mockRejectedValue(new Error('API error'))

    const { show, cast, isLoading, error, fetchShowDetails } = useShowDetails()

    await fetchShowDetails('1')

    expect(tvMazeApi.getShowById).toHaveBeenCalledWith('1')
    expect(show.value).toBeNull()
    expect(cast.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBe('Failed to load show details')
  })

  it('should handle errors when fetching show cast', async () => {
    vi.mocked(tvMazeApi.getShowById).mockResolvedValue(mockShow)
    vi.mocked(tvMazeApi.getShowCast).mockRejectedValue(new Error('API error'))

    const { show, cast, isLoading, error, fetchShowDetails } = useShowDetails()

    await fetchShowDetails('1')

    expect(tvMazeApi.getShowById).toHaveBeenCalledWith('1')
    expect(tvMazeApi.getShowCast).toHaveBeenCalledWith('1')
    expect(show.value).toBeNull()
    expect(cast.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBe('Failed to load show details')
  })
})
