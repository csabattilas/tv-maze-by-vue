import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useShowsData } from '../useShowsData'
import { tvMazeApi } from '@services/tvMazeApi'

// mock the api layer
vi.mock('@services/tvMazeApi', () => ({
  tvMazeApi: {
    getShows: vi.fn(),
  },
}))

describe('useShowsData', () => {
  const mockShows = [
    {
      id: 1,
      name: 'Show 1',
      genres: ['Drama', 'Thriller'],
      rating: { average: 8.5 },
      image: { medium: 'image1.jpg', original: 'image1-original.jpg' },
      summary: 'Summary 1',
      status: 'Running',
    },
    {
      id: 2,
      name: 'Show 2',
      genres: ['Comedy'],
      rating: { average: 9.0 },
      image: { medium: 'image2.jpg', original: 'image2-original.jpg' },
      summary: 'Summary 2',
      status: 'Running',
    },
    {
      id: 3,
      name: 'Show 3',
      genres: ['Drama', 'Action'],
      rating: { average: 7.5 },
      image: { medium: 'image3.jpg', original: 'image3-original.jpg' },
      summary: 'Summary 3',
      status: 'Ended',
    },
    {
      id: 4,
      name: 'Show 4',
      genres: ['Action', 'Adventure'],
      rating: { average: 8.0 },
      image: { medium: 'image4.jpg', original: 'image4-original.jpg' },
      summary: 'Summary 4',
      status: 'Running',
    },
    {
      id: 5,
      name: 'Show 5',
      genres: ['Comedy', 'Romance'],
      rating: { average: 6.5 },
      image: { medium: 'image5.jpg', original: 'image5-original.jpg' },
      summary: 'Summary 5',
      status: 'Ended',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty data', () => {
    const { topShows, genresData, loading, error } = useShowsData()

    expect(topShows.value).toEqual([])
    expect(genresData.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should fetch shows successfully', async () => {
    vi.mocked(tvMazeApi.getShows).mockResolvedValue(mockShows)

    const { loading, error, fetchShows } = useShowsData()

    expect(loading.value).toBe(false)

    const fetchPromise = fetchShows()

    expect(loading.value).toBe(true)

    await fetchPromise

    expect(tvMazeApi.getShows).toHaveBeenCalled()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should handle errors when fetching shows', async () => {
    vi.mocked(tvMazeApi.getShows).mockRejectedValue(new Error('API error'))

    const { loading, error, fetchShows } = useShowsData()

    await fetchShows()

    expect(tvMazeApi.getShows).toHaveBeenCalled()
    expect(loading.value).toBe(false)
    expect(error.value).toBe('Failed to load shows')
  })

  it('should compute topShows correctly with default limit', async () => {
    vi.mocked(tvMazeApi.getShows).mockResolvedValue(mockShows)

    const { topShows, fetchShows } = useShowsData()

    await fetchShows()

    expect(topShows.value.length).toBe(5)

    expect(topShows.value[0].id).toBe(2)
    expect(topShows.value[1].id).toBe(1)
    expect(topShows.value[2].id).toBe(4)
    expect(topShows.value[3].id).toBe(3)
    expect(topShows.value[4].id).toBe(5)
  })

  it('should compute topShows correctly with custom limit', async () => {
    vi.mocked(tvMazeApi.getShows).mockResolvedValue(mockShows)

    const { topShows, fetchShows } = useShowsData(3)

    await fetchShows()

    expect(topShows.value.length).toBe(3)
    expect(topShows.value[0].id).toBe(2)
    expect(topShows.value[1].id).toBe(1)
    expect(topShows.value[2].id).toBe(4)
  })

  it('should group shows by genre correctly', async () => {
    vi.mocked(tvMazeApi.getShows).mockResolvedValue(mockShows)

    const { genresData, fetchShows } = useShowsData()

    await fetchShows()

    const genresArray = genresData.value

    expect(genresArray.length).toBe(6)

    const genres = genresArray.map(([genre]) => genre)
    expect(genres).toContain('Drama')
    expect(genres).toContain('Comedy')
    expect(genres).toContain('Action')
    expect(genres).toContain('Thriller')
    expect(genres).toContain('Adventure')
    expect(genres).toContain('Romance')

    const dramaGenre = genresArray.find(([genre]) => genre === 'Drama')
    if (dramaGenre) {
      const dramaShows = dramaGenre[1]
      expect(dramaShows.length).toBe(2)

      expect(dramaShows[0].id).toBe(1)
      expect(dramaShows[1].id).toBe(3)
    } else {
      expect(dramaGenre).toBeDefined()
    }

    const comedyGenre = genresArray.find(([genre]) => genre === 'Comedy')
    if (comedyGenre) {
      const comedyShows = comedyGenre[1]
      expect(comedyShows.length).toBe(2)

      expect(comedyShows[0].id).toBe(2)
      expect(comedyShows[1].id).toBe(5)
    } else {
      expect(comedyGenre).toBeDefined()
    }
  })

  it('should handle shows with null ratings correctly', async () => {
    const showsWithNullRatings = [
      ...mockShows,
      {
        id: 6,
        name: 'Show 6',
        genres: ['Drama'],
        rating: { average: null },
        image: { medium: 'image6.jpg', original: 'image6-original.jpg' },
        summary: 'Summary 6',
        status: 'Running',
      },
    ]

    vi.mocked(tvMazeApi.getShows).mockResolvedValue(showsWithNullRatings)

    const { topShows, fetchShows } = useShowsData()

    await fetchShows()

    const lastShow = topShows.value[topShows.value.length - 1]
    expect(lastShow.id).toBe(6)
    expect(lastShow.rating.average).toBeNull()
  })
})
