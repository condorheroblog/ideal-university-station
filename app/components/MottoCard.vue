<script setup lang="ts">
interface Props {
  cnLines: string[]
  enLines: string[]
}
const { cnLines, enLines } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1 items-center rounded-b-2xl overflow-hidden bg-white text-purple-800 shadow-sm pb-2">
    <!-- 中文部分 -->
    <div class="flex gap-2">
      <div
        v-for="(l, i) in cnLines"
        :key="`cn-${i}`"
        class="text-2xl font-bold tracking-widest text-purple-700"
      >
        {{ l }}
      </div>
    </div>
    <!-- 英文部分 -->
    <div class="flex gap-2">
      <div
        v-for="(l, i) in enLines"
        :key="`en-${i}`"
        class="text-xs text-purple-500"
      >
        {{ l }}
      </div>
    </div>
  </div>
</template>
