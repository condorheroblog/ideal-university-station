<script setup lang="ts">
interface Props {
  dateText: string
  timeText: string
}
const props = defineProps<Props>()

// 从 index.vue#L152-159 提取：日期与时间显示（锁屏样式）
</script>

<template>
  <div class="text-center text-white select-none">
    <div class="font-semibold">
      {{ props.dateText }}
    </div>
    <div class="text-[80px] font-bold tracking-wide" :style="{ lineHeight: '80px' }">
      {{ props.timeText }}
    </div>
  </div>
</template>
