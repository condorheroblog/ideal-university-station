<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header class="h-12 flex items-center justify-between px-4 mb-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur rounded-lg shadow-sm dark:shadow-none border border-gray-200/50 dark:border-gray-700/50">
    <div class="text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-100">
      理想大学站
    </div>
    <ThemeToggle />
  </header>
</template>
