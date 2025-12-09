<script setup lang="ts">
interface Props {
  temp?: number
  high?: number
  low?: number
  condition?: string
  accent?: string
}
const props = withDefaults(defineProps<Props>(), {
  temp: 39,
  high: 33,
  low: 25,
  condition: '部分時間多雲',
  accent: '#0B3B9B',
})
</script>

<template>
  <div
    class="flex items-center justify-between px-6 py-3 rounded-xl text-white select-none"
    :style="{ backgroundColor: 'transparent' }"
  >
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <Icon
          name="ri:sun-cloudy-line"
          class="w-5 h-5 text-white/90"
        />
        <div class="text-lg font-semibold">
          {{ props.temp }}°
        </div>
      </div>
      <div class="mt-1 text-sm leading-tight">
        {{ props.condition }}
      </div>
      <div class="mt-1 text-xs text-white/80">
        最高 {{ props.high }}° 最低 {{ props.low }}°
      </div>
    </div>
    <Icon
      name="ri:movie-2-ai-line"
      class="w-10 h-10 text-white/90 mr-4"
    />
    <div class="ml-4 relative w-10 h-10 flex items-center justify-center">
      <div class="absolute inset-0 rounded-full bg-white/10" />
      <Icon
        name="ri:planet-line"
        class="w-5 h-5 text-white/90"
      />
      <div
        class="absolute inset-0 rounded-full"
        :style="{
          background: `conic-gradient(from 270deg, rgba(255,255,255,.65) 0 270deg, rgba(255,255,255,0) 270deg 360deg)`,
          mask: 'radial-gradient(circle at center, transparent 55%, black 56%)',
        }"
      />
    </div>
  </div>
</template>
