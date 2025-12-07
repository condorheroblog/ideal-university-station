<script setup lang="ts">
interface Props {
  title: string
  defaultOpen?: boolean
}
const props = defineProps<Props>()
const open = ref<boolean>(props.defaultOpen ?? false)
function toggle() {
  open.value = !open.value
}
</script>

<template>
  <div class="mb-4">
    <button
      type="button"
      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm flex items-center justify-between select-none hover:bg-gray-50"
      @click="toggle"
    >
      <span class="font-medium text-gray-700">{{ props.title }}</span>
      <Icon
        name="ri:arrow-down-s-line"
        class="w-5 h-5 text-gray-600 transition-transform"
        :class="open ? 'rotate-0' : 'rotate-180'"
      />
    </button>
    <div v-show="open" class="mt-3">
      <slot />
    </div>
  </div>
</template>
