<template>
  <section class="mb-8">
    <h2 class="mb-2 mt-0">{{ title }}</h2>
    <div
      v-bind="isMobile ? containerPropsMobile : containerProps"
      class="relative overflow-x-auto scrollbar-hide flex overflow-y-visible py-2"
      :style="{ scrollBehavior: 'smooth' }"
    >
      <div v-bind="isMobile ? wrapperPropsMobile : wrapperProps" class="flex gap-2 md:gap-4">
        <div
          v-for="{ index, data } in isMobile ? listMobile : list"
          :key="index"
          class="flex-shrink-0 w-[124px] md:w-[188px]"
        >
          <ShowCard :show="data" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVirtualList } from '@vueuse/core'
import { useMediaQuery } from '@composables/useMediaQuery'
import ShowCard from './ShowCard.vue'
import type { TvShow } from '@model/tvMaze'

const props = defineProps<{
  title: string
  shows: TvShow[]
}>()

const { matches: isMobile } = useMediaQuery('(max-width: 768px)')

const sourceList = computed(() => props.shows)

const {
  list: listMobile,
  containerProps: containerPropsMobile,
  wrapperProps: wrapperPropsMobile,
} = useVirtualList(sourceList, {
  itemWidth: 124,
  overscan: 5,
})
const { list, containerProps, wrapperProps } = useVirtualList(sourceList, {
  itemWidth: 188,
  overscan: 5,
})
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
