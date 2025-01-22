<script setup lang="ts">
import { exportToExcel, exportToPDF } from '~/utils/exportUtils'

definePageMeta({
  middleware: ['auth']
})

// Add session management
useSession()

const { data: reviews, refresh, error, pending } = await useFetch('/api/reviews')

// Initialize search and filter refs
const searchQuery = ref('')
const selectedService = ref('')
const selectedRating = ref('')
const testimonialFilter = ref('')

// Computed property for filtered reviews with null check
const filteredReviews = computed(() => {
  if (!reviews.value) return []
  
  return reviews.value.filter(review => {
    const matchesSearch = !searchQuery.value || 
      review.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.clientName.toLowerCase().includes(searchQuery.value.toLowerCase())
      
    const matchesService = !selectedService.value || review.service === selectedService.value
    const matchesRating = !selectedRating.value || review.rating === parseInt(selectedRating.value)
    const matchesTestimonial = testimonialFilter.value === '' || 
      review.isTestimonial === (testimonialFilter.value === 'true')
    
    return matchesSearch && matchesService && matchesRating && matchesTestimonial
  })
})

const deleteReview = async (reviewId: string) => {
  if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return
  
  try {
    await $fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    })
    refresh()
  } catch (error) {
    console.error('Failed to delete review:', error)
    alert('Failed to delete review')
  }
}

const handleRatingFilter = (rating: number) => {
  selectedRating.value = rating.toString()
  
  // Scroll to the reviews list
  const reviewsSection = document.querySelector('#reviews-list')
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const showExportOptions = ref(false)

const handleExport = (format: 'excel' | 'pdf') => {
  if (format === 'excel') {
    exportToExcel(filteredReviews.value)
  } else {
    exportToPDF(filteredReviews.value)
  }
  showExportOptions.value = false
}

const toggleTestimonial = async (review) => {
  try {
    const response = await $fetch(`/api/reviews/${review.id}/testimonial`, {
      method: 'PATCH',
      body: {
        isTestimonial: !review.isTestimonial
      }
    })
    
    if (response.success) {
      refresh()
    } else {
      throw new Error('Failed to update testimonial status')
    }
  } catch (error) {
    console.error('Failed to toggle testimonial:', error)
    alert(error.data?.message || 'Failed to update testimonial status')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />
    
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-900">WebDev Clients Feedback Admin</h1>
        </div>

        <!-- Key Metrics -->
        <StatsDashboard 
          v-if="reviews" 
          :reviews="reviews" 
          class="mb-8"
          @filter-by-rating="handleRatingFilter"
        />

        <!-- Filters Section -->
        <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Filter Reviews</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <!-- Search Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Search</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search by name or content..."
                  class="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">Search by client name or review content</p>
            </div>

            <!-- Service Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Service Type</label>
              <select
                v-model="selectedService"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Services</option>
                <option value="WEBSITE_DEVELOPMENT">Website Development</option>
                <option value="HOSTING">Hosting</option>
                <option value="DOMAIN_SALES">Domain Sales</option>
                <option value="CONSULTING">Consulting</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Filter by service type</p>
            </div>

            <!-- Rating Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Rating</label>
              <select
                v-model="selectedRating"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★☆</option>
                <option value="3">3 Stars ★★★☆☆</option>
                <option value="2">2 Stars ★★☆☆☆</option>
                <option value="1">1 Star ★☆☆☆☆</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Filter by rating</p>
            </div>

            <!-- Testimonial Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Testimonial Status</label>
              <select
                v-model="testimonialFilter"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">All Reviews</option>
                <option value="true">Testimonials Only</option>
                <option value="false">Non-Testimonials Only</option>
              </select>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="mt-6 flex justify-between items-center">
            <div class="text-sm text-gray-500">
              Showing {{ filteredReviews?.length || 0 }} of {{ reviews?.length || 0 }} reviews
            </div>
            <div class="flex space-x-3">
              <button
                @click="() => { searchQuery = ''; selectedService = ''; selectedRating = ''; testimonialFilter = '' }"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
              <div class="relative">
                <button
                  @click="showExportOptions = !showExportOptions"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Filtered Results
                </button>

                <!-- Export Options Dropdown -->
                <div v-if="showExportOptions" 
                     class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div class="py-1" role="menu">
                    <button
                      @click="handleExport('excel')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export to Excel
                    </button>
                    <button
                      @click="handleExport('pdf')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Export to PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <div id="reviews-list" class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Reviews ({{ filteredReviews?.length || 0 }})
              </h3>
              <span class="px-3 py-1 text-sm text-primary bg-primary-lightest rounded-full">
                {{ selectedService?.replace('_', ' ') || 'All Services' }}
              </span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="text-center py-12">
            <svg class="animate-spin h-8 w-8 mx-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Loading reviews...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 p-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Failed to load reviews</h3>
                <p class="mt-2 text-sm text-red-700">Please try refreshing the page.</p>
              </div>
            </div>
          </div>

          <!-- Reviews List -->
          <div v-else-if="filteredReviews && filteredReviews.length > 0">
            <div v-for="review in filteredReviews" 
                 :key="review.id" 
                 class="border-b border-gray-200 last:border-b-0">
              <div class="p-6 hover:bg-gray-50 transition duration-150">
                <div class="flex items-start space-x-6">
                  <!-- Rating Badge -->
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-full bg-primary-lightest flex items-center justify-center">
                      <span class="text-xl font-bold text-primary">{{ review.rating }}</span>
                    </div>
                  </div>

                  <!-- Review Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <h4 class="text-lg font-medium text-gray-900">
                          {{ review.clientName }}
                        </h4>
                        <div class="flex items-center mt-1">
                          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-lightest text-primary">
                            {{ review.service.replace('_', ' ') }}
                          </span>
                          <span class="mx-2 text-gray-300">•</span>
                          <span class="text-sm text-gray-500">
                            {{ new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) }}
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center space-x-4">
                        <div class="flex text-yellow-400">
                          <span v-for="i in 5" :key="i" class="text-lg">
                            {{ i <= review.rating ? '★' : '☆' }}
                          </span>
                        </div>
                        <button
                          @click="deleteReview(review.id)"
                          class="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors duration-150"
                          title="Delete Review"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          @click="toggleTestimonial(review)"
                          class="p-1.5 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100 transition-colors duration-150"
                          :title="review.isTestimonial ? 'Remove from Testimonials' : 'Add to Testimonials'"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2" 
                              :d="review.isTestimonial 
                                ? 'M5 13l4 4L19 7' 
                                : 'M12 4v16m8-8H4'"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="mt-4 text-gray-600">
                      <p class="text-base leading-relaxed">{{ review.content }}</p>
                    </div>

                    <div class="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                      <div class="flex items-center">
                        <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {{ review.clientEmail }}
                      </div>
                      <div v-if="review.phoneNumber" class="flex items-center">
                        <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {{ review.phoneNumber }}
                      </div>
                      <div v-if="review.companyName" class="flex items-center">
                        <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {{ review.companyName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ searchQuery ? 'Try adjusting your search or filter criteria.' : 'Get started by collecting some reviews.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 