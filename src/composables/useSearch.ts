import { ref } from 'vue'
import axios from 'axios'
import type { TvShow } from './types'
import { watchDebounced } from '@vueuse/core'

export function useSearch() {
  const query = ref('')
  const results = ref<TvShow[]>([])
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  const searchShows = async (searchQuery = query.value) => {
    if (!searchQuery.trim()) {
      results.value = []
      return
    }

    isSearching.value = true
    error.value = null

    try {
      const { data } = await axios.get<Array<{ show: TvShow }>>(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`,
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

  // Use watchDebounced to watch query changes with debouncing
  watchDebounced(
    query,
    (newQuery: string) => {
      searchShows(newQuery)
    },
    { debounce: 300 },
  )

  return {
    query,
    results,
    isSearching,
    error,
    searchShows,
  }
}
