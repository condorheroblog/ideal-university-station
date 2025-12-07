<script setup lang="ts">
interface Props {
  dateText: string
  timeText: string
}
const props = defineProps<Props>()

// 从 index.vue#L152-159 提取：日期与时间显示（锁屏样式）
</script>

<template>
  <div class="mt-16 text-center text-white select-none">
    <div class="text-sm">
      {{ props.dateText }}
    </div>
    <div class="text-6xl font-bold tracking-wide mt-2">
      {{ props.timeText }}
    </div>
  </div>
</template>
