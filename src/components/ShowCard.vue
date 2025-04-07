<template>
  <div
    class="w-full rounded-lg overflow-hidden shadow-md dark:shadow-sm dark:shadow-white hover:-translate-y-1 transition-all duration-200 flex flex-col"
  >
    <div
      class="relative aspect-[260/300] rounded-t-lg overflow-hidden m-0 p-0 block bg-gray-100 dark:bg-gray-800"
    >
      <ResponsiveImage
        :mobileSrc="show.image?.medium"
        :desktopSrc="show.image?.original"
        :fallbackSrc="PLACEHOLDER_IMAGE"
        :alt="show.name"
      />
      <div
        v-if="rank"
        class="absolute z-10 bottom-2 font-semibold right-2 text-white rank text-[100px] md:text-[150px] leading-none"
      >
        {{ rank }}
      </div>
      <div
        v-else-if="show.rating?.average"
        class="absolute z-10 top-2 right-2 text-xs font-semibold text-white bg-gray-800 rounded p-1 opacity-80"
      >
        {{ show.rating?.average?.toFixed(1) }}
      </div>
    </div>
    <div class="p-2 md:p-4">
      <h3
        class="m-0 mb-2 mt-2 text-xs md:text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ show.name }}
      </h3>
      <div class="flex items-center justify-between gap-2">
        <div class="text-[0.625rem] md:text-xs whitespace-nowrap overflow-hidden text-ellipsis">
          <span v-for="(genre, index) in show.genres" :key="genre">
            {{ genre }}{{ index < show.genres.length - 1 ? ', ' : '' }}
          </span>
        </div>
        <router-link
          :to="`/show/${show.id}`"
          class="inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors"
          title="View Details"
        >
          <InformationCircleIcon class="w-6 h-6" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TvShow } from '@composables/types'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import ResponsiveImage from './ResponsiveImage.vue'
import { PLACEHOLDER_IMAGE } from '@model/constants'

const props = defineProps<{
  show: TvShow
  rank?: number
}>()
</script>

<style>
.rank {
  font-family: 'Bungee Outline', sans-serif;
  text-shadow: 1px 1px 3px black;
  font-style: normal;
}
</style>
