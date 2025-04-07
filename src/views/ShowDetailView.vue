<script setup lang="ts">
import { useShowDetails } from '@composables/useShowDetails'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import ResponsiveImage from '@components/ResponsiveImage.vue'
import { PLACEHOLDER_IMAGE } from '@model/constants'
import { onMounted } from 'vue'

const props = defineProps<{
  id: string
}>()

const { show, cast, isLoading, error, fetchShowDetails } = useShowDetails()

onMounted(() => {
  fetchShowDetails(props.id)
})
</script>

<template>
  <header class="flex justify-between items-center mb-8">
    <div>
      <router-link
        to="/"
        class="inline-flex items-center rounded font-medium transition-colors"
        title="Back to Dashboard"
      >
        <ArrowLeftIcon class="h-6 w-6" />
      </router-link>
    </div>
  </header>

  <div v-if="isLoading" class="text-center py-10 text-lg">Loading show details...</div>

  <div v-else-if="error" class="text-center py-10 text-lg">
    {{ error }}
  </div>

  <div v-else-if="show" class="flex flex-col gap-8 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row gap-6 md:gap-10">
      <div class="relative md:w-96 flex-shrink-0 rounded-lg shadow-md overflow-hidden">
        <ResponsiveImage
          :mobileSrc="show.image?.medium"
          :desktopSrc="show.image?.original"
          :fallbackSrc="PLACEHOLDER_IMAGE"
          :alt="show.name"
        />
        <div
          v-if="show.rating?.average"
          class="absolute top-3 right-3 px-3 py-1.5 rounded text-white"
        >
          {{ show.rating.average.toFixed(1) }}
        </div>
      </div>
      <div class="flex-1">
        <h2 class="text-3xl font-bold mb-2">{{ show.name }}</h2>
        <div class="text-lg mb-5">
          <span v-for="(genre, index) in show.genres" :key="genre">
            {{ genre }}{{ index < show.genres.length - 1 ? ', ' : '' }}
          </span>
        </div>
        <div class="flex flex-col gap-2 mb-5">
          <div v-if="show.premiered">
            <span class="font-semibold">Premiered:</span>
            {{ new Date(show.premiered).toLocaleDateString() }}
          </div>
          <div v-if="show.status"><span class="font-semibold">Status:</span> {{ show.status }}</div>
          <div v-if="show.network?.name">
            <span class="font-semibold">Network:</span> {{ show.network.name }}
          </div>
        </div>
        <div v-if="show.summary" v-html="show.summary" class="max-w-none"></div>
      </div>
    </div>

    <div v-if="cast.length > 0" class="border-t pt-5">
      <h3 class="text-xl font-semibold mb-3">Cast</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="member in cast" :key="member.person.id" class="flex flex-col items-center">
          <img
            :src="
              member.person.image?.medium || 'https://via.placeholder.com/100x140?text=No+Image'
            "
            :alt="member.person.name"
            class="w-24 h-32 object-cover rounded-md mb-2"
          />
          <div class="text-center">
            <div class="font-semibold text-sm">{{ member.person.name }}</div>
            <div class="text-xs italic">as {{ member.character.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    class="text-center py-10 text-lg text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-md"
  >
    Show not found
  </div>
</template>
