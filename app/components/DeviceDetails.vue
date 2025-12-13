<script setup lang="ts">
// 右侧设备详情展示：从选中设备配置中读取并显示关键参数
import type { DeviceConfig } from '@/constants'

interface Props { device: DeviceConfig }
const props = defineProps<Props>()
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4">
    <div class="text-base font-semibold mb-3">设备详情</div>
    <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
      <div class="flex justify-between"><span>型号</span><span class="font-medium">{{ props.device.label }}</span></div>
      <div class="flex justify-between"><span>年份</span><span class="font-medium">{{ props.device.year }}</span></div>
      <div class="flex justify-between"><span>类型</span><span class="font-medium">{{ props.device.kind }}</span></div>
      <div class="flex justify-between"><span>分辨率</span><span class="font-medium">{{ props.device.resolution.width }}×{{ props.device.resolution.height }}</span></div>
      <div class="flex justify-between"><span>逻辑尺寸</span><span class="font-medium">{{ props.device.logical.width }}×{{ props.device.logical.height }}</span></div>
    </div>
  </div>
</template>
