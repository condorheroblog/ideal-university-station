<script setup lang="ts">
import type { UniversityCardJSON } from '~~/types'

import WallpaperEditor from '@/components/WallpaperEditor.vue'
import DeviceFrame from '@/components/DeviceFrame.vue'
import ScreenContent from '@/components/ScreenContent.vue'
import FrameButtons from '@/components/FrameButtons.vue'
// 新增：左侧设备选择与右侧设备详情、预览缩放控件组件
import DeviceSelector from '../components/DeviceSelector.vue'
import DeviceDetails from '../components/DeviceDetails.vue'
import PreviewControls from '../components/PreviewControls.vue'
import HeaderBar from '../components/HeaderBar.vue'
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

// 学校数据：从 @/assets/schools 扫描并提供下拉选择
const schoolModules = import.meta.glob('~/assets/schools/*.json', { eager: true }) as Record<string, { default: UniversityCardJSON }>
type SchoolOption = { key: string, path: string, label: string }
const schoolOptions: SchoolOption[] = Object.entries(schoolModules).map(([path, mod]) => {
  const key = mod.default?.key ?? path
  const label = (mod.default?.title ?? key)
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
const bgImageFrom = ref('')

const screenHex = computed(() => useCustomBg.value ? bgFrom.value : SOLID_PRESETS[bgPreset.value])
const screenBG = computed(() => ({
  backgroundColor: screenHex.value,
  backgroundImage: bgImageFrom.value ? `url(${bgImageFrom.value})` : undefined,
  backgroundSize: bgImageFrom.value ? 'cover' : undefined,
  backgroundPosition: bgImageFrom.value ? 'center' : undefined,
  backgroundRepeat: bgImageFrom.value ? 'no-repeat' : undefined,
}))

const useCustomCardBg = ref(false)
const cardBgFrom = ref('#ffffff')
const useCustomCardText = ref(false)
const cardTextFrom = ref('#1A41A1')
const useCustomCardExternalText = ref(false)
const cardExternalTextFrom = ref('#ffffff')
const cardTextFont = ref('system-ui')
const cardExternalTextFont = ref('system-ui')

const enableLiquidGlass = ref(false)

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
const currentKind = computed(() => currentDevice.value.kind)
// 预览缩放：使用 transform: scale，不改变容器尺寸，避免影响布局
const zoom = ref(0.8)
function setZoom(next: number) {
  // 约束缩放范围，避免过小或过大
  zoom.value = Math.max(0.4, Math.min(2.0, Number(next.toFixed(2))))
}
function incZoom() {
  setZoom(zoom.value + 0.1)
}
function decZoom() {
  setZoom(zoom.value - 0.1)
}

// 容器基准宽度：根据窗口大小自适应，缩放不影响该值
const previewWidth = ref(360)
let resizeHandler: (() => void) | null = null
onMounted(() => {
  const handler = () => {
    if (typeof window === 'undefined') return
    const w = Math.floor(window.innerWidth * 0.85)
    previewWidth.value = Math.min(900, Math.max(280, w))
  }
  resizeHandler = handler
  window.addEventListener('resize', handler)
  handler()
})
onUnmounted(() => {
  if (typeof window !== 'undefined' && resizeHandler) window.removeEventListener('resize', resizeHandler)
})

// 预览区域容器尺寸：使用设备 logical 比例按基准宽度计算
const frameDims = computed(() => {
  const lw = currentDevice.value.logical.width
  const lh = currentDevice.value.logical.height
  const fw = Math.min(previewWidth.value, lw)
  const fh = Math.round(lh * (fw / lw))
  return { w: fw, h: fh }
})
const frameStyle = computed(() => {
  const iphoneExtraHeight = currentKind.value === 'iphone' ? 20 : 0
  return {
    width: `${frameDims.value.w}px`,
    height: `${frameDims.value.h - iphoneExtraHeight}px`,
    borderRadius: currentKind.value === 'iphone' ? `${Math.round(frameDims.value.w * (48 / 360))}px` : '20px',
    transform: `scale(${zoom.value})`,
    transformOrigin: 'center',
  }
})
const screenStyle = computed(() => ({
  ...screenBG.value,
  borderRadius: currentKind.value === 'iphone' ? `${Math.round(frameDims.value.w * (40 / 360))}px` : '20px',
}))
</script>

<template>
  <section class="h-screen bg-gray-100 dark:bg-gray-900">
    <HeaderBar />
    <!-- PC 布局：由两列改为三列，左右固定宽度，中间自适应；三列等高，外层无滚动，列内部可滚动 -->
    <div
      class="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px] gap-4 lg:h-[calc(100vh-48px-12px-12px)]"
    >
      <!-- 左列：设备型号选择 + 设备详情（内部滚动） -->
      <div class="lg:h-full overflow-auto space-y-4 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
        <DeviceSelector
          v-model:selected-device="selectedDevice"
          :device-options="deviceOptions"
        />
        <DeviceDetails :device="currentDevice" />
      </div>

      <!-- 中列：预览区域（内部滚动） -->
      <div class="lg:h-full overflow-auto flex justify-center relative">
        <DeviceFrame
          :style-obj="frameStyle"
          :kind="currentKind"
        >
          <FrameButtons
            v-if="currentKind === 'iphone' || currentKind === 'ipad'"
            :kind="currentKind"
            :dims="frameDims"
          />
          <ScreenContent
            v-model:enable-liquid-glass="enableLiquidGlass"
            :current-kind="currentKind"
            :carrier="carrier"
            :signal-level="signalLevel"
            :wifi-level="wifiLevel"
            :battery="battery"
            :date-text="dateText"
            :time-text="timeText"
            :screen-style="screenStyle"
            :card-background-color="cardBackgroundColor"
            :card-text-color="cardTextColor"
            :card-text-font="cardTextFont"
            :card-external-text-color="cardExternalTextColor"
            :card-external-text-font="cardExternalTextFont"
            :neighbors="neighbors"
            :d="d"
            :formatted-metro-name="formattedMetroName"
            :data-pending="dataPending"
            :data-error="dataError"
          />
        </DeviceFrame>
        <!-- 预览缩放控件：右上角悬浮，不占据布局空间 -->
        <PreviewControls
          class="absolute top-2 right-2 z-20"
          :logical="currentDevice.logical"
          :zoom="zoom"
          @inc="incZoom"
          @dec="decZoom"
          @set="setZoom"
          @reset="() => setZoom(1)"
        />
      </div>

      <!-- 右列：编辑器（内部滚动） -->
      <WallpaperEditor
        v-model:carrier="carrier"
        v-model:signal-level="signalLevel"
        v-model:wifi-level="wifiLevel"
        v-model:battery="battery"
        v-model:bg-preset="bgPreset"
        v-model:use-custom-bg="useCustomBg"
        v-model:bg-from="bgFrom"
        v-model:bg-image-from="bgImageFrom"
        v-model:use-custom-card-bg="useCustomCardBg"
        v-model:card-bg-from="cardBgFrom"
        v-model:use-custom-card-text="useCustomCardText"
        v-model:card-text-from="cardTextFrom"
        v-model:use-custom-card-external-text="useCustomCardExternalText"
        v-model:card-external-text-from="cardExternalTextFrom"
        v-model:selected-school="selectedSchool"
        v-model:selected-device="selectedDevice"
        v-model:enable-liquid-glass="enableLiquidGlass"
        class="lg:h-full overflow-auto"
        :school-options="schoolOptions"
        :kind="currentKind"
      />
    </div>
  </section>
</template>

<style>
/* 优化：使用更常用、对比度更高的颜色 */
html {
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 transparent;
}
@media (prefers-color-scheme: dark) {
  html {
    scrollbar-color: #606060 transparent;
  }
}
</style>
