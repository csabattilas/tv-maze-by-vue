<script setup lang="ts">
import { useShowDetails } from '@composables/useShowDetails'
import { onMounted } from 'vue'

// Get the show ID from the route params
const props = defineProps<{
  id: string
}>()

const { show, isLoading, error } = useShowDetails(props.id)
</script>

<template>
  <div class="show-detail">
    <header class="header">
      <h1>TV Show Details</h1>
      <div class="back-link">
        <router-link to="/">Back to Dashboard</router-link>
      </div>
    </header>

    <div v-if="isLoading" class="loading">
      Loading show details...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="show" class="show-container">
      <div class="show-header">
        <div class="image-container">
          <img 
            :src="show.image?.original || 'https://via.placeholder.com/500x750?text=No+Image'" 
            :alt="show.name" 
            class="show-image"
          />
          <div class="rating" v-if="show.rating?.average">
            {{ show.rating.average.toFixed(1) }}
          </div>
        </div>
        <div class="show-info">
          <h2 class="show-title">{{ show.name }}</h2>
          <div class="show-genres">
            <span v-for="(genre, index) in show.genres" :key="genre">
              {{ genre }}{{ index < show.genres.length - 1 ? ', ' : '' }}
            </span>
          </div>
          <div class="show-meta">
            <div v-if="show.premiered" class="premiered">
              <strong>Premiered:</strong> {{ new Date(show.premiered).toLocaleDateString() }}
            </div>
            <div v-if="show.status" class="status">
              <strong>Status:</strong> {{ show.status }}
            </div>
            <div v-if="show.network?.name" class="network">
              <strong>Network:</strong> {{ show.network.name }}
            </div>
          </div>
          <div class="show-summary" v-if="show.summary" v-html="show.summary"></div>
        </div>
      </div>

      <div class="show-details" v-if="show.schedule">
        <h3>Schedule</h3>
        <div class="schedule-info">
          <div><strong>Days:</strong> {{ show.schedule.days.join(', ') || 'N/A' }}</div>
          <div><strong>Time:</strong> {{ show.schedule.time || 'N/A' }}</div>
        </div>
      </div>

      <div class="external-links" v-if="show.officialSite || show.url">
        <h3>External Links</h3>
        <div class="links">
          <a v-if="show.officialSite" :href="show.officialSite" target="_blank" rel="noopener noreferrer">
            Official Website
          </a>
          <a v-if="show.url" :href="show.url" target="_blank" rel="noopener noreferrer">
            TVMaze Page
          </a>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      Show not found
    </div>
  </div>
</template>

<style scoped>
.show-detail {
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

.back-link a {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.back-link a:hover {
  background-color: #45a049;
}

.show-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.show-header {
  display: flex;
  gap: 30px;
}

@media (max-width: 768px) {
  .show-header {
    flex-direction: column;
    gap: 20px;
  }
}

.image-container {
  position: relative;
  flex: 0 0 300px;
}

@media (max-width: 768px) {
  .image-container {
    flex: 0 0 auto;
    max-width: 100%;
    margin: 0 auto;
  }
}

.show-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.2rem;
}

.show-info {
  flex: 1;
  color: var(--color-text);
}

.show-title {
  font-size: 2rem;
  margin: 0 0 10px 0;
  color: var(--color-heading);
}

.show-genres {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 20px;
}

.show-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.show-summary {
  line-height: 1.6;
}

.show-summary :deep(p) {
  margin-bottom: 1rem;
}

.show-details, .external-links {
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.schedule-info, .links {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.links a {
  display: inline-block;
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.links a:hover {
  background-color: #0b7dda;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  color: #d32f2f;
}
</style>
