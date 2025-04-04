<!-- components/TopShowsSection.vue -->
<template>
  <section class="top-shows-section">
    <h2 class="section-title">Top 10 Shows</h2>
    <div class="top-shows-scroll">
      <div v-for="(show, index) in shows" :key="show.id" class="top-show-card">
        <div class="rank-number">{{ index + 1 }}</div>
        <div class="card-content">
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
              <span v-for="(genre, idx) in show.genres" :key="genre">
                {{ genre }}{{ idx < show.genres.length - 1 ? ', ' : '' }}
              </span>
            </div>
            <router-link :to="`/show/${show.id}`" class="details-link">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TvShow } from '@composables/types'

const props = defineProps<{
  shows: TvShow[]
}>()
</script>

<style scoped>
.top-shows-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #4caf50;
  padding-bottom: 10px;
}

.top-shows-scroll {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 10px 0 30px 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.top-shows-scroll {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.top-shows-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.top-show-card {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  width: 300px;
  scroll-snap-align: start;
  padding-left: 60px; /* Space for the rank number */
}

.card-content {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  background-color: white;
}

.top-show-card:hover .card-content {
  transform: translateY(-5px);
}

.rank-number {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 5rem;
  font-weight: 800;
  color: #4caf50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  line-height: 1;
}

.image-container {
  position: relative;
  height: 200px;
}

.show-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.show-info {
  padding: 15px;
}

.show-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.show-genres {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-link {
  display: inline-block;
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background-color 0.3s;
}

.details-link:hover {
  background-color: #45a049;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .rank-number {
    font-size: 4rem;
  }
  
  .top-show-card {
    width: 250px;
    padding-left: 50px;
  }
}
</style>
