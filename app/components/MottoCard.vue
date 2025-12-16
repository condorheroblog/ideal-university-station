<script setup lang="ts">
interface Props {
  cnLines: string[]
  enLines: string[]
}
const { cnLines, enLines } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1 items-center overflow-hidden whitespace-nowrap">
    <!-- 中文部分 -->
    <div class="flex gap-4 text-2xl tracking-[0.2em]">
      <span
        v-for="(l, i) in [...cnLines, ...cnLines, ...cnLines]"
        :key="`cn-${i}`"
      >
        <!-- {{ l }} -->
        <USkeleton class="bg-black/10 h-6 w-6" />
      </span>
    </div>
    <!-- 英文部分 -->
    <div class="flex gap-2 text-[8px]">
      <span
        v-for="(l, i) in [...enLines, ...enLines, ...enLines]"
        :key="`en-${i}`"
      >
        <!-- {{ l }} -->
        <USkeleton class="bg-black/10 h-6 w-6" />
      </span>
    </div>
  </div>
</template>
