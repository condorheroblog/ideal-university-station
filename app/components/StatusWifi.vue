<script setup lang="ts">
const props = defineProps<{ level?: number }>()
const level = computed(() => {
  const v = props.level ?? 0
  return Math.min(3, Math.max(0, v))
})
const on1 = computed(() => level.value > 0)
const on2 = computed(() => level.value > 1)
const on3 = computed(() => level.value > 2)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      :class="on3 ? 'fill-white' : 'fill-white/20'"
      d="m1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9"
    />
    <path
      :class="on2 ? 'fill-white' : 'fill-white/20'"
      d="M5 13l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13"
    />
    <path
      :class="on1 ? 'fill-white' : 'fill-white/20'"
      d="m9 17l3 3l3-3a4.237 4.237 0 0 0-6 0"
    />
  </svg>
</template>
