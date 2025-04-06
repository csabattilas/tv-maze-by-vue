<template>
  <section class="mb-8">
    <h2 class="mb-2 mt-0">{{ title }}</h2>
    <div
      class="relative overflow-x-auto scrollbar-hide flex gap-2 md:gap-4 overflow-y-visible py-2"
    >
      <div v-for="show in shows" :key="show.id" class="w-[120px] md:w-[180px] flex-shrink-0">
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
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
}
</style>
