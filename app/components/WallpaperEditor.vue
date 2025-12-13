<script setup lang="ts">
import { snapdom } from '@zumer/snapdom'
import { SOLID_PRESETS, DEVICE_CONFIGS, PRESET_THEMES } from '@/constants'
import StatusBarEditor from '@/components/StatusBarEditor.vue'

import { filenameDateStamp } from '@/utils'
import { createZip } from '@/utils/zip'

interface SnapResult {
  toBlob?: (opts: { type: 'png' | 'jpeg' }) => Promise<Blob>
  download: (opts: { filename: string, type: 'png' | 'jpeg' }) => Promise<void>
}

interface SchoolOption {
  key: string
  label: string
}
interface Props {
  carrier: string
  signalLevel: number
  wifiLevel: number
  battery: number
  bgPreset: string
  useCustomBg: boolean
  bgFrom: string
  bgImageFrom: string
  useCustomCardBg: boolean
  cardBgFrom: string
  useCustomCardText: boolean
  cardTextFrom: string
  useCustomCardExternalText: boolean
  cardExternalTextFrom: string
  schoolOptions: SchoolOption[]
  selectedSchool: string
  selectedDevice: string
  kind: string
  enableLiquidGlass: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (
    e:
      | 'update:carrier'
      | 'update:signalLevel'
      | 'update:wifiLevel'
      | 'update:battery'
      | 'update:bgPreset'
      | 'update:bgFrom'
      | 'update:bgImageFrom'
      | 'update:useCustomBg'
      | 'update:useCustomCardBg'
      | 'update:useCustomCardText'
      | 'update:useCustomCardExternalText'
      | 'update:cardBgFrom'
      | 'update:cardTextFrom'
      | 'update:cardExternalTextFrom'
      | 'update:selectedSchool'
      | 'update:selectedDevice'
      | 'update:enableLiquidGlass',
    v: string | number | boolean
  ): void
}>()

// 编辑器：来自 index.vue#L312-331 的整体面板提取

const presetKeys = Object.keys(SOLID_PRESETS) as Array<keyof typeof SOLID_PRESETS>
const colorRef = ref<HTMLInputElement | null>(null)
const cardBgColorRef = ref<HTMLInputElement | null>(null)
const cardTextColorRef = ref<HTMLInputElement | null>(null)
const cardExternalTextColorRef = ref<HTMLInputElement | null>(null)
const deviceConf = computed(() => DEVICE_CONFIGS[props.selectedDevice as keyof typeof DEVICE_CONFIGS])
const schoolMenuItems = computed(() => props.schoolOptions.map(o => ({ label: o.label, value: o.key })))

// 导出参数：图片格式与倍数（默认 PNG、1 倍）
const exportFormat = ref<'png' | 'jpeg'>('png')
const exportScale = ref<number>(1)
const exportScaleOptions = [0.2, 0.5, 1, 2]
const uploadFile = ref<File | null>(null)

function onFileUpload(file: File | null | undefined) {
  uploadFile.value = file ?? null
  const f = uploadFile.value
  if (!f || !f.type?.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => emit('update:bgImageFrom', String(reader.result ?? ''))
  reader.readAsDataURL(f)
}

function clearUpload() {
  uploadFile.value = null
  emit('update:bgImageFrom', '')
}

async function exportCard(format?: 'png' | 'jpeg') {
  if (typeof window === 'undefined') return
  const el = document.getElementById('wallpaper-export')
  if (!el) return
  const bgColor = props.useCustomBg
    ? props.bgFrom
    : (SOLID_PRESETS[props.bgPreset as keyof typeof SOLID_PRESETS] ?? '#3730a3')
  const useImage = Boolean(props.bgImageFrom)

  const result = await snapdom(el, {
    width: deviceConf.value?.resolution.width ?? 1170,
    height: deviceConf.value?.resolution.height ?? 2532,
    dpr: window.devicePixelRatio || 2,
    fast: true,
    scale: exportScale.value,
    ...(useImage ? {} : { backgroundColor: bgColor }),
  }) as SnapResult

  // 下载格式：{deviceType}_{selectedSchool}_2025-12-07_150720_246.png
  const now = new Date()
  const fmt = format ?? exportFormat.value
  const filename = `${props.kind}-${props.selectedSchool}-${filenameDateStamp(now)}.${fmt}`
  await result.download({ filename, type: fmt })
}

async function exportAllPresets(format?: 'png' | 'jpeg') {
  if (typeof window === 'undefined') return
  const el = document.getElementById('wallpaper-export')
  if (!el) return
  const files: Array<{ name: string, blob: Blob }> = []
  const original = {
    bgPreset: props.bgPreset,
    bgFrom: props.bgFrom,
    useCustomBg: props.useCustomBg,
    useCustomCardBg: props.useCustomCardBg,
    useCustomCardText: props.useCustomCardText,
    useCustomCardExternalText: props.useCustomCardExternalText,
    cardBgFrom: props.cardBgFrom,
    cardTextFrom: props.cardTextFrom,
    cardExternalTextFrom: props.cardExternalTextFrom,
  }
  for (const key of presetKeys) {
    const preset = PRESET_THEMES[key]
    emit('update:bgPreset', key as unknown as string)
    emit('update:bgFrom', SOLID_PRESETS[key])
    emit('update:useCustomBg', false)
    emit('update:useCustomCardBg', false)
    emit('update:useCustomCardText', false)
    emit('update:useCustomCardExternalText', false)
    emit('update:cardBgFrom', preset.card.bg)
    emit('update:cardTextFrom', preset.card.text)
    emit('update:cardExternalTextFrom', preset.card.external)
    await nextTick()
    await new Promise(r => setTimeout(r, 50))
    const result = await snapdom(el, {
      width: deviceConf.value?.resolution.width ?? 1170,
      height: deviceConf.value?.resolution.height ?? 2532,
      dpr: window.devicePixelRatio || 2,
      fast: true,
      scale: exportScale.value,
      backgroundColor: SOLID_PRESETS[key],
    }) as unknown as SnapResult
    const now = new Date()
    const fmt = format ?? exportFormat.value
    const filename = `${props.kind}-${String(key)}-${props.selectedSchool}-${filenameDateStamp(now)}.${fmt}`
    const blob = await result.toBlob!({ type: fmt })
    files.push({ name: filename, blob })
  }
  emit('update:bgPreset', original.bgPreset as unknown as string)
  emit('update:bgFrom', original.bgFrom)
  emit('update:useCustomBg', original.useCustomBg)
  emit('update:useCustomCardBg', original.useCustomCardBg)
  emit('update:useCustomCardText', original.useCustomCardText)
  emit('update:useCustomCardExternalText', original.useCustomCardExternalText)
  emit('update:cardBgFrom', original.cardBgFrom)
  emit('update:cardTextFrom', original.cardTextFrom)
  emit('update:cardExternalTextFrom', original.cardExternalTextFrom)
  const zipBlob = await createZip(files)
  const zipName = `${props.kind}-presets-${props.selectedSchool}-${filenameDateStamp(new Date())}.zip`
  const a = document.createElement('a')
  a.href = URL.createObjectURL(zipBlob)
  a.download = zipName
  a.click()
}
async function exportDevice(format?: 'png' | 'jpeg') {
  if (typeof window === 'undefined') return
  const el = document.getElementById('device-export')
  if (!el) return
  const result = await snapdom(el, {
    width: deviceConf.value?.resolution.width ?? 1170,
    height: deviceConf.value?.resolution.height ?? 2532,
    dpr: window.devicePixelRatio || 2,
    fast: true,
    scale: exportScale.value,
  }) as SnapResult
  const now = new Date()
  const fmt = format ?? exportFormat.value
  const filename = `${props.kind}-${props.selectedDevice}-${props.selectedSchool}-${filenameDateStamp(now)}.${fmt}`
  await result.download({ filename, type: fmt })
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 flex flex-col gap-4">
    <div class="text-xl font-semibold flex gap-2 items-center">
      <!-- 编辑器 -->
      <USwitch
        label="液态玻璃"
        :model-value="props.enableLiquidGlass"
        class="ml-2"
        @update:model-value="v => emit('update:enableLiquidGlass', v as boolean)"
      />
    </div>

    <!-- 上传背景图片 -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          背景图片
        </div>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          @click="clearUpload"
        >
          清除
        </UButton>
      </div>
      <div class="flex items-center gap-3">
        <UFileUpload
          v-model="uploadFile"
          accept="image/*"
          color="neutral"
          variant="area"
          layout="list"
          class="w-full"
          label="在这里上传你的图片，支持拖拽"
          description="SVG, PNG, JPG or GIF"
          @update:model-value="onFileUpload"
        />

        <!-- 暂时用不到了，使用 UFileUpload 自带的组件 -->
        <!-- <div
          v-if="props.bgImageFrom"
          class="w-20 h-12 rounded-md border bg-cover bg-center"
          :style="{ backgroundImage: `url(${props.bgImageFrom})` }"
        /> -->
      </div>
      <div class="text-xs text-gray-500 mt-1">
        支持 JPG/PNG，上传后用于屏幕背景展示
      </div>
    </div>

    <!-- 学校选择：扫描 @/assets/schools 的结果 -->
    <div>
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        学校
      </div>
      <UInputMenu
        :items="schoolMenuItems"
        label-key="label"
        value-key="value"
        :model-value="props.selectedSchool"
        placeholder="搜索学校"
        class="w-full"
        @update:model-value="v => emit('update:selectedSchool', String(v))"
      />
    </div>

    <UAccordion :items="[{ label: '状态栏设置', slot: 'status' }]">
      <template #status>
        <StatusBarEditor
          :carrier="props.carrier"
          :signal-level="props.signalLevel"
          :wifi-level="props.wifiLevel"
          :battery="props.battery"
          @update:carrier="v => emit('update:carrier', v)"
          @update:signal-level="v => emit('update:signalLevel', v)"
          @update:wifi-level="v => emit('update:wifiLevel', v)"
          @update:battery="v => emit('update:battery', v)"
        />
      </template>
    </UAccordion>

    <!-- 主题预设选择 -->
    <div class="mt-4">
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        系统预设主题
      </div>
      <div class="flex flex-wrap items-center gap-2 cursor-pointer">
        <button
          v-for="key in presetKeys"
          :key="key as string"
          type="button"
          class="w-8 h-8 rounded-md border transition-shadow text-white/90"
          :class="(!props.useCustomBg && props.bgPreset === key) ? 'ring-2 ring-indigo-500' : 'ring-0'"
          :style="{ backgroundColor: SOLID_PRESETS[key] }"
          @click="() => {
            const k = key as keyof typeof SOLID_PRESETS
            emit('update:bgPreset', k as unknown as string)
            emit('update:bgFrom', SOLID_PRESETS[k])
            emit('update:useCustomBg', false)
            emit('update:useCustomCardBg', false)
            emit('update:useCustomCardText', false)
            emit('update:useCustomCardExternalText', false)
            const preset = PRESET_THEMES[k]
            emit('update:cardBgFrom', preset.card.bg)
            emit('update:cardTextFrom', preset.card.text)
            emit('update:cardExternalTextFrom', preset.card.external)
          }"
        >
          {{ key?.toUpperCase() }}
        </button>
      </div>
    </div>

    <!-- 自定义主题 -->
    <div class="mt-4">
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        自定义主题
      </div>
      <div class="flex flex-wrap justify-between items-center gap-2">
        <div>
          <!-- 屏幕颜色选择 -->
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            屏幕颜色
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-8 h-8 rounded-md border transition-shadow relative"
              :class="props.useCustomBg ? 'ring-2 ring-indigo-500' : 'ring-0'"
              :style="{ backgroundColor: props.bgFrom }"
              @click="() => { emit('update:useCustomBg', true); colorRef?.showPicker?.() }"
            >
              <input
                ref="colorRef"
                type="color"
                alpha
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :value="props.bgFrom"
                @input="e => emit('update:bgFrom', (e.target as HTMLInputElement).value)"
              >
              <span class="absolute inset-0 rounded-md border border-white/60" />
            </button>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            卡片背景
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-8 h-8 rounded-md border transition-shadow relative"
              :class="props.useCustomCardBg ? 'ring-2 ring-indigo-500' : 'ring-0'"
              :style="{ backgroundColor: props.cardBgFrom }"
              @click="() => { emit('update:useCustomCardBg', true); cardBgColorRef?.showPicker?.() }"
            >
              <input
                ref="cardBgColorRef"
                type="color"
                alpha
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :value="props.cardBgFrom"
                @input="e => emit('update:cardBgFrom', (e.target as HTMLInputElement).value)"
              >
              <span class="absolute inset-0 rounded-md border border-white/60" />
            </button>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            卡片文字颜色
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-8 h-8 rounded-md border transition-shadow relative"
              :class="props.useCustomCardText ? 'ring-2 ring-indigo-500' : 'ring-0'"
              :style="{ backgroundColor: props.cardTextFrom }"
              @click="() => { emit('update:useCustomCardText', true); cardTextColorRef?.showPicker?.() }"
            >
              <input
                ref="cardTextColorRef"
                type="color"
                alpha
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :value="props.cardTextFrom"
                @input="e => emit('update:cardTextFrom', (e.target as HTMLInputElement).value)"
              >
              <span class="absolute inset-0 rounded-md border border-white/60" />
            </button>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            卡片外部文字颜色
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-8 h-8 rounded-md border transition-shadow relative"
              :class="props.useCustomCardExternalText ? 'ring-2 ring-indigo-500' : 'ring-0'"
              :style="{ backgroundColor: props.cardExternalTextFrom }"
              @click="() => { emit('update:useCustomCardExternalText', true); cardExternalTextColorRef?.showPicker?.() }"
            >
              <input
                ref="cardExternalTextColorRef"
                type="color"
                alpha
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :value="props.cardExternalTextFrom"
                @input="e => emit('update:cardExternalTextFrom', (e.target as HTMLInputElement).value)"
              >
              <span class="absolute inset-0 rounded-md border border-white/60" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 固定底部操作：图片格式、倍数选择 + 三项操作平铺 -->
    <div class="sticky bottom-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-700 dark:text-gray-300">图片格式</span>
          <button
            type="button"
            class="px-3 py-1 rounded-md border text-xs"
            :class="exportFormat === 'png' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-neutral-600'"
            @click="exportFormat = 'png'"
          >
            PNG
          </button>
          <button
            type="button"
            class="px-3 py-1 rounded-md border text-xs"
            :class="exportFormat === 'jpeg' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-neutral-600'"
            @click="exportFormat = 'jpeg'"
          >
            JPG
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-700 dark:text-gray-300">倍数</span>
          <button
            v-for="opt in exportScaleOptions"
            :key="opt"
            type="button"
            class="px-2 py-1 rounded-md border text-xs"
            :class="exportScale === opt ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-neutral-600'"
            @click="exportScale = opt"
          >
            {{ opt }}x
          </button>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button
          class="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
          @click="exportCard(exportFormat)"
        >
          下载卡片
        </button>
        <button
          class="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
          @click="exportDevice(exportFormat)"
        >
          导出预览
        </button>
        <button
          class="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
          @click="exportAllPresets(exportFormat)"
        >
          批量下载
        </button>
      </div>
    </div>
  </div>
</template>
