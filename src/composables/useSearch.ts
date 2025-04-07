import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { tvMazeApi } from '@services/tvMazeApi'
import type { TvShow } from '@model/tvMaze'

export function useSearch() {
  const query = ref('')
  const results = ref<TvShow[]>([])
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  const searchShows = async (searchQuery = query.value) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      results.value = []
      return
    }

    isSearching.value = true
    error.value = null

    try {
      results.value = (await tvMazeApi.searchShows(searchQuery)) as TvShow[]
    } catch (e) {
      error.value = 'Failed to search shows'
      results.value = []
    } finally {
      isSearching.value = false
    }
  }

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
  }
}
