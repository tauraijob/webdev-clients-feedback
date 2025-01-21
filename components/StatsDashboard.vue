<script setup lang="ts">
import { Line, Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement,
  ArcElement
)

const props = defineProps<{
  reviews: any[]
}>()

const emit = defineEmits(['filterByRating'])

// Define colors object at the top level
const chartColors = {
  'Very Satisfied': '#10B981',
  'Satisfied': '#34D399',
  'Neutral': '#FBBF24',
  'Unsatisfied': '#F97316',
  'Very Unsatisfied': '#EF4444'
}

const primaryColors = {
  DEFAULT: '#d4542c',
  light: '#e87f5f',
  lighter: '#f4b4a3',
  dark: '#bd4a27',
  darker: '#9c3e21'
}

// Define satisfaction categories
const getSatisfactionCategory = (rating: number) => {
  switch (rating) {
    case 5: return 'Very Satisfied'
    case 4: return 'Satisfied'
    case 3: return 'Neutral'
    case 2: return 'Unsatisfied'
    case 1: return 'Very Unsatisfied'
    default: return 'Unknown'
  }
}

// Monthly Reviews Trend with satisfaction levels
const monthlyData = computed(() => {
  const last6Months = new Array(6).fill(0).map((_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    // Format as "MMM YYYY" (e.g., "Feb 2024")
    return {
      label: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
      date: d
    }
  }).reverse()

  const satisfactionCategories = ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied']
  const datasets = satisfactionCategories.map((category) => {
    const counts = last6Months.map(month => {
      return props.reviews.filter(review => {
        const reviewDate = new Date(review.createdAt)
        const sameMonth = reviewDate.getMonth() === month.date.getMonth()
        const sameYear = reviewDate.getFullYear() === month.date.getFullYear()
        return sameMonth && sameYear && getSatisfactionCategory(review.rating) === category
      }).length
    })

    return {
      label: category,
      data: counts,
      borderColor: chartColors[category],
      backgroundColor: `${chartColors[category]}33`,
      tension: 0.3,
      fill: true
    }
  })

  return {
    labels: last6Months.map(m => m.label), // Use formatted labels
    datasets
  }
})

// Add this new color palette for services
const serviceColors = [
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#059669', // Green
  '#dc2626', // Red
  '#d97706', // Orange
  '#4f46e5', // Indigo
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#ca8a04', // Yellow
  '#be123c'  // Rose
]

// Service Distribution
const serviceData = computed(() => {
  const services = props.reviews.reduce((acc, review) => {
    acc[review.service] = (acc[review.service] || 0) + 1
    return acc
  }, {})

  return {
    labels: Object.keys(services).map(s => s.replace('_', ' ')),
    datasets: [{
      data: Object.values(services),
      backgroundColor: serviceColors,
      borderWidth: 1,
      hoverOffset: 4
    }]
  }
})

// Rating Distribution with color coding
const ratingData = computed(() => {
  const ratings = [1, 2, 3, 4, 5]
  const counts = ratings.map(rating => 
    props.reviews.filter(r => r.rating === rating).length
  )

  return {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Number of Reviews',
      data: counts,
      backgroundColor: [
        chartColors['Very Unsatisfied'],
        chartColors['Unsatisfied'],
        chartColors['Neutral'],
        chartColors['Satisfied'],
        chartColors['Very Satisfied']
      ],
      borderRadius: 6,
      hoverOffset: 4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

const barChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    tooltip: {
      callbacks: {
        label: (context) => {
          const rating = context.dataIndex + 1
          const count = context.raw
          return `${count} review${count !== 1 ? 's' : ''} (${rating} star${rating !== 1 ? 's' : ''})`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  },
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index
      const rating = index + 1
      emit('filterByRating', rating)
    }
  }
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        title: (context) => {
          // Format the tooltip title
          return context[0].label // Already formatted as "MMM YYYY"
        },
        label: (context) => {
          // Format the tooltip label
          const value = context.raw as number
          return `${context.dataset.label}: ${value} review${value !== 1 ? 's' : ''}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Monthly Trend -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Satisfaction Trends</h3>
      <div class="h-64">
        <Line 
          :data="monthlyData" 
          :options="lineChartOptions" 
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Service Distribution -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Service Distribution</h3>
        <div class="h-56">
          <Pie :data="serviceData" :options="chartOptions" />
        </div>
      </div>

      <!-- Rating Distribution -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
        <div class="h-56">
          <Bar 
            :data="ratingData" 
            :options="barChartOptions"
          />
        </div>
        <!-- Custom Legend -->
        <div class="mt-4 flex flex-wrap justify-center gap-4">
          <div v-for="(color, index) in ratingData.datasets[0].backgroundColor" 
               :key="index" 
               class="flex items-center">
            <div 
              class="w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: color }"
            ></div>
            <span class="text-sm text-gray-600">
              {{ index + 1 }} Star{{ index !== 0 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 