import { ref } from 'vue'
import axios from 'axios'
import type { TvShow } from './types'

export function useSearch() {
  const query = ref('')
  const results = ref<TvShow[]>([])
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  const searchShows = async () => {
    if (!query.value.trim()) {
      results.value = []
      return
    }

    isSearching.value = true
    error.value = null

    try {
      const { data } = await axios.get<Array<{ show: TvShow }>>(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query.value)}`,
      )

      // The API returns an array of objects with a show property
      results.value = data.map((item) => item.show)
    } catch (e) {
      error.value = 'Failed to search shows'
      results.value = []
    } finally {
      isSearching.value = false
    }
  }

  return {
    query,
    results,
    isSearching,
    error,
    searchShows,
  }
}
