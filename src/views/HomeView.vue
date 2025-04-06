<template>
  <div v-if="loading" class="text-center py-10 text-lg">
    <div class="flex justify-center items-center gap-2 mb-2">
      <span> Loading shows please wait...</span>
      <LoadingSpinner />
    </div>
  </div>

  <div v-else-if="error" class="text-center py-10 text-lg">
    {{ error }}
  </div>

  <div v-else class="mb-10 text-primary-700 dark:text-primary-300">
    <TopShowsSection :shows="topShows" />
    <GenreSection v-for="[genre, shows] in genres" :key="genre" :title="genre" :shows="shows" />
  </div>
</template>

<script setup lang="ts">
import GenreSection from '@components/GenreSection.vue'
import TopShowsSection from '@components/TopShowsSection.vue'
import LoadingSpinner from '@components/LoadingSpinner.vue'
import { useShowsByGenres } from '@composables/useShowsByGenres'
import { computed } from 'vue'
import type { TvShow } from '@composables/types'

const { genreMap, loading, error } = useShowsByGenres()

const genres = computed(() => [...genreMap.value.entries()])

const topShows = computed(() => {
  const allShows: TvShow[] = []
  genreMap.value.forEach((shows) => {
    allShows.push(...shows)
  })

  const uniqueShows = Array.from(new Map(allShows.map((show) => [show.id, show])).values())

  return uniqueShows
    .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
    .slice(0, 10)
})
</script>
