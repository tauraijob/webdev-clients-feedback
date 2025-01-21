<script setup lang="ts">
import { ref } from 'vue'
import { createReview } from '../utils/db'

const formData = ref({
  service: '',
  content: '',
  rating: 0,
  clientName: '',
  clientEmail: '',
  phoneNumber: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await createReview(formData.value)
    
    if (result.success) {
      successMessage.value = 'Thank you for your feedback!'
      formData.value = {
        service: '',
        content: '',
        rating: 0,
        clientName: '',
        clientEmail: '',
        phoneNumber: '',
      }
    } else {
      errorMessage.value = result.error || 'Something went wrong'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to submit feedback'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Previous template code remains the same -->
</template> 