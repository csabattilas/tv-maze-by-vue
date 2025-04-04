<!-- components/GenreSection.vue -->
<template>
  <section class="genre-section">
    <h2>{{ title }}</h2>
    <div class="scroll-row" ref="scrollContainer" @scroll="handleScroll">
      <div class="scroll-content">
        <!-- Show cards with virtual scrolling -->
        <ShowCard
          v-for="show in displayedShows.slice(0, visibleCount)"
          :key="show.id"
          :show="show"
          class="show-card-wrapper"
        />
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
        </div>
        
        <!-- End sentinel for detecting when to load more -->
        <div ref="endSentinel" class="sentinel sentinel-end"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ShowCard from './ShowCard.vue'
import type { TvShow } from '@composables/types'
import { ref, computed } from 'vue'
import { useInfiniteScroll } from '@composables/useInfiniteScroll'

const props = defineProps<{
  title: string
  shows: TvShow[]
}>()

// State to track how many shows to display
const visibleCount = ref(10)

// Use the infinite scroll composable
const { scrollContainer, endSentinel, isLoading } = useInfiniteScroll({
  onLoadMore: loadMoreShows
})

// Function to load more shows when scrolling to the end
function loadMoreShows() {
  // Increase the number of visible shows by 5 each time
  visibleCount.value += 5
}

// Track container width for responsive sizing
const containerWidth = ref(0)
const scrollPosition = ref(0)

// Simple scroll handler for tracking position
const handleScroll = () => {
  if (!scrollContainer.value) return
  scrollPosition.value = scrollContainer.value.scrollLeft
}

// Responsive card sizing
const getCardWidth = () => {
  if (containerWidth.value < 480) return 120 // Small mobile (reduced size)
  if (containerWidth.value < 600) return 140 // Mobile (reduced size)
  if (containerWidth.value < 1024) return 170 // Tablet
  return 200 // Desktop
}

const getGap = () => {
  if (containerWidth.value < 480) return 6 // Small mobile (reduced gap)
  if (containerWidth.value < 600) return 8 // Mobile (reduced gap)
  return 16 // Tablet and Desktop
}

// Dynamic card width and gap based on screen size
const cardWidth = computed(() => getCardWidth())
const gap = computed(() => getGap())

// Just use the original shows without duplication
const displayedShows = computed(() => {
  if (props.shows.length === 0) return []

  // Simply return the original shows
  return props.shows
})

// No longer needed with the flex-based layout

// These computed properties are no longer needed with the IntersectionObserver approach
// The flex layout handles the positioning automatically

// Set up resize observer for responsive sizing
let resizeObserver: ResizeObserver | null = null

// Initialize container width and watch for resize
if (scrollContainer.value) {
  // Initialize container width
  containerWidth.value = scrollContainer.value.clientWidth

  // Update container width on window resize
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width
    }
  })

  resizeObserver.observe(scrollContainer.value)
}

// Clean up resize observer when component is unmounted
if (resizeObserver) {
  import('vue').then(({ onUnmounted }) => {
    onUnmounted(() => {
      resizeObserver?.disconnect()
    })
  })
}
</script>

<style scoped>
.genre-section {
  margin-bottom: 2rem;
}

@media (max-width: 600px) {
  .genre-section {
    margin-bottom: 1.2rem;
  }
  
  .genre-section h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    margin-left: 0.3rem;
    color: var(--color-heading);
  }
}

@media (max-width: 480px) {
  .genre-section {
    margin-bottom: 1rem;
  }
  
  .genre-section h2 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
    margin-left: 0.2rem;
    color: var(--color-heading);
  }
}

.scroll-row {
  position: relative;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  height: calc(var(--card-height, 320px) + 50px); /* Dynamic height based on card size */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

@media (max-width: 600px) {
  .scroll-row {
    padding-bottom: 0.7rem;
  }
}

@media (max-width: 480px) {
  .scroll-row {
    padding-bottom: 0.5rem;
  }
}

/* Set different heights for different screen sizes */
@media (max-width: 480px) {
  .scroll-row {
    --card-height: 220px;
  }
}

@media (max-width: 600px) {
  .scroll-row {
    --card-height: 250px;
  }
}

@media (min-width: 601px) {
  .scroll-row {
    --card-height: 320px;
  }
}

.scroll-row::-webkit-scrollbar {
  display: none;
}

.scroll-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--card-gap, 16px);
}

.show-card-wrapper {
  flex: 0 0 auto;
  width: var(--card-width);
}

.sentinel {
  flex: 0 0 10px;
  height: 100%;
  opacity: 0;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 100%;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Set different card widths for different screen sizes */
@media (max-width: 480px) {
  .scroll-content {
    --card-width: 140px;
    --card-gap: 8px;
  }
}

@media (max-width: 600px) {
  .scroll-content {
    --card-width: 160px;
    --card-gap: 12px;
  }
}

@media (min-width: 601px) and (max-width: 1023px) {
  .scroll-content {
    --card-width: 180px;
    --card-gap: 16px;
  }
}

@media (min-width: 1024px) {
  .scroll-content {
    --card-width: 200px;
    --card-gap: 16px;
  }
}

/* Debug styles - uncomment to see container boundaries */
/* 
.scroll-row {
  border: 1px solid red;
}

.scroll-content {
  border: 1px solid blue;
}
*/
</style>
