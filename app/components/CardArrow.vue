<script setup lang="ts">
type Dir = 'left' | 'right' | 'up' | 'down'
const props = defineProps<{ direction?: Dir, size?: number, strokeWidth?: number, color?: string }>()
const dir = computed(() => props.direction ?? 'left')
const deg = computed(() => ({ left: 0, right: 180, up: -90, down: 90 }[dir.value]))
const sz = computed(() => props.size ?? 24)
const sw = computed(() => props.strokeWidth ?? 3)
const styleObj = computed(() => ({ transform: `rotate(${deg.value}deg)`, color: props.color ?? 'currentColor' }))
</script>

<template>
  <svg
    :width="sz"
    :height="sz"
    viewBox="0 0 24 24"
    class="inline-block"
    :style="styleObj"
    fill="none"
    stroke="currentColor"
    :stroke-width="sw"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 12H20" />
    <path d="M8 8L4 12" />
  </svg>
</template>
