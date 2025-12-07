<script setup lang="ts">
// 从 index.vue#L310-331 提取：底部操作按钮（手电筒 / 相机）
</script>

<template>
  <div class="absolute bottom-8 left-6">
    <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
      <Icon
        name="ri:flashlight-line"
        class="w-6 h-6 text-white"
      />
    </div>
  </div>
  <div class="absolute bottom-8 right-6">
    <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
      <Icon
        name="ri:camera-line"
        class="w-6 h-6 text-white"
      />
    </div>
  </div>

  <!-- 预留：上滑解锁提示（可按需启用） -->
  <!--
  <div class="absolute bottom-24 left-1/2 -translate-x-1/2">
    <div class="px-6 py-2 rounded-full bg-white/80 text-black text-sm backdrop-blur-sm shadow-md transition-transform duration-200 hover:scale-110 hover:-translate-y-0.5">
      上滑解锁
    </div>
  </div>
  -->
</template>
