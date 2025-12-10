<script setup lang="ts">
import type { StationItem } from '~~/types'

const props = defineProps<{ stations: Partial<StationItem>[], color?: string, dotSize?: number, lineThickness?: number, highlightStationId?: number }>()
const color = computed(() => props.color ?? '#6D28D9')
const dot = computed(() => props.dotSize ?? 14)
const thick = computed(() => props.lineThickness ?? 2)
</script>

<template>
  <div class="flex items-center mb-2">
    <div
      v-for="(stationItem, idx) in props.stations"
      :key="stationItem.id"
      class="relative flex-1 flex items-center justify-center"
    >
      <!-- 站点名称 -->
      <div
        class="absolute -top-5 text-[10px] text-center w-full whitespace-nowrap"
        :class="[
          {
            'font-bold': stationItem.id === props.highlightStationId,
          },
        ]"
      >
        {{ stationItem.name }}
      </div>
      <!-- 外接圆环 -->
      <div
        class="rounded-full border"
        :style="{
          width: `${dot}px`,
          height: `${dot}px`,
          borderWidth: `${thick}px`,
          borderColor: color,
          backgroundColor: stationItem.id === props.highlightStationId ? color : 'transparent',
        }"
      />
      <div
        v-if="stationItem.id === props.highlightStationId"
        class="absolute -bottom-5 text-[10px] text-center w-full"
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
