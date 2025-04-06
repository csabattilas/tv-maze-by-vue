import { ref, onMounted, type Ref } from 'vue'
import type { TvShow } from '@model/tvMaze'
import { tvMazeApi } from '@services/tvMazeApi'

export function useShowsByGenres(): {
  genreMap: Ref<Map<string, TvShow[]>>
  loading: Ref<boolean>
  error: Ref<string | null>
} {
  const genreMap = ref(new Map<string, TvShow[]>())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchShows = async () => {
    loading.value = true
    try {
      const data = await tvMazeApi.getShows()
      const grouped = new Map<string, TvShow[]>()

      data.forEach((show) => {
        show.genres.forEach((genre) => {
          if (!grouped.has(genre)) {
            grouped.set(genre, [])
          }
          grouped.get(genre)!.push(show)
        })
      })

      grouped.forEach((shows) => {
        shows.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      })

      genreMap.value = grouped
    } catch (e) {
      error.value = 'Failed to load shows'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchShows)

  return {
    genreMap,
    loading,
    error,
  }
}
