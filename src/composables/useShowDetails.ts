import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { TvShow } from './types'

export function useShowDetails(showId: number | string) {
  const show = ref<TvShow | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchShowDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await axios.get<TvShow>(
        `https://api.tvmaze.com/shows/${showId}`
      )
      show.value = data
    } catch (e) {
      error.value = 'Failed to load show details'
      show.value = null
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchShowDetails)

  return {
    show,
    isLoading,
    error,
    fetchShowDetails
  }
}
