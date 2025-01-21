<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  service: '',
  content: '',
  rating: 0,
  clientName: '',
  clientEmail: '',
  phoneNumber: '',
  companyName: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch('/api/reviews', {
      method: 'POST',
      body: formData.value
    })
    
    if (response.success) {
      successMessage.value = 'Thank you for your feedback!'
      formData.value = {
        service: '',
        content: '',
        rating: 0,
        clientName: '',
        clientEmail: '',
        phoneNumber: '',
        companyName: '',
      }
    } else {
      errorMessage.value = 'Something went wrong'
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
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Share Your Feedback
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          We value your opinion and would love to hear about your experience with our services.
        </p>
      </div>

      <form @submit.prevent="submitForm" class="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
        <!-- Service Selection -->
        <div>
          <label for="service" class="block text-sm font-medium text-gray-700">Service</label>
          <select
            id="service"
            v-model="formData.service"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          >
            <option value="">Select a service</option>
            <option value="WEBSITE_DEVELOPMENT">Website Development</option>
            <option value="HOSTING">Hosting</option>
            <option value="DOMAIN_SALES">Domain Sales</option>
            <option value="CONSULTING">Consulting</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <!-- Review Content -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700">Your Review</label>
          <textarea
            id="content"
            v-model="formData.content"
            rows="4"
            required
            minlength="10"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Please share your experience..."
          />
        </div>

        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Rating</label>
          <div class="flex gap-2 mt-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="formData.rating = star"
              class="p-2 text-2xl transition-colors"
              :class="star <= formData.rating ? 'text-primary' : 'text-gray-300 hover:text-primary-lighter'"
            >
              ★
            </button>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="clientName" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="clientName"
              type="text"
              v-model="formData.clientName"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label for="clientEmail" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="clientEmail"
              type="email"
              v-model="formData.clientEmail"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <!-- Phone Number and Company Name Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Phone Number -->
          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
              Phone Number (Optional)
            </label>
            <input
              id="phoneNumber"
              type="tel"
              v-model="formData.phoneNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <!-- Company Name -->
          <div>
            <label for="companyName" class="block text-sm font-medium text-gray-700">
              Company Name (Optional)
            </label>
            <input
              id="companyName"
              type="text"
              v-model="formData.companyName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <!-- Error and Success Messages -->
        <div v-if="errorMessage" class="p-4 bg-red-50 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="p-4 bg-green-50 text-green-700 rounded-md">
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting || !formData.rating"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#d4542c] hover:bg-[#bd4a27] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4542c] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
        </button>
      </form>
    </div>
  </div>
</template> 