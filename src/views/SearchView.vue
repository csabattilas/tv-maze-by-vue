<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'
import ShowCard from '@/components/ShowCard.vue'

const { query, results, isSearching, error, searchShows } = useSearch()
</script>

<template>
  <div class="search">
    <h1>Search TV Shows</h1>
    <div class="search-container">
      <input
        v-model="query"
        type="text"
        placeholder="Search for TV shows..."
        class="search-input"
        @keyup.enter="searchShows"
      />
      <button class="search-button" @click="searchShows" :disabled="isSearching">
        {{ isSearching ? 'Searching...' : 'Search' }}
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="isSearching" class="loading">Searching for shows...</div>

    <div v-else-if="results.length === 0 && query" class="no-results">
      No shows found matching "{{ query }}"
    </div>

    <div v-else-if="!query" class="instructions">Enter a show name to search</div>

    <div v-else class="results-grid">
      <ShowCard v-for="show in results" :key="show.id" :show="show" />
    </div>
  </div>
</template>

<style scoped>
.search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 600px) {
  .search {
    padding: 8px;
  }
  
  .search h1 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--color-heading);
  }
}

@media (max-width: 480px) {
  .search {
    padding: 5px;
  }
  
  .search h1 {
    font-size: 1.3rem;
    margin-bottom: 8px;
    color: var(--color-heading);
  }
}

.search-container {
  display: flex;
  margin: 20px 0;
}

@media (max-width: 480px) {
  .search-container {
    margin: 10px 0;
  }
  
  .search-input {
    font-size: 14px;
    padding: 8px;
  }
  
  .search-button {
    font-size: 14px;
    padding: 8px 15px;
  }
}

.search-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.search-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

.search-button:hover:not(:disabled) {
  background-color: #45a049;
}

.search-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
}

.loading,
.error,
.no-results,
.instructions {
  margin-top: 20px;
  padding: 20px;
  text-align: center;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
}

.no-results {
  color: #ff9800;
  background-color: #fff3e0;
  border-radius: 4px;
}
</style>
