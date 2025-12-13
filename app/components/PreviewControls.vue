<script setup lang="ts">
// 预览缩放控件：显示逻辑尺寸、缩放百分比，并提供加减与滑块
interface Logical { width: number, height: number }
interface Props {
  logical: Logical
  zoom: number
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'inc' | 'dec' | 'reset'): void
  (e: 'set', v: number): void
}>()

// 将滑块值字符串转为数值并透传
function onRange(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  emit('set', v)
}
</script>

<template>
  <div class="flex gap-2 items-center justify-between bg-white/70 dark:bg-black/50 backdrop-blur rounded-lg px-3 py-2 text-xs">
    <div class="text-gray-700 dark:text-gray-300">
      逻辑尺寸 {{ props.logical.width }}×{{ props.logical.height }}
    </div>
    <div class="flex items-center gap-2">
      <UKbd @click="emit('dec')">
        -
      </UKbd>
      <div class="min-w-8 text-center font-medium text-gray-800 dark:text-gray-300">
        {{ Math.round(props.zoom * 100) }}%
      </div>
      <UKbd @click="emit('inc')">
        +
      </UKbd>
      <button
        type="button"
        class="px-2 py-1 rounded-md bg-indigo-600 text-white"
        title="重置为 100%"
        @click="emit('reset')"
      >
        重置
      </button>
      <!-- 缩放滑块：范围 0.4 ~ 2.0，步进 0.1 -->
      <input
        type="range"
        min="0.4"
        max="2"
        step="0.1"
        :value="props.zoom"
        class="w-28"
        @input="onRange"
      >
    </div>
  </div>
</template>
