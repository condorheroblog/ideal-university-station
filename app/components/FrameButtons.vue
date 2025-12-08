<script setup lang="ts">
interface Size { w: number, h: number }
interface Props {
  kind: 'iphone' | 'ipad' | 'desktop'
  dims: Size
}
const props = defineProps<Props>()

const ratios = computed(() => {
  if (props.kind === 'ipad') return { left: [0.18, 0.33, 0.50], right: 0.40, lh: [0.06, 0.08, 0.08], rh: 0.12 }
  return { left: [0.18, 0.34, 0.48], right: 0.40, lh: [0.06, 0.10, 0.10], rh: 0.16 }
})

function leftStyle(idx: number) {
  const top = Math.round(props.dims.h * (ratios.value.left[idx] ?? 0))
  const h = Math.round(props.dims.h * (ratios.value.lh[idx] ?? 0.1))
  return { left: '-1px', top: `${top}px`, width: '4px', height: `${h}px` }
}
const rightStyle = computed(() => {
  const top = Math.round(props.dims.h * ratios.value.right)
  const h = Math.round(props.dims.h * ratios.value.rh)
  return { right: '-1px', top: `${top}px`, width: '4px', height: `${h}px` }
})
</script>

<template>
  <template v-if="kind !== 'desktop'">
    <div class="absolute bg-black rounded-l-md" :style="leftStyle(0)" />
    <div class="absolute bg-black rounded-l-md" :style="leftStyle(1)" />
    <div class="absolute bg-black rounded-l-md" :style="leftStyle(2)" />
    <div class="absolute bg-black rounded-r-md" :style="rightStyle" />
  </template>
</template>
