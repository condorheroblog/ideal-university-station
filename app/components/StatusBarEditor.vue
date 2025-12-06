<script setup lang="ts">
import { snapdom } from '@zumer/snapdom'

const props = defineProps<{
  carrier: string
  signalLevel: number
  wifiLevel: number
  battery: number
  bgPreset: string
  useCustomBg: boolean
  bgFrom: string
  bgVia: string
  bgTo: string
  bgDeg: number
}>()
const emit = defineEmits<{
  (e: 'update:signalLevel' | 'update:wifiLevel' | 'update:battery' | 'update:bgDeg', v: number): void
  (e: 'update:useCustomBg', v: boolean): void
  (e: 'update:carrier' | 'update:bgPreset' | 'update:bgFrom' | 'update:bgVia' | 'update:bgTo', v: string): void
}>()

async function exportCard(format: 'png' | 'jpeg') {
  if (typeof window === 'undefined') return
  const el = document.getElementById('wallpaper-export')
  if (!el) return
  const result = await snapdom(el, {
    width: 1170,
    height: 2532,
    dpr: window.devicePixelRatio || 2,
    fast: true,
    scale: 1,
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
  <div class="space-y-4">
    <div>
      <div class="text-sm font-medium text-gray-700 mb-1">
        运营商
      </div>
      <input
        type="text"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        :value="props.carrier"
        @input="e => emit('update:carrier', (e.target as HTMLInputElement).value)"
      >
    </div>
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm font-medium text-gray-700">
          信号强度
        </div>
        <div class="text-xs text-gray-500">
          {{ props.signalLevel }}/4
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="4"
        step="1"
        class="w-full"
        :value="props.signalLevel"
        @input="e => emit('update:signalLevel', Number((e.target as HTMLInputElement).value))"
      >
    </div>
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm font-medium text-gray-700">
          Wi‑Fi 强度
        </div>
        <div class="text-xs text-gray-500">
          {{ props.wifiLevel }}/3
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="3"
        step="1"
        class="w-full"
        :value="props.wifiLevel"
        @input="e => emit('update:wifiLevel', Number((e.target as HTMLInputElement).value))"
      >
    </div>
    <div>
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm font-medium text-gray-700">
          电量
        </div>
        <div class="text-xs text-gray-500">
          {{ props.battery }}%
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        class="w-full"
        :value="props.battery"
        @input="e => emit('update:battery', Number((e.target as HTMLInputElement).value))"
      >
    </div>
    <div>
      <div class="text-sm font-medium text-gray-700 mb-1">
        背景渐变
      </div>
      <select
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        :value="props.bgPreset"
        @change="e => emit('update:bgPreset', (e.target as HTMLSelectElement).value)"
      >
        <option value="indigo">
          默认
        </option>
        <option value="aurora">
          Aurora
        </option>
        <option value="sunset">
          Sunset
        </option>
        <option value="ocean">
          Ocean
        </option>
        <option value="forest">
          Forest
        </option>
      </select>
      <div class="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          :checked="props.useCustomBg"
          @change="e => emit('update:useCustomBg', (e.target as HTMLInputElement).checked)"
        >
        <span class="text-sm text-gray-700">使用自定义</span>
      </div>
      <div
        v-if="props.useCustomBg"
        class="mt-3 grid grid-cols-3 gap-2"
      >
        <div>
          <div class="text-xs text-gray-500 mb-1">
            From
          </div>
          <input
            type="color"
            class="w-full h-8 p-0 border border-gray-300 rounded"
            :value="props.bgFrom"
            @input="e => emit('update:bgFrom', (e.target as HTMLInputElement).value)"
          >
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">
            Via
          </div>
          <input
            type="color"
            class="w-full h-8 p-0 border border-gray-300 rounded"
            :value="props.bgVia"
            @input="e => emit('update:bgVia', (e.target as HTMLInputElement).value)"
          >
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">
            To
          </div>
          <input
            type="color"
            class="w-full h-8 p-0 border border-gray-300 rounded"
            :value="props.bgTo"
            @input="e => emit('update:bgTo', (e.target as HTMLInputElement).value)"
          >
        </div>
        <div class="col-span-3 mt-2">
          <div class="flex items-center justify-between mb-1">
            <div class="text-sm font-medium text-gray-700">
              角度
            </div>
            <div class="text-xs text-gray-500">
              {{ props.bgDeg }}°
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            class="w-full"
            :value="props.bgDeg"
            @input="e => emit('update:bgDeg', Number((e.target as HTMLInputElement).value))"
          >
        </div>
      </div>
    </div>
    <div>
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
