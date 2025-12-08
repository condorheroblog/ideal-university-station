<script setup lang="ts">
import type { CSSProperties } from 'vue'

interface Props {
  styleObj: CSSProperties
  kind: 'iphone' | 'ipad' | 'desktop'
}
const props = defineProps<Props>()
</script>

<template>
  <div
    id="device-export"
    class="relative bg-black p-4 shadow-2xl"
    :style="props.styleObj"
  >
    <slot />
  </div>
</template>

