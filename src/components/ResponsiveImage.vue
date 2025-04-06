<template>
  <div class="relative w-full h-full">
    <div
      v-if="!imageLoaded && !!currentSrc"
      class="absolute inset-0 flex items-center justify-center animate-pulse"
    >
      <LoadingSpinner />
    </div>

    <img
      :src="currentSrc"
      :alt="alt"
      class="w-full h-full object-cover"
      loading="lazy"
      @load="handleImageLoad"
      :class="{
        'opacity-0': !imageLoaded && !!currentSrc,
        'opacity-100 transition-opacity duration-300': imageLoaded,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMediaQuery } from '@composables/useMediaQuery'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps<{
  mobileSrc?: string
  desktopSrc?: string
  fallbackSrc?: string
  alt: string
}>()

const { matches: isMobile } = useMediaQuery('(max-width: 768px)')
const imageLoaded = ref(false)

const currentSrc = computed(() => {
  if (isMobile.value && props.mobileSrc) {
    return props.mobileSrc
  }

  return props.desktopSrc ?? props.mobileSrc ?? props.fallbackSrc ?? ''
})

function handleImageLoad() {
  imageLoaded.value = true
}
</script>
