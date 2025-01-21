<script setup lang="ts">
const { data: reviews } = await useFetch('/api/reviews')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 4
const selectedService = ref('')
const selectedRating = ref('')

// Computed property for filtered reviews
const filteredReviews = computed(() => {
  if (!reviews.value) return []
  
  return reviews.value.filter(review => {
    const matchesService = !selectedService.value || review.service === selectedService.value
    const matchesRating = !selectedRating.value || review.rating === parseInt(selectedRating.value)
    
    return matchesService && matchesRating
  })
})

// Computed property for paginated reviews
const paginatedReviews = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredReviews.value.slice(startIndex, endIndex)
})

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(filteredReviews.value.length / itemsPerPage)
})

// Reset pagination when filters change
watch([selectedService, selectedRating], () => {
  currentPage.value = 1
})

const resetFilters = () => {
  selectedService.value = ''
  selectedRating.value = ''
  currentPage.value = 1
}

// Add these for modal handling
const selectedReview = ref(null)
const isModalOpen = ref(false)

const openReviewModal = (review) => {
  selectedReview.value = review
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedReview.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Client Feedback
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          See what our clients have to say about our services on the WebDev Clients Feedback Platform
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-8">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <!-- Service Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Service</label>
            <select
              v-model="selectedService"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">All Services</option>
              <option value="WEBSITE_DEVELOPMENT">Website Development</option>
              <option value="HOSTING">Hosting</option>
              <option value="DOMAIN_SALES">Domain Sales</option>
              <option value="CONSULTING">Consulting</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          <!-- Rating Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Rating</label>
            <select
              v-model="selectedRating"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">All Ratings</option>
              <option v-for="rating in 5" :key="rating" :value="rating">
                {{ rating }} Star{{ rating !== 1 ? 's' : '' }}
              </option>
            </select>
          </div>

          <!-- Reset Button -->
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Grid -->
      <div class="grid gap-6 md:grid-cols-2">
        <div v-for="review in paginatedReviews" 
             :key="review.id" 
             class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
             @click="openReviewModal(review)"
        >
          <div class="flex items-start space-x-4">
            <!-- Rating Badge -->
            <div class="flex-shrink-0 relative">
              <div class="w-12 h-12 rounded-full bg-primary-lightest flex items-center justify-center">
                <span class="text-xl font-bold text-primary">{{ review.rating }}</span>
              </div>
              <div class="absolute -top-1 -right-1">
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-lg font-medium text-gray-900">{{ review.clientName }}</h4>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-lightest text-primary">
                  {{ review.service.replace('_', ' ') }}
                </span>
              </div>
              <p class="text-gray-600 line-clamp-3">{{ review.content }}</p>
              <div class="mt-2 text-sm text-gray-500">
                {{ new Date(review.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <!-- Previous Button -->
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Page Numbers -->
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              currentPage === page ? 'z-10 bg-primary-lightest border-primary text-primary' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
            ]"
          >
            {{ page }}
          </button>

          <!-- Next Button -->
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>

      <!-- Add Modal -->
      <ReviewModal
        v-if="selectedReview"
        :review="selectedReview"
        :is-open="isModalOpen"
        @close="closeModal"
      />
    </div>
  </div>
</template> 