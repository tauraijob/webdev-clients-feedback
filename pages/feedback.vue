<script setup lang="ts">
import FeedbackForm from '~/components/FeedbackForm.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Share Your Feedback
        </h2>
        <p class="mt-4 text-lg leading-6 text-gray-500">
          We value your opinion and would love to hear about your experience with our services.
        </p>
      </div>
      <FeedbackForm />
    </div>
  </div>
</template> 