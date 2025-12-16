<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { StationItem, UniversityCardJSON } from '~~/types'

import { useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import StatusBar from '@/components/StatusBar.vue'
import DateTimeDisplay from '@/components/DateTimeDisplay.vue'
import WidgetDisplay from '@/components/WidgetDisplay.vue'
import SubwayLine from '@/components/SubwayLine.vue'
import MottoCard from '@/components/MottoCard.vue'
import BottomActions from '@/components/BottomActions.vue'

interface Props {
  currentKind: 'iphone' | 'ipad' | 'desktop'
  carrier: string
  signalLevel: number
  wifiLevel: number
  battery: number
  dateText: string
  timeText: string
  screenStyle: CSSProperties
  cardBackgroundColor: string
  cardTextColor: string
  cardTextFont: string
  cardExternalTextColor: string
  cardExternalTextFont: string
  neighbors: StationItem[]
  d?: UniversityCardJSON
  formattedMetroName: string
  dataPending: boolean
  dataError: unknown
  enableLiquidGlass: boolean
}
const props = defineProps<Props>()

const cardRef = useTemplateRef('cardRef')
const { height: cardHeight } = useElementSize(cardRef, {
  width: 0,
  height: 0,
}, {
  box: 'border-box',
})

// 计算最终的 screenStyle：如果开启液体玻璃，则去掉 backgroundColor
const finalScreenStyle = computed(() => {
  if (props.enableLiquidGlass) {
    const { backgroundColor, borderRadius, ...rest } = props.screenStyle
    return rest
  }
  return props.screenStyle
})
</script>

<template>
  <div
    class="w-full h-full relative overflow-hidden"
  >
    <div class="absolute z-10 top-0 left-0 right-0">
      <StatusBar
        v-if="props.currentKind === 'iphone'"
        :carrier="props.carrier"
        :signal-level="props.signalLevel"
        :wifi-level="props.wifiLevel"
        :battery="props.battery"
      />

      <DateTimeDisplay
        :date-text="props.dateText"
        :time-text="props.timeText"
        :class="[
          props.currentKind === 'iphone' ? 'mt-20' : 'mt-10',
        ]"
      />

      <WidgetDisplay
        v-if="props.currentKind === 'iphone'"
        :date-text="props.dateText"
        :time-text="props.timeText"
      />
    </div>

    <div
      id="wallpaper-export"
      class="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center"
      :style="finalScreenStyle"
    >
      <!-- 卡片模糊背景，模仿 backdrop-filter: blur(10px); -->
      <div
        class="absolute top-0 left-0 right-0 bottom-0 gaussian-blur"
        :style="{
          ...finalScreenStyle,
          '--card-height': cardHeight + 'px',
          '--arc-bottom': props.enableLiquidGlass ? '86px' : '84px',
          // 移动端和 PC 的边距不一样
          '--side-margin': props.currentKind === 'iphone' ? '24px' : 'calc(24px + 25%)',
          '--bottom-offset': props.currentKind === 'iphone' ? '14%' : '16px',
        }"
      />
      <div
        class="px-6 absolute tracking-wide"
        :class="[
          props.currentKind === 'iphone' ? 'bottom-[14%] right-0 left-0' : 'bottom-4 right-1/4 left-1/4',
        ]"
      >
        <div
          v-if="props.dataPending"
          class="animate-pulse space-y-4"
        >
          <div class="h-6 bg-white/20 rounded" />
          <div class="h-40 bg-white/20 rounded" />
        </div>
        <div
          v-else-if="props.dataError"
          class="text-sm text-red-600"
        >
          数据加载失败
        </div>
        <div v-else>
          <div
            class="mx-4 my-1 flex items-center justify-between tracking-widest border-b border-dotted md:border-b-2"
            :style="{ color: props.cardExternalTextColor, borderColor: props.cardExternalTextColor, fontFamily: props.cardExternalTextFont }"
          >
            <span class="whitespace-nowrap tracking-[.3em] scale-y-110 text-sm">{{ props.d?.headerExternal.title }}</span>
            <div class="flex items-end gap-1">
              <span class="text-[7px]">{{ props.d?.headerExternal.subtitle }}</span>
              <Icon :name="props.d?.headerExternal.icon ?? 'icon:train-line'" />
            </div>
          </div>

          <!-- 卡片内容 -->
          <div
            ref="cardRef"
            class="rounded-2xl py-4 shadow-sm card-container"
            :style="{
              'color': props.cardTextColor,
              'fontFamily': props.cardTextFont,
              '--arc-bottom': props.enableLiquidGlass ? '86px' : '84px',
              'backgroundColor': props.enableLiquidGlass ? 'transparent' : props.cardBackgroundColor,
            }"
            :class="props.enableLiquidGlass ? 'liquid-glass' : ''"
          >
            <div class="mx-4 flex justify-between items-center">
              <div class="flex items-center">
                <div class="text-[40px] rounded-full flex items-center justify-center">
                  <!-- <Icon :name="`metro:${props.d?.metro.logo}`" /> -->
                  <USkeleton class="h-12 w-12 rounded-full" />
                </div>
                <div class="ml-2 whitespace-nowrap">
                  <div class="text-xl tracking-widest">
                    <!-- {{ props.d?.metro.nameZh }} -->
                    <USkeleton class="h-4 w-22" />
                  </div>
                  <div class="text-[10px] tracking-wide">
                    <!-- {{ props.d?.metro.nameEn }} -->
                    <USkeleton class="h-4 w-22 mt-1" />
                  </div>
                </div>
              </div>
              <div class="text-5xl rounded-full flex items-center justify-center">
                <!-- <Icon :name="`university:${props.d?.university.logo}`" /> -->
                <USkeleton class="h-12 w-12 rounded-full" />
              </div>
            </div>

            <div
              class="mx-4 border-t border-dashed my-2"
              :style="{ borderColor: props.cardTextColor }"
            />

            <div class="mx-4 flex justify-between items-center tracking-wider">
              <div class="text-xs whitespace-nowrap">
                <!-- {{ props.formattedMetroName }} -->
                <USkeleton class="h-4 w-22" />
              </div>
              <div class="text-xs whitespace-nowrap">
                <!-- {{ props.d?.university.nameZh }} -->
                <USkeleton class="h-4 w-22" />
              </div>
            </div>

            <div class="mx-4 mt-4 mb-12 flex justify-between items-end whitespace-nowrap">
              <div>
                <div class="text-2xl font-semibold tracking-wider scale-y-105">
                  {{ props.d?.nextStation.titleZh }}
                </div>
                <div class="text-xs mt-1">
                  {{ props.d?.nextStation.titleEn }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-semibold tracking-wider scale-y-105">
                  <!-- {{ props.d?.nextStation.stationZh }} -->
                  <USkeleton class="h-8 w-22" />
                </div>
                <div class="text-xs mt-1">
                  <USkeleton class="h-4 w-22" />
                  <!-- <span class="text-[7.6px]">
                    {{ props.d?.nextStation.stationEn }}
                  </span> -->
                </div>
              </div>
            </div>

            <SubwayLine
              class="mx-4"
              :stations="props.neighbors ?? []"
              :color="props.cardTextColor"
              :highlight-station-id="props.d?.metro.stationId"
            />

            <!-- 前进图标 -->
            <!-- <div class="mx-4 relative h-5">
            </div> -->
            <div class="relative h-7 mx-4 flex justify-between items-center text-lg">
              <Icon
                v-for="n in 2"
                :key="n"
                class="absolute -bottom-1"
                :class="n === 1 ? 'left-0' : 'right-0'"
                name="icon:up-half-arrow"
              />
            </div>

            <!-- 分隔线 -->
            <div
              id="card-divider"
              class="relative h-9 flex items-center -mt-2"
            >
              <!-- 分割线左侧半圆 -->
              <div
                class="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                :class="[{ 'border-2 border-white/20': props.enableLiquidGlass }]"
              />
              <div
                class="flex-1 border-t-[6px] border-dotted mx-4"
                :style="{ borderColor: props.cardTextColor }"
              />
              <!-- 分割线右侧半圆 -->
              <div
                class="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                :class="[{ 'border-2 border-white/20': props.enableLiquidGlass }]"
              />
            </div>

            <!-- 大学座右铭卡片 -->
            <MottoCard
              class="mx-4 h-12.5"
              :style="{ color: props.cardTextColor, fontFamily: props.cardTextFont }"
              :cn-lines="props.d?.university.motto.cnLines ?? []"
              :en-lines="props.d?.university.motto.enLines ?? []"
            />
          </div>
        </div>
      </div>
    </div>

    <BottomActions v-if="props.currentKind === 'iphone'" />
    <div
      v-if="props.currentKind === 'iphone'"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/70"
    />
  </div>
</template>

<style scoped>
/* 卡片容器 */
.card-container {
  --arc-radius: 9px;
  --arc-bottom: 88px;
  clip-path: shape(
    from 0% 0%,
    line to 100% 0%,
    line to 100% calc(100% - var(--arc-bottom) - var(--arc-radius)),
    arc to 100% calc(100% - var(--arc-bottom) + var(--arc-radius)) of var(--arc-radius) var(--arc-radius) ccw small,
    line to 100% 100%,
    line to 0% 100%,
    line to 0% calc(100% - var(--arc-bottom) + var(--arc-radius)),
    arc to 0% calc(100% - var(--arc-bottom) - var(--arc-radius)) of var(--arc-radius) var(--arc-radius) ccw large,
    close
  );
}
.gaussian-blur {
  filter: blur(10px);

  /* 移动端边距 */
  --side-margin: 24;
  --bottom-offset: 14%;

  /* 卡片高度，style 中传入 */
  /* --card-height: 371px; */
  --radius: 20px;

  /* 继承 card-container 的 arc 变量 */
  --arc-radius: 9.5px;
  --arc-bottom: 88px;

  clip-path: shape(
    from calc(var(--side-margin) + var(--radius)) calc(100% - var(--bottom-offset) - var(--card-height)),

    /* 顶边 */
    line to calc(100% - var(--side-margin) - var(--radius)) calc(100% - var(--bottom-offset) - var(--card-height)),
    /* 右上角 */
    arc to calc(100% - var(--side-margin)) calc(100% - var(--bottom-offset) - var(--card-height) + var(--radius)) of var(--radius) cw,

    /* 右边 - 到 arc 开始位置 */
    line to calc(100% - var(--side-margin)) calc(100% - var(--bottom-offset) - var(--arc-bottom) - var(--arc-radius)),
    /* 右侧 arc 凹陷 */
    arc to calc(100% - var(--side-margin)) calc(100% - var(--bottom-offset) - var(--arc-bottom) + var(--arc-radius)) of var(--arc-radius) var(--arc-radius) ccw small,
    /* 右边 - arc 之后到底部圆角 */
    line to calc(100% - var(--side-margin)) calc(100% - var(--bottom-offset) - var(--radius)),
    /* 右下角 */
    arc to calc(100% - var(--side-margin) - var(--radius)) calc(100% - var(--bottom-offset)) of var(--radius) cw,

    /* 底边 */
    line to calc(var(--side-margin) + var(--radius)) calc(100% - var(--bottom-offset)),
    /* 左下角 */
    arc to var(--side-margin) calc(100% - var(--bottom-offset) - var(--radius)) of var(--radius) cw,

    /* 左边 - 从底部圆角到 arc */
    line to var(--side-margin) calc(100% - var(--bottom-offset) - var(--arc-bottom) + var(--arc-radius)),
    /* 左侧 arc 凹陷 */
    arc to var(--side-margin) calc(100% - var(--bottom-offset) - var(--arc-bottom) - var(--arc-radius)) of var(--arc-radius) var(--arc-radius) ccw large,
    /* 左边 - arc 之后到顶部圆角 */
    line to var(--side-margin) calc(100% - var(--bottom-offset) - var(--card-height) + var(--radius)),
    /* 左上角 */
    arc to calc(var(--side-margin) + var(--radius)) calc(100% - var(--bottom-offset) - var(--card-height)) of var(--radius) cw,

    close
  );
}
.liquid-glass {
  background: rgba(255, 255, 255, 0.05);
  /* backdrop-filter: blur(10px); */
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  /* box-shadow: 0 12px 48px rgba(31, 38, 135, 0.154); */
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent 50%);
}
</style>
