<!-- components/TopShowsSection.vue -->
<template>
  <section class="mb-10">
    <h2 class="mb-2 mt-0">Top 10 Shows</h2>
    <div
      class="flex overflow-x-auto gap-2 md:gap-4 py-2.5 pb-8 snap-x snap-mandatory scrollbar-hide"
    >
      <div
        v-for="(show, index) in shows"
        :key="show.id"
        class="relative flex flex-none w-[180px] md:w-[250px] snap-start"
      >
        <ShowCard :show="show" :rank="index + 1" class="w-full" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TvShow } from '@model/tvMaze'
import ShowCard from './ShowCard.vue'

defineProps<{
  shows: TvShow[]
}>()
</script>

<style>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
