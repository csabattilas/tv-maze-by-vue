<template>
  <section class="mb-8">
    <h2 class="mb-2 mt-0">{{ title }}</h2>
    <div
      v-bind="containerProps"
      class="relative overflow-x-auto scrollbar-hide flex overflow-y-visible py-2"
    >
      <div v-bind="wrapperProps" class="flex gap-2 md:gap-4">
        <div
          v-for="{ index, data } in list"
          :key="index"
          class="flex-shrink-0"
          :class="{ 'w-[120px] md:w-[180px]': true }"
        >
          <ShowCard :show="data" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVirtualList, useWindowSize } from '@vueuse/core'
import ShowCard from './ShowCard.vue'
import type { TvShow } from '@composables/types'

const props = defineProps<{
  title: string
  shows: TvShow[]
}>()

const { width } = useWindowSize()

// compute item width based on window size
const itemWidth = computed(() => {
  return width.value < 768 ? 120 + 4 : 180 + 8
})

const { list, containerProps, wrapperProps } = useVirtualList(props.shows, {
  itemWidth: itemWidth.value,
  overscan: 5,
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
}
</style>
