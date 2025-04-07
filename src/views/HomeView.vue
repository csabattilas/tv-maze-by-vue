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

  <div v-else class="mb-10">
    <TopShowsSection :shows="topShows" />

    <div class="genres-container">
      <VirtualGenreList
        v-for="[genre, shows] in genresData"
        :key="genre"
        :title="genre"
        :shows="shows"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VirtualGenreList from '@components/VirtualGenreList.vue'
import TopShowsSection from '@components/TopShowsSection.vue'
import LoadingSpinner from '@components/LoadingSpinner.vue'
import { useShowsData } from '@composables/useShowsData'
import { onMounted } from 'vue'

const { topShows, genresData, loading, error, fetchShows } = useShowsData()

onMounted(fetchShows)
</script>
