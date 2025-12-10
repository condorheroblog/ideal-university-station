<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { StationItem, UniversityCardJSON } from '~~/types'

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
  screenBG?: CSSProperties
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
}
const props = defineProps<Props>()
</script>

<template>
  <div
    class="w-full h-full relative overflow-hidden"
    :style="props.screenStyle"
  >
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

    <div
      id="wallpaper-export"
      class="absolute top-0 left-0 right-0 bottom-0"
    >
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
            class="mx-4 my-1 flex items-center justify-between text-md tracking-widest border-b border-dotted"
            :style="{ color: props.cardExternalTextColor, borderColor: props.cardExternalTextColor, fontFamily: props.cardExternalTextFont }"
          >
            <span class="whitespace-nowrap font-light tracking-[.3em]">{{ props.d?.headerExternal.title }}</span>
            <div class="flex items-end gap-1">
              <span class="text-[7px]">{{ props.d?.headerExternal.subtitle }}</span>
              <Icon :name="props.d?.headerExternal.icon ?? 'icon:train-line'" />
            </div>
          </div>

          <div
            class="w-full rounded-t-2xl overflow-hidden text-purple-800 shadow-sm px-4 pt-4"
            :style="{ backgroundColor: props.cardBackgroundColor, color: props.cardTextColor, fontFamily: props.cardTextFont }"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="text-[48px] rounded-full flex items-center justify-center">
                  <Icon :name="`metro:${props.d?.metro.logo}`" />
                </div>
                <div class="ml-2 whitespace-nowrap">
                  <div class="text-2xl tracking-[0.1em]">
                    {{ props.d?.metro.nameZh }}
                  </div>
                  <div class="text-[10px] tracking-wide">
                    {{ props.d?.metro.nameEn }}
                  </div>
                </div>
              </div>
              <div class="text-[56px] rounded-full flex items-center justify-center">
                <Icon :name="`university:${props.d?.university.logo}`" />
              </div>
            </div>

            <div
              class="border-t border-dashed mt-3 mb-1"
              :style="{ borderColor: props.cardTextColor }"
            />

            <div class="flex justify-between items-center">
              <div class="text-sm whitespace-nowrap">
                {{ props.formattedMetroName }}
              </div>
              <div class="whitespace-nowrap">
                {{ props.d?.university.nameZh }}
              </div>
            </div>

            <div class="mt-4 mb-14 flex justify-between items-end">
              <div>
                <div class="text-3xl font-semibold">
                  {{ props.d?.nextStation.titleZh }}
                </div>
                <div class="text-xs">
                  {{ props.d?.nextStation.titleEn }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-semibold">
                  {{ props.d?.nextStation.stationZh }}
                </div>
                <div class="text-xs">
                  {{ props.d?.nextStation.stationEn }}
                </div>
              </div>
            </div>

            <SubwayLine
              :stations="props.neighbors ?? []"
              :color="props.cardTextColor"
              :highlight-station-id="props.d?.metro.stationId"
            />

            <div class="flex justify-between items-center text-lg">
              <Icon
                v-for="n in 2"
                :key="n"
                name="icon:up-half-arrow"
              />
            </div>
          </div>

          <div
            class="relative h-9 flex items-center -mt-1"
            :style="{ backgroundColor: props.cardBackgroundColor }"
          >
            <div
              class="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              :style="props.screenBG"
            />
            <div
              class="flex-1 border-t-[6px] border-dotted mx-4"
              :style="{ borderColor: props.cardTextColor }"
            />
            <div
              class="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              :style="props.screenBG"
            />
          </div>

          <MottoCard
            class="-mt-1"
            :style="{ backgroundColor: props.cardBackgroundColor, color: props.cardTextColor, fontFamily: props.cardTextFont }"
            :cn-lines="props.d?.university.motto.cnLines ?? []"
            :en-lines="props.d?.university.motto.enLines ?? []"
          />
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
