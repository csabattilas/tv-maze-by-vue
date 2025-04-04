<script setup lang="ts">
import AppLayout from './components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2c3e50;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --border-color: #ddd;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text); /* Using theme-aware variable instead of --text-color */
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  margin-bottom: 0.5rem;
  color: var(--color-heading); /* Using theme-aware variable for headings */
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
