<script setup lang="ts">
import StatusSignal from '@/components/StatusSignal.vue'
import StatusWifi from '@/components/StatusWifi.vue'
import StatusBattery from '@/components/StatusBattery.vue'

interface Props {
  carrier: string
  signalLevel: number
  wifiLevel: number
  battery: number
}
const props = defineProps<Props>()

// 从 index.vue#L141-150 提取：顶部状态栏（运营商/信号/Wi-Fi/电量）
</script>

<template>
  <div class="absolute top-0 left-0 right-0 h-12 text-white flex items-center justify-between px-4 text-[11px]">
    <span class="whitespace-nowrap">{{ props.carrier }}</span>
    <div class="flex flex-col items-center relative">
      <div class="flex items-center gap-1">
        <StatusSignal :level="props.signalLevel" />
        <StatusWifi :level="props.wifiLevel" />
        <StatusBattery :percent="props.battery" />
      </div>
      <div class="absolute -bottom-1.5 w-3/4 h-0.5 bg-white/40 rounded-full" />
    </div>
  </div>
</template>
