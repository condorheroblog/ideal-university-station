<script setup lang="ts">
const props = defineProps<{ level?: number }>()
const level = computed(() => {
  const v = props.level ?? 0
  return Math.min(4, Math.max(0, v))
})
</script>

<template>
  <div class="h-[14px] flex items-end gap-[2px]">
    <div
      v-for="i in 4"
      :key="i"
      class="w-[3px] rounded-[1px]"
      :class="i <= level ? 'bg-white' : 'bg-white/20'"
      :style="{ height: `${6 + i * 2}px` }"
    />
  </div>
</template>
