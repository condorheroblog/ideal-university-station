<script setup lang="ts">
// 左侧设备型号选择组件：独立拆分，便于维护与复用
interface DeviceOption { id: string, label: string }
interface Props {
  deviceOptions: DeviceOption[]
  selectedDevice: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:selectedDevice', v: string): void
}>()
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4">
    <div class="text-base font-semibold mb-3">设备型号</div>
    <!-- 点击式小方块选择：高亮当前选中项 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <button
        v-for="opt in props.deviceOptions"
        :key="opt.id"
        type="button"
        class="h-10 rounded-md border text-xs px-2 flex items-center justify-center transition dark:bg-neutral-700 dark:text-gray-100"
        :class="[
          props.selectedDevice === opt.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-800 hover:bg-gray-50',
        ]"
        @click="emit('update:selectedDevice', opt.id)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
