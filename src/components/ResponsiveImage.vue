<template>
  <div class="relative w-full h-full">
    <div
      v-if="!imageLoaded && !!fallbackSrc"
      class="absolute inset-0 flex items-center justify-center animate-pulse"
    >
      <LoadingSpinner />
    </div>
    <picture>
      <source
        v-if="desktopSrc"
        :srcset="desktopSrc"
        media="(min-width: 768px)"
      />
      <source
        v-if="mobileSrc"
        :srcset="mobileSrc"
        media="(max-width: 767px)"
      />
      <img
        :src="fallbackSrc"
        :alt="alt"
        class="w-full h-full object-cover"
        loading="lazy"
        @load="handleImageLoad"
        :class="{
          'opacity-0': !imageLoaded && !!fallbackSrc,
          'opacity-100 transition-opacity duration-300': imageLoaded,
        }"
      />
    </picture>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps<{
  mobileSrc?: string
  desktopSrc?: string
  fallbackSrc: string
  alt: string
}>()

const imageLoaded = ref(false)

const fallbackSrc = computed(() => props.desktopSrc || props.mobileSrc || props.fallbackSrc || '')

function handleImageLoad() {
  imageLoaded.value = true
}
</script>
