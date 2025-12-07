<script setup lang="ts">
import { snapdom } from '@zumer/snapdom'
import { SOLID_PRESETS } from '@/constants'
import StatusBarEditor from '@/components/StatusBarEditor.vue'

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
  useCustomCardBg: boolean
  cardBgFrom: string
  useCustomCardText: boolean
  cardTextFrom: string
  useCustomCardExternalText: boolean
  cardExternalTextFrom: string
  schoolOptions: SchoolOption[]
  selectedSchool: string
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
      | 'update:useCustomBg'
      | 'update:useCustomCardBg'
      | 'update:useCustomCardText'
      | 'update:useCustomCardExternalText'
      | 'update:cardBgFrom'
      | 'update:cardTextFrom'
      | 'update:cardExternalTextFrom'
      | 'update:selectedSchool',
    v: string | number | boolean
  ): void
}>()

// 编辑器：来自 index.vue#L312-331 的整体面板提取

const presetKeys = Object.keys(SOLID_PRESETS) as Array<keyof typeof SOLID_PRESETS>
const colorRef = ref<HTMLInputElement | null>(null)
const cardBgColorRef = ref<HTMLInputElement | null>(null)
const cardTextColorRef = ref<HTMLInputElement | null>(null)
const cardExternalTextColorRef = ref<HTMLInputElement | null>(null)

async function exportCard(format: 'png' | 'jpeg') {
  if (typeof window === 'undefined') return
  const el = document.getElementById('wallpaper-export')
  if (!el) return
  const bgColor = props.useCustomBg
    ? props.bgFrom
    : (SOLID_PRESETS[props.bgPreset as keyof typeof SOLID_PRESETS] ?? '#3730a3')
  const result = await snapdom(el, {
    width: 1170,
    height: 2532,
    dpr: window.devicePixelRatio || 2,
    fast: true,
    scale: 1,
    backgroundColor: bgColor,
  })
  const img = format === 'png'
    ? await result.toPng()
    : await result.toJpg()
  const a = document.createElement('a')
  a.href = img.src
  a.download = `iphone-wallpaper-card.${format === 'png' ? 'png' : 'jpg'}`
  document.body.appendChild(a)
  a.click()
  a.remove()
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="text-xl font-semibold mb-4">
      编辑器
    </div>

    <!-- 学校选择：扫描 @/assets/schools 的结果 -->
    <div class="mb-4">
      <div class="text-sm font-medium text-gray-700 mb-1">
        学校
      </div>
      <select
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        :value="props.selectedSchool"
        @change="e => emit('update:selectedSchool', (e.target as HTMLSelectElement).value)"
      >
        <option
          v-for="opt in props.schoolOptions"
          :key="opt.key"
          :value="opt.key"
        >
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- 顶部状态设置：复用 StatusBarEditor，仅保留 61-128 行内容 -->
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

    <!-- 主题预设选择 -->
    <div class="mt-4">
      <div class="text-sm font-medium text-gray-700 mb-1">
        系统预设主题
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="key in presetKeys"
          :key="key as string"
          type="button"
          class="w-8 h-8 rounded-md border transition-shadow"
          :class="(!props.useCustomBg && props.bgPreset === key) ? 'ring-2 ring-indigo-500' : 'ring-0'"
          :style="{ backgroundColor: SOLID_PRESETS[key] }"
          @click="() => { emit('update:bgPreset', key as string); emit('update:useCustomBg', false) }"
        />
      </div>
    </div>

    <!-- 屏幕颜色选择 -->
    <div class="flex justify-between items-center gap-2 mt-4">
      <div>
        <div class="text-sm font-medium text-gray-700 mb-1">
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
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              :value="props.bgFrom"
              @input="e => emit('update:bgFrom', (e.target as HTMLInputElement).value)"
            >
            <span class="absolute inset-0 rounded-md border border-white/60" />
          </button>
        </div>
      </div>
      <div>
        <div class="text-sm font-medium text-gray-700 mb-1">
          卡片背景颜色
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
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              :value="props.cardBgFrom"
              @input="e => emit('update:cardBgFrom', (e.target as HTMLInputElement).value)"
            >
            <span class="absolute inset-0 rounded-md border border-white/60" />
          </button>
        </div>
      </div>
      <div>
        <div class="text-sm font-medium text-gray-700 mb-1">
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
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              :value="props.cardTextFrom"
              @input="e => emit('update:cardTextFrom', (e.target as HTMLInputElement).value)"
            >
            <span class="absolute inset-0 rounded-md border border-white/60" />
          </button>
        </div>
      </div>
      <div>
        <div class="text-sm font-medium text-gray-700 mb-1">
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
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              :value="props.cardExternalTextFrom"
              @input="e => emit('update:cardExternalTextFrom', (e.target as HTMLInputElement).value)"
            >
            <span class="absolute inset-0 rounded-md border border-white/60" />
          </button>
        </div>
      </div>
    </div>

    <!-- 下载壁纸 -->
    <div class="mt-6">
      <div class="text-sm font-medium text-gray-700 mb-1">
        下载壁纸
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
          @click="exportCard('png')"
        >
          下载 PNG
        </button>
        <button
          class="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
          @click="exportCard('jpeg')"
        >
          下载 JPG
        </button>
      </div>
      <div class="text-xs text-gray-500 mt-1">
        导出尺寸 1170×2532，外部为屏幕背景色
      </div>
    </div>
  </div>
</template>
