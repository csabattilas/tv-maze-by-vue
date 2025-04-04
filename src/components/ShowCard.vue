<!-- components/ShowCard.vue -->
<template>
  <div class="show-card">
    <div class="image-container">
      <img
        :src="show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image'"
        :alt="show.name"
        class="show-image"
      />
      <div class="rating" v-if="show.rating?.average">
        {{ show.rating.average.toFixed(1) }}
      </div>
    </div>
    <div class="show-info">
      <h3 class="show-title">{{ show.name }}</h3>
      <div class="show-genres">
        <span v-for="(genre, index) in show.genres" :key="genre">
          {{ genre }}{{ index < show.genres.length - 1 ? ', ' : '' }}
        </span>
      </div>
      <router-link :to="`/show/${show.id}`" class="details-link"> View Details </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TvShow } from '@composables/types'

const props = defineProps<{
  show: TvShow
}>()
</script>

<style scoped>
.show-card {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.show-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  aspect-ratio: 260/300;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
  margin: 0;
  padding: 0;
  line-height: 0;
  display: block;
}

.show-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: block;
  margin: 0;
  padding: 0;
}

.rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  z-index: 2;
  line-height: normal;
  font-size: 14px;
}

.show-info {
  padding: 12px;
}

@media (max-width: 600px) {
  .show-info {
    padding: 8px;
  }
}

.show-title {
  margin: 0 0 8px 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .show-title {
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
}

.show-genres {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-link {
  display: inline-block;
  padding: 6px 12px;
  background-color: var(--primary-color, #4caf50);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background-color 0.3s;
}

.details-link:hover {
  background-color: var(--primary-color-dark, #45a049);
}
</style>
