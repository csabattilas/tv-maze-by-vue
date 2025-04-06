<script setup lang="ts">
import { useSearch } from '@composables/useSearch'
import ShowCard from '@components/ShowCard.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const { query, results, isSearching, error } = useSearch()
</script>

<template>
  <header class="flex items-center mb-4 gap-2">
    <div>
      <router-link to="/" class="transition-colors" title="Back to Dashboard">
        <ArrowLeftIcon class="h-6 w-6" />
      </router-link>
    </div>
    <h2 class="text-2xl">Search</h2>
  </header>

  <div class="flex items-center mb-6 sm:mb-4">
    <input
      v-model="query"
      type="text"
      placeholder="Search for TV shows..."
      class="flex-1 px-4 py-2 text-base sm:text-sm rounded-md"
    />
    <div v-if="isSearching" class="ml-3 italic text-sm">Searching...</div>
  </div>

  <div v-if="error" class="p-4 mb-4 rounded-md text-center">
    {{ error }}
  </div>

  <div v-else-if="isSearching" class="p-4 mb-4 text-center">Searching for shows...</div>

  <div v-else-if="results.length === 0 && query" class="p-4 mb-4 rounded-md text-center">
    No shows found matching "{{ query }}"
  </div>

  <div
    v-else
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6"
  >
    <ShowCard v-for="show in results" :key="show.id" :show="show" />
  </div>
</template>

<style scoped>
/* Add custom styles here if needed */
</style>
