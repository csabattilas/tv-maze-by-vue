<template>
  <div class="home">
    <header class="header">
      <h1>TV Shows Dashboard</h1>
      <div class="search-link">
        <router-link to="/search">Search Shows</router-link>
      </div>
    </header>

    <div v-if="loading" class="loading">Loading shows...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="content">
      <!-- Top Shows Section -->
      <TopShowsSection :shows="topShows" />
      
      <!-- Genres Sections -->
      <div class="genres-container">
        <GenreSection
          v-for="[genre, shows] in genres"
          :key="genre"
          :title="genre"
          :shows="shows"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GenreSection from '@components/GenreSection.vue'
import TopShowsSection from '@components/TopShowsSection.vue'
import { useShowsByGenres } from '@composables/useShowsByGenres'
import { computed } from 'vue'
import type { TvShow } from '@composables/types'

const { genreMap, loading, error } = useShowsByGenres()

const genres = computed(() => [...genreMap.value.entries()])

// Extract all shows from all genres and sort by rating to get top shows
const topShows = computed(() => {
  const allShows: TvShow[] = [];
  genreMap.value.forEach(shows => {
    allShows.push(...shows);
  });
  
  // Remove duplicates (shows can appear in multiple genres)
  const uniqueShows = Array.from(new Map(allShows.map(show => [show.id, show])).values());
  
  // Sort by rating and take top 10
  return uniqueShows
    .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
    .slice(0, 10);
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.search-link a {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.search-link a:hover {
  background-color: #45a049;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.genres-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  color: #d32f2f;
}
</style>
