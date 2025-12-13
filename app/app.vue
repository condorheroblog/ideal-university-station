<script setup lang="ts">
useServerHead({
  htmlAttrs: { lang: 'en' },
})

useSeoMeta({
  titleTemplate: '理想大学站 | %s',
  description: '理想大学站',
  ogImage: 'https://github.com/user-attachments/assets/e2626b8f-21dc-4947-85ed-1ce708135ea9',
  ogImageAlt: '理想大学站',
  twitterImage: 'https://github.com/user-attachments/assets/e2626b8f-21dc-4947-85ed-1ce708135ea9',
  twitterSite: '@Condor2Hero',
  twitterCreator: '@Condor2Hero',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtPage />
</template>
