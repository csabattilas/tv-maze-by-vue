import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { TvShow } from './types'

interface CastMember {
  person: {
    id: number
    name: string
    image?: {
      medium?: string
      original?: string
    }
  }
  character: {
    id: number
    name: string
  }
}

export function useShowDetails(showId: number | string) {
  const show = ref<TvShow | null>(null)
  const cast = ref<CastMember[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchShowDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { data: showData } = await axios.get<TvShow>(`https://api.tvmaze.com/shows/${showId}`)
      show.value = showData

      const { data: castData } = await axios.get<CastMember[]>(
        `https://api.tvmaze.com/shows/${showId}/cast`,
      )
      cast.value = castData
    } catch (e) {
      error.value = 'Failed to load show details'
      show.value = null
      cast.value = []
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchShowDetails)

  return {
    show,
    cast,
    isLoading,
    error,
    fetchShowDetails,
  }
}
