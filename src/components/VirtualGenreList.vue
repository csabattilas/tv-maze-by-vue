<template>
  <section class="mb-8">
    <h2 class="mb-2 mt-0">{{ title }}</h2>
    <div
      v-bind="containerProps"
      class="relative overflow-x-auto scrollbar-hide flex overflow-y-visible py-2"
      :style="{ scrollBehavior: 'smooth' }"
    >
      <div v-bind="wrapperProps" class="flex gap-2 md:gap-4">
        <div
          v-for="{ index, data } in list"
          :key="index"
          class="flex-shrink-0"
          :style="{ width: `${virtualListOptions.itemWidth}px` }"
        >
          <ShowCard :show="data" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useVirtualList } from '@vueuse/core'
import { useMediaQuery } from '@composables/useMediaQuery'
import ShowCard from './ShowCard.vue'
import type { TvShow } from '@model/tvMaze'

const props = defineProps<{
  title: string
  shows: TvShow[]
}>()

const { matches: isMobile } = useMediaQuery('(max-width: 768px)')

const virtualListOptions = ref({
  itemWidth: isMobile.value ? 124 : 188,
  overscan: 10,
})

watch(isMobile, () => {
  virtualListOptions.value = {
    itemWidth: isMobile.value ? 124 : 188,
    overscan: 10,
  }
})

const sourceList = computed(() => props.shows)

// the virtual list is still snappy, but let's park it for now
const { list, containerProps, wrapperProps } = useVirtualList(sourceList, virtualListOptions.value)
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
  scroll-behavior: smooth;
}
</style>
