<script setup lang="ts">
// Main layout component for the application
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">
        <router-link to="/">TV Maze Explorer</router-link>
      </div>
      <nav class="main-nav">
        <router-link to="/">Home</router-link>
        <router-link to="/search">Search</router-link>
      </nav>
    </header>
    
    <main class="app-content">
      <slot></slot>
    </main>
    
    <footer class="app-footer">
      <p>Powered by <a href="http://www.tvmaze.com/api" target="_blank">TVMaze API</a></p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 20px;
}

.main-nav a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  background-color: #4CAF50;
}

.app-content {
  flex: 1;
  padding: 20px;
}

@media (max-width: 600px) {
  .app-content {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 5px;
  }
}

.app-footer {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
}

.app-footer a {
  color: #4CAF50;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
