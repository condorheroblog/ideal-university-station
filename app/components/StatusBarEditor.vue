<script setup lang="ts">
// 仅保留状态栏编辑区块：来源 StatusBarEditor.vue#L61-128
const props = defineProps<{
  carrier: string
  signalLevel: number
  wifiLevel: number
  battery: number
}>()
const emit = defineEmits<{
  (e: 'update:signalLevel' | 'update:wifiLevel' | 'update:battery', v: number): void
  (e: 'update:carrier', v: string): void
}>()
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
  </div>
</template>
