<script setup lang="ts">
const props = defineProps<{ level?: number }>()
const level = computed(() => {
  const v = props.level ?? 0
  return Math.min(3, Math.max(0, v))
})
const on1 = computed(() => level.value >= 1)
const on2 = computed(() => level.value >= 2)
const on3 = computed(() => level.value >= 3)
const dotOn = computed(() => level.value > 0)
</script>

<template>
  <svg
    viewBox="3 6 18 14"
    class="w-[14px] h-[14px]"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M4.5 10.5C8.4 6.6 15.6 6.6 19.5 10.5"
      :class="on3 ? 'stroke-white' : 'stroke-white/20'"
      stroke-width="2"
    />
    <path
      d="M7 13C9.9 10.1 14.1 10.1 17 13"
      :class="on2 ? 'stroke-white' : 'stroke-white/20'"
      stroke-width="2"
    />
    <path
      d="M9.5 15.5C11 14.2 13 14.2 14.5 15.5"
      :class="on1 ? 'stroke-white' : 'stroke-white/20'"
      stroke-width="2"
    />
    <circle
      cx="12"
      cy="18"
      r="1.6"
      :class="dotOn ? 'fill-white' : 'fill-white/20'"
    />
  </svg>
</template>
