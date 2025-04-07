<template>
  <div class="min-h-screen flex flex-col w-full">
    <header class="p-2 flex w-full justify-between items-center border-b mb-4">
      <h1 class="mb-0">
        <router-link to="/" class="transition-colors no-underline"> TV Maze by Vue </router-link>
      </h1>
      <nav class="flex items-center">
        <router-link to="/search" class="transition-colors" title="Search Shows">
          <MagnifyingGlassIcon class="h-6 w-6" />
        </router-link>
      </nav>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-2 md:px-4 mb-4">
      <slot></slot>
    </main>

    <footer class="p-4 text-center mt-auto text-[0.625rem] border-t">
      <p>
        Powered by
        <a href="http://www.tvmaze.com/api" target="_blank" class="hover:underline"> TVMaze API </a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>
