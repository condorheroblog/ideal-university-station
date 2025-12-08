<script setup lang="ts">
import type { CardMetroType } from '~~/types'

import WallpaperEditor from '@/components/WallpaperEditor.vue'
import MottoCard from '@/components/MottoCard.vue'
import SubwayLine from '@/components/SubwayLine.vue'
import FrameButtons from '@/components/FrameButtons.vue'
import StatusBar from '@/components/StatusBar.vue'
import DateTimeDisplay from '@/components/DateTimeDisplay.vue'
import BottomActions from '@/components/BottomActions.vue'
import WidgetDisplay from '@/components/WidgetDisplay.vue'
import { SOLID_PRESETS, PRESET_THEMES, DEVICE_CONFIGS, DEVICE_OPTIONS } from '@/constants'
import { getLineNeighbors } from '@/utils'

const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const timeText = computed(() => {
  const d = now.value ?? new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
})
const dateText = computed(() => {
  const d = now.value ?? new Date()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${month} 月 ${day} 日 週${week}`
})

const battery = ref(85)
const carrier = ref('中国移动')
const signalLevel = ref(3)
const wifiLevel = ref(3)

type UniversityCardJSON = {
  metro: CardMetroType
  headerExternal: { title: string, subtitle: string, icon: string }
  nextStation: { titleZh: string, titleEn: string, stationZh: string, stationEn: string }
  university: {
    logo: string
    nameZh: string
    nameEn: string
    motto: { cnLines: string[], enLines: string[] }
  }
}

// 学校数据：从 @/assets/schools 扫描并提供下拉选择
const schoolModules = import.meta.glob('~/assets/schools/*.json', { eager: true }) as Record<string, { default: UniversityCardJSON }>
type SchoolOption = { key: string, path: string, label: string }
const schoolOptions: SchoolOption[] = Object.entries(schoolModules).map(([path, mod]) => {
  const key = path.split('/').pop()?.replace('.json', '') ?? path
  const label = (mod.default?.university?.nameZh ?? key)
  return { key, path, label }
})
const selectedSchool = ref<string>(schoolOptions[0]?.key ?? '')
const selectedPath = computed(() => schoolOptions.find(o => o.key === selectedSchool.value)?.path ?? '')
const { data: schoolData, pending: dataPending, error: dataError } = await useAsyncData<UniversityCardJSON>('school-data', async () => {
  const mod = selectedPath.value ? schoolModules[selectedPath.value] : undefined
  return Promise.resolve(mod?.default as UniversityCardJSON)
}, { watch: [selectedPath] })
const d = computed<UniversityCardJSON | undefined>(() => schoolData.value as unknown as UniversityCardJSON | undefined)

const neighbors = computed(() => {
  const metro = d.value?.metro
  if (!metro) return []
  return getLineNeighbors(metro.subway, metro.lineName, metro.stationId)
})

type SolidKey = keyof typeof SOLID_PRESETS
const bgPreset = ref<SolidKey>('c1')
const useCustomBg = ref(false)
const bgFrom = ref('#0B3B9B')

const screenHex = computed(() => useCustomBg.value ? bgFrom.value : SOLID_PRESETS[bgPreset.value])
const screenBG = computed(() => ({ backgroundColor: screenHex.value }))

const useCustomCardBg = ref(false)
const cardBgFrom = ref('#ffffff')
const useCustomCardText = ref(false)
const cardTextFrom = ref('#1A41A1')
const useCustomCardExternalText = ref(false)
const cardExternalTextFrom = ref('#ffffff')
const cardTextFont = ref('system-ui')
const cardExternalTextFont = ref('system-ui')

const mappedCard = computed(() => {
  const preset = PRESET_THEMES[bgPreset.value as keyof typeof PRESET_THEMES]
  return preset?.card ?? { bg: '#fff', text: '#1A41A1', external: '#fff' }
})

watch(mappedCard, (val) => {
  if (!useCustomCardBg.value) cardBgFrom.value = val.bg
  if (!useCustomCardText.value) cardTextFrom.value = val.text
  if (!useCustomCardExternalText.value) cardExternalTextFrom.value = val.external
}, { immediate: true })

const cardBackgroundColor = computed(() => useCustomCardBg.value ? cardBgFrom.value : mappedCard.value.bg)
const cardTextColor = computed(() => useCustomCardText.value ? cardTextFrom.value : mappedCard.value.text)
const cardExternalTextColor = computed(() => useCustomCardExternalText.value ? cardExternalTextFrom.value : mappedCard.value.external)

// 格式化地铁线路名：在数字前后加空格
const formattedMetroName = computed(() => {
  const name = d.value?.metro.nameZh ?? ''
  const line = d.value?.metro.lineName ?? ''
  // 在数字前后加空格
  const spacedLine = line.replace(/(\d+)/g, ' $1 ')
  return `${name}${spacedLine}`
})

type DeviceId = keyof typeof DEVICE_CONFIGS
const deviceOptions = DEVICE_OPTIONS
const selectedDevice = ref<DeviceId>('iphone17')
const currentDevice = computed(() => DEVICE_CONFIGS[selectedDevice.value])
// const deviceAspect = computed(() => currentDevice.value.resolution.height / currentDevice.value.resolution.width)
const previewWidth = ref(360)
let resizeHandler: (() => void) | null = null
onMounted(() => {
  const handler = () => {
    if (typeof window === 'undefined') return
    const w = Math.floor(window.innerWidth * 0.85)
    previewWidth.value = Math.min(360, Math.max(280, w))
  }
  resizeHandler = handler
  handler()
  if (typeof window !== 'undefined') window.addEventListener('resize', handler)
})
onUnmounted(() => {
  if (typeof window !== 'undefined' && resizeHandler) window.removeEventListener('resize', resizeHandler)
})
// const previewHeight = computed(() => Math.round(previewWidth.value * deviceAspect.value))
// 使用 logical 中的 width 和 height，去掉自己计算的逻辑
const frameStyle = computed(() => ({
  width: `${currentDevice.value.logical.width}px`,
  height: `${currentDevice.value.logical.height - 20}px`,
  borderRadius: `${Math.round(currentDevice.value.logical.width * (48 / 360))}px`,
}))
const screenStyle = computed(() => ({ ...screenBG.value, borderRadius: `${Math.round(previewWidth.value * (40 / 360))}px` }))
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto max-w-[1200px]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="flex justify-center">
          <div class="relative">
            <div
              id="device-export"
              class="relative bg-black p-4 shadow-2xl"
              :style="frameStyle"
            >
              <!-- 外边框按钮：提取为组件 -->
              <FrameButtons />

              <div
                class="w-full h-full relative overflow-hidden"
                :style="screenStyle"
              >
                <!-- 状态栏：提取为组件 -->
                <StatusBar
                  :carrier="carrier"
                  :signal-level="signalLevel"
                  :wifi-level="wifiLevel"
                  :battery="battery"
                />

                <!-- 日期时间：提取为组件 -->
                <DateTimeDisplay
                  :date-text="dateText"
                  :time-text="timeText"
                />

                <!-- 小组件 -->
                <WidgetDisplay
                  :date-text="dateText"
                  :time-text="timeText"
                />

                <!-- 卡片：外层 div 用于占位，保证导出时卡片在下方位置 -->
                <div
                  id="wallpaper-export"
                  class="absolute top-0 left-0 right-0 bottom-0"
                >
                  <div
                    class="px-6 absolute right-0 left-0 bottom-[15%] tracking-wide"
                  >
                    <div
                      v-if="dataPending"
                      class="animate-pulse space-y-4"
                    >
                      <div class="h-6 bg-white/20 rounded" />
                      <div class="h-40 bg-white/20 rounded" />
                    </div>
                    <div
                      v-else-if="dataError"
                      class="text-sm text-red-600"
                    >
                      数据加载失败
                    </div>
                    <div v-else>
                      <!-- 卡片外部固定内容 -->
                      <div
                        class="mx-4 my-1 flex items-center justify-between text-md tracking-widest border-b border-dotted"
                        :style="{ color: cardExternalTextColor, borderColor: cardExternalTextColor, fontFamily: cardExternalTextFont }"
                      >
                        <!-- 文字固定 -->
                        <span class="whitespace-nowrap font-light tracking-[.3em]">{{ d?.headerExternal.title }}</span>
                        <div class="flex items-end gap-1">
                          <!-- 文字固定 -->
                          <span class="text-[7px]">{{ d?.headerExternal.subtitle }}</span>
                          <Icon :name="d?.headerExternal.icon ?? 'icon:train-line'" />
                        </div>
                      </div>
                      <div
                        class="w-full rounded-t-2xl overflow-hidden text-purple-800 shadow-sm px-4 pt-4"
                        :style="{ backgroundColor: cardBackgroundColor, color: cardTextColor, fontFamily: cardTextFont }"
                      >
                        <!-- 卡片 Header -->
                        <div class="flex justify-between items-center">
                          <div class="flex items-center">
                            <div class="text-[48px] rounded-full flex items-center justify-center">
                              <Icon :name="`metro:${d?.metro.logo}`" />
                            </div>
                            <div class="ml-2 whitespace-nowrap">
                              <!-- 地铁中文名 -->
                              <div class="text-2xl tracking-[0.1em]">
                                {{ d?.metro.nameZh }}
                              </div>
                              <!-- 地铁英文名 -->
                              <div class="text-[10px] tracking-wide">
                                {{ d?.metro.nameEn }}
                              </div>
                            </div>
                          </div>
                          <!-- 大学学校 Logo 图 -->
                          <div
                            class="text-[56px] rounded-full flex items-center justify-center"
                          >
                            <Icon :name="`university:${d?.university.logo}`" />
                          </div>
                        </div>

                        <div
                          class="border-t border-dashed mt-3 mb-1"
                          :style="{ borderColor: cardTextColor }"
                        />

                        <div class="flex justify-between items-center">
                          <!-- 地铁线路名 -->
                          <div class="text-sm whitespace-nowrap">
                            {{ formattedMetroName }}
                          </div>
                          <!-- 大学学校名 -->
                          <div class="whitespace-nowrap">
                            {{ d?.university.nameZh }}
                          </div>
                        </div>

                        <div class="mt-4 mb-14 flex justify-between items-end">
                          <div>
                            <!-- 固定文字 -->
                            <div class="text-3xl font-semibold">
                              {{ d?.nextStation.titleZh }}
                            </div>
                            <div class="text-xs">
                              {{ d?.nextStation.titleEn }}
                            </div>
                          </div>
                          <!-- 下一站站点名 -->
                          <div class="text-right">
                            <!-- 下一站站点中文名 -->
                            <div class="text-3xl font-semibold">
                              {{ d?.nextStation.stationZh }}
                            </div>
                            <!-- 下一站站点英文名 -->
                            <div class="text-xs">
                              {{ d?.nextStation.stationEn }}
                            </div>
                          </div>
                        </div>

                        <!-- 地铁线路图 -->
                        <SubwayLine
                          :stations="neighbors ?? []"
                          :color="cardTextColor"
                          :highlight-station-id="d?.metro.stationId"
                        />

                        <!-- 卡片箭头 -->
                        <div class="flex justify-between items-center text-lg">
                          <Icon
                            v-for="n in 2"
                            :key="n"
                            name="icon:up-half-arrow"
                          />
                        </div>
                      </div>

                      <!-- 卡片左右缺口 -->
                      <div
                        class="relative h-9 flex items-center -mt-1"
                        :style="{ backgroundColor: cardBackgroundColor }"
                      >
                        <!-- 左侧圆点 -->
                        <div
                          class="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                          :style="screenBG"
                        />
                        <!-- 虚线 -->
                        <div
                          class="flex-1 border-t-[4px] border-dotted mx-4"
                          :style="{ borderColor: cardTextColor }"
                        />
                        <!-- 右侧圆点 -->
                        <div
                          class="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                          :style="screenBG"
                        />
                      </div>

                      <!-- 校训：卡片底部内容 -->
                      <MottoCard
                        class="-mt-1"
                        :style="{ backgroundColor: cardBackgroundColor, color: cardTextColor, fontFamily: cardTextFont }"
                        :cn-lines="d?.university.motto.cnLines ?? []"
                        :en-lines="d?.university.motto.enLines ?? []"
                      />
                    </div>
                  </div>
                </div>

                <!-- 底部操作：提取为组件 -->
                <BottomActions />

                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/70" />
              </div>
            </div>
          </div>
        </div>

        <!-- 编辑器面板：提取为组件 -->
        <WallpaperEditor
          v-model:carrier="carrier"
          v-model:signal-level="signalLevel"
          v-model:wifi-level="wifiLevel"
          v-model:battery="battery"
          v-model:bg-preset="bgPreset"
          v-model:use-custom-bg="useCustomBg"
          v-model:bg-from="bgFrom"
          v-model:use-custom-card-bg="useCustomCardBg"
          v-model:card-bg-from="cardBgFrom"
          v-model:use-custom-card-text="useCustomCardText"
          v-model:card-text-from="cardTextFrom"
          v-model:use-custom-card-external-text="useCustomCardExternalText"
          v-model:card-external-text-from="cardExternalTextFrom"
          v-model:selected-school="selectedSchool"
          v-model:selected-device="selectedDevice"
          :school-options="schoolOptions"
          :device-options="deviceOptions"
        />
      </div>
    </div>
  </div>
</template>
