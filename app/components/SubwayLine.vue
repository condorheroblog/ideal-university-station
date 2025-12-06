<script setup lang="ts">
const props = defineProps<{ stations: string[], color?: string, dotSize?: number, lineThickness?: number }>()
const color = computed(() => props.color ?? '#6D28D9')
const dot = computed(() => props.dotSize ?? 12)
const thick = computed(() => props.lineThickness ?? 2)
</script>

<template>
  <div class="flex items-center mt-10 mb-3">
    <div
      v-for="(stationItem, idx) in props.stations"
      :key="stationItem"
      class="relative flex-1 flex items-center justify-center"
    >
      <!-- 站点名称 -->
      <div class="absolute -top-4 text-[8px] text-center w-full">
        {{ stationItem }}
      </div>
      <!-- 外接圆环 -->
      <div
        class="rounded-full border"
        :style="{
          width: `${dot}px`,
          height: `${dot}px`,
          borderWidth: `${thick}px`,
          borderColor: color,
          backgroundColor: 'transparent',
        }"
      />
      <!-- 只有最中间的圆的下方显示文字“下一站” -->
      <div
        v-if="idx === props.stations.length / 2 - 0.5"
        class="absolute -bottom-4 text-[8px] text-center w-full"
      >
        下一站
      </div>

      <!-- 左侧线段 -->
      <div
        class="absolute left-0 top-1/2 -translate-y-1/2"
        :class="{ 'rounded-l-full': idx === 0 }"
        :style="{
          width: `calc(50% - ${dot / 2}px)`,
          height: `${thick}px`,
          backgroundColor: color,
        }"
      />
      <!-- 右侧线段 -->
      <div
        class="absolute right-0 top-1/2 -translate-y-1/2"
        :class="{ 'rounded-r-full': idx === props.stations.length - 1 }"
        :style="{
          width: `calc(50% - ${dot / 2}px)`,
          height: `${thick}px`,
          backgroundColor: color,
        }"
      />
    </div>
  </div>
</template>
