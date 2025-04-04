// composables/useShowsByGenresGrouped.ts
import { ref, onMounted, type Ref } from 'vue'
import axios from 'axios'
import type { TvShow } from './types'

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
      // todo create a configuration file and use it
      const { data } = await axios.get<TvShow[]>('https://api.tvmaze.com/shows')
      const grouped = new Map<string, TvShow[]>()

      data.forEach((show) => {
        show.genres.forEach((genre) => {
          if (!grouped.has(genre)) {
            grouped.set(genre, [])
          }
          grouped.get(genre)!.push(show)
        })
      })

      // sort by rating
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
