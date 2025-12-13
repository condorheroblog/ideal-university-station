<script setup lang="ts">
// 主题切换：亮色 / 暗黑 / 跟随系统
type Mode = 'light' | 'dark' | 'system'
const mode = ref<Mode>('system')

function apply(modeVal: Mode) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  const root = document.documentElement
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  if (modeVal === 'light') {
    root.classList.remove('dark')
    return
  }
  if (modeVal === 'dark') {
    root.classList.add('dark')
    return
  }
  if (mq.matches) {
    root.classList.add('dark')
  }
  else {
    root.classList.remove('dark')
  }
}

function onModeChange(next: Mode) {
  mode.value = next
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme-mode', next)
  }
  apply(next)
}

onMounted(() => {
  const saved = (typeof window !== 'undefined' ? localStorage.getItem('theme-mode') : null) as Mode | null
  mode.value = saved ?? 'system'
  apply(mode.value)
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => {
    if (mode.value === 'system') {
      apply('system')
    }
  }
  mq.addEventListener?.('change', handler)
  onUnmounted(() => mq.removeEventListener?.('change', handler))
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-gray-600 dark:text-gray-300">主题</span>
    <button
      type="button"
      class="px-2 py-1 rounded-md border text-xs"
      :class="mode === 'light' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-100'"
      @click="onModeChange('light')"
    >
      亮色
    </button>
    <button
      type="button"
      class="px-2 py-1 rounded-md border text-xs"
      :class="mode === 'dark' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-100'"
      @click="onModeChange('dark')"
    >
      暗黑
    </button>
    <button
      type="button"
      class="px-2 py-1 rounded-md border text-xs"
      :class="mode === 'system' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-100'"
      @click="onModeChange('system')"
    >
      系统
    </button>
  </div>
</template>
