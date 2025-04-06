import { ref, onMounted } from 'vue'
import { tvMazeApi } from '@services/tvMazeApi'
import type { TvShow, CastMember } from '@model/tvMaze'

export function useShowDetails(showId: number | string) {
  const show = ref<TvShow | null>(null)
  const cast = ref<CastMember[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchShowDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
      show.value = (await tvMazeApi.getShowById(Number(showId))) as TvShow
      cast.value = (await tvMazeApi.getShowCast(Number(showId))) as CastMember[]
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
