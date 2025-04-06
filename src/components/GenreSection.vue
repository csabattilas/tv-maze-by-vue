<!-- components/GenreSection.vue -->
<template>
  <section class="mb-8">
    <h2 class="mb-2 mt-0">{{ title }}</h2>
    <div
      class="relative overflow-x-auto scrollbar-hide flex gap-2 md:gap-4 overflow-y-visible py-2"
    >
      <div
        v-for="show in shows"
        :key="show.id"
        class="w-[100px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-shrink-0"
      >
        <ShowCard :show="show" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ShowCard from './ShowCard.vue'
import type { TvShow } from '@composables/types'

const props = defineProps<{
  title: string
  shows: TvShow[]
}>()
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.scrollbar-hide {
  scrollbar-width: none;
}
</style>
