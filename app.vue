<script setup lang="ts">
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-grow">
      <NuxtPage />
    </div>
    <Footer />
  </div>
</template>
