<script setup lang="ts">
import { useSearch } from '@composables/useSearch'
import ShowCard from '@components/ShowCard.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from '@components/LoadingSpinner.vue'

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
      class="flex-1 px-4 py-2 text-base text-gray-700 rounded-md"
    />
  </div>

  <div v-if="error" class="p-4 mb-4 rounded-md text-center">
    {{ error }}
  </div>

  <div v-else-if="isSearching" class="p-4 mb-4 text-center">
    <div class="flex justify-center items-center gap-2">
      <span>Searching for shows...</span>
      <LoadingSpinner />
    </div>
  </div>

  <div
    v-else-if="results.length === 0 && query && query.trim().length >= 2"
    class="p-4 mb-4 rounded-md text-center"
  >
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
