<script setup lang="ts">
const props = defineProps<{ percent?: number }>()
const pct = computed(() => {
  const v = props.percent ?? 0
  return Math.min(100, Math.max(0, v))
})
const innerMax = 28
const fillWidth = computed(() => Math.round(innerMax * (pct.value / 100)))
const isLow = computed(() => pct.value <= 20)
const isZero = computed(() => pct.value === 0)
const fillClass = computed(() => (isLow.value ? 'bg-[#FF3B30]' : 'bg-white'))
const textClass = computed(() => (fillWidth.value >= innerMax / 2 ? 'text-black/80' : 'text-white/70'))
</script>

<template>
  <div class="relative h-[14px] w-[28px]">
    <div class="absolute right-[-3px] top-[4px] h-[5px] w-[3px] bg-white rounded-sm" />
    <div class="relative h-full w-full rounded-[3px] border border-white/80 overflow-hidden">
      <div class="absolute inset-0 rounded-[3px] bg-white/10 z-0" />
      <div
        v-if="!isZero"
        class="absolute left-0 top-0 bottom-0 transition-[width] duration-200 ease-out z-[1]"
        :class="fillClass"
        :style="{ width: `${fillWidth}px` }"
      />
      <div
        class="absolute inset-0 flex items-center justify-center text-[9px] font-semibold z-[10]"
        :class="textClass"
      >
        {{ pct }}
      </div>
      <div class="absolute inset-0 rounded-[3px] pointer-events-none bg-gradient-to-b from-white/20 via-transparent to-transparent z-[2]" />
    </div>
  </div>
</template>
