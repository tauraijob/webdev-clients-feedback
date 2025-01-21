<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

// Add process type for TypeScript
declare const process: {
  dev: boolean
}

const { data: reviews, refresh, error, pending } = await useFetch('/api/reviews')

// Filtering
const searchQuery = ref('')
const selectedService = ref('')
const selectedRating = ref('')

const filteredReviews = computed(() => {
  if (!reviews.value) return []
  
  return reviews.value.filter(review => {
    const matchesSearch = !searchQuery.value || 
      review.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.clientName.toLowerCase().includes(searchQuery.value.toLowerCase())
      
    const matchesService = !selectedService.value || review.service === selectedService.value
    const matchesRating = !selectedRating.value || review.rating === parseInt(selectedRating.value)
    
    return matchesSearch && matchesService && matchesRating
  })
})

// Enhanced Statistics
const statistics = computed(() => {
  if (!reviews.value) return null
  
  const total = reviews.value.length
  const ratings = reviews.value.map(r => r.rating)
  const averageRating = ratings.reduce((acc, r) => acc + r, 0) / total
  
  // Service breakdown
  const serviceBreakdown = reviews.value.reduce((acc, review) => {
    acc[review.service] = (acc[review.service] || 0) + 1
    return acc
  }, {})

  // Satisfaction levels
  const satisfactionLevels = {
    verySatisfied: ratings.filter(r => r === 5).length,
    satisfied: ratings.filter(r => r === 4).length,
    neutral: ratings.filter(r => r === 3).length,
    unsatisfied: ratings.filter(r => r === 2).length,
    veryUnsatisfied: ratings.filter(r => r === 1).length
  }

  // Calculate percentages
  const satisfactionPercentages = {
    verySatisfied: (satisfactionLevels.verySatisfied / total * 100).toFixed(1),
    satisfied: (satisfactionLevels.satisfied / total * 100).toFixed(1),
    neutral: (satisfactionLevels.neutral / total * 100).toFixed(1),
    unsatisfied: (satisfactionLevels.unsatisfied / total * 100).toFixed(1),
    veryUnsatisfied: (satisfactionLevels.veryUnsatisfied / total * 100).toFixed(1)
  }

  // Monthly trends (last 6 months)
  const monthlyTrends = reviews.value.reduce((acc, review) => {
    const month = new Date(review.createdAt).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  return {
    total,
    averageRating: averageRating.toFixed(1),
    serviceBreakdown,
    satisfactionLevels,
    satisfactionPercentages,
    monthlyTrends
  }
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

// Export
const exportReviews = () => {
  const csv = [
    ['Date', 'Service', 'Rating', 'Content', 'Client Name', 'Client Email', 'Phone Number'],
    ...filteredReviews.value.map(review => [
      new Date(review.createdAt).toLocaleDateString(),
      review.service,
      review.rating,
      review.content,
      review.clientName,
      review.clientEmail,
      review.phoneNumber || ''
    ])
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'reviews.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

// Add error handling
watch(error, (newError) => {
  if (newError) {
    alert('Failed to load reviews. Please try refreshing the page.')
  }
})

// Add auto-refresh every 5 minutes
onMounted(() => {
  const interval = setInterval(() => {
    refresh()
  }, 5 * 60 * 1000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />
    
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Dashboard Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard Overview
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            @click="refresh"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            @click="exportReviews"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div v-if="statistics" class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ statistics.total }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ statistics.averageRating }}</div>
                    <span class="ml-2 text-sm font-medium text-gray-500">out of 5</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Satisfaction Rate -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Satisfaction Rate</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ Number(statistics.satisfactionPercentages.verySatisfied) + Number(statistics.satisfactionPercentages.satisfied) }}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Satisfaction Breakdown -->
      <div class="mb-8 bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Satisfaction</h3>
        <div class="space-y-4">
          <div v-for="(percentage, level) in statistics?.satisfactionPercentages" :key="level" class="relative">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-600 capitalize">
                {{ level.replace(/([A-Z])/g, ' $1').trim() }}
              </span>
              <span class="text-sm font-medium text-gray-600">{{ percentage }}%</span>
            </div>
            <div class="overflow-hidden h-2 bg-gray-200 rounded">
              <div
                class="h-full rounded"
                :style="{
                  width: `${percentage}%`,
                  backgroundColor: level.includes('very') ? 
                    (level.includes('un') ? '#EF4444' : '#10B981') : 
                    (level.includes('un') ? '#F59E0B' : '#3B82F6')
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Distribution -->
      <div class="mb-8 bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Service Distribution</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(count, service) in statistics?.serviceBreakdown" :key="service" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-600">{{ service.replace('_', ' ') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ count }}</span>
            </div>
            <div class="mt-2 overflow-hidden h-2 bg-gray-200 rounded">
              <div
                class="h-full bg-indigo-600 rounded"
                :style="{ width: `${(count / statistics.total * 100)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-8">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search reviews..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Service</label>
            <select
              v-model="selectedService"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Services</option>
              <option value="WEBSITE_DEVELOPMENT">Website Development</option>
              <option value="HOSTING">Hosting</option>
              <option value="DOMAIN_SALES">Domain Sales</option>
              <option value="CONSULTING">Consulting</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Rating</label>
            <select
              v-model="selectedRating"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="exportReviews"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export to CSV
          </button>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-6 py-5 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Reviews ({{ filteredReviews.length }})
            </h3>
            <span class="px-3 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-full">
              {{ selectedService || 'All Services' }}
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-12">
          <svg class="animate-spin h-8 w-8 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        <div v-else-if="filteredReviews.length > 0" class="divide-y divide-gray-200">
          <div v-for="review in filteredReviews" :key="review.id" class="p-6 hover:bg-gray-50 transition duration-150">
            <div class="flex items-start space-x-6">
              <!-- Rating Badge -->
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <span class="text-xl font-bold text-indigo-600">{{ review.rating }}</span>
                </div>
              </div>

              <!-- Review Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900">
                      {{ review.clientName }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      {{ review.service.replace('_', ' ') }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="flex text-yellow-400">
                      <span v-for="i in 5" :key="i" class="text-lg">
                        {{ i <= review.rating ? '★' : '☆' }}
                      </span>
                    </div>
                    <button
                      @click="deleteReview(review.id)"
                      class="ml-4 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                      title="Delete Review"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mt-4">
                  <p class="text-gray-600">{{ review.content }}</p>
                </div>

                <div class="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                  <div class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ review.clientEmail }}
                  </div>
                  <div v-if="review.phoneNumber" class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ review.phoneNumber }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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
</template> 