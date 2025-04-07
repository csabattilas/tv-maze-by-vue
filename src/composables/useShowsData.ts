import { ref, computed } from 'vue'
import type { TvShow } from '@model/tvMaze'
import { tvMazeApi } from '@services/tvMazeApi'

export function useShowsData(topShowsLimit = 10) {
  const shows = ref<TvShow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchShows = async () => {
    loading.value = true
    error.value = null

    try {
      shows.value = await tvMazeApi.getShows()
    } catch (e) {
      error.value = 'Failed to load shows'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // shows by genre
  const showsByGenre = computed(() => {
    const grouped = new Map<string, TvShow[]>()
    shows.value.forEach((show) => {
      if (show.genres && show.genres.length > 0) {
        show.genres.forEach((genre) => {
          if (!grouped.has(genre)) {
            grouped.set(genre, [])
          }
          grouped.get(genre)?.push(show)
        })
      }
    })

    grouped.forEach((shows) => {
      shows.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
    })

    return grouped
  })

  // top shows
  const topShows = computed(() => {
    const uniqueShows = Array.from(new Map(shows.value.map((show) => [show.id, show])).values())

    return uniqueShows
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, topShowsLimit)
  })

  const genresData = computed(() => [...showsByGenre.value.entries()])

  return {
    topShows,
    genresData,
    loading,
    error,
    fetchShows,
  } as const
}
