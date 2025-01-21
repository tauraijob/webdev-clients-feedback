<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const credentials = ref({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)
const token = useCookie('admin_token')

const login = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Attempting login...')
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials.value
    })
    
    console.log('Login response:', response)
    
    if (response.success) {
      console.log('Login successful, setting token:', response.token)
      token.value = response.token
      console.log('Navigating to admin...')
      await router.push('/admin', { replace: true })
      window.location.reload()
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (e: any) {
    console.error('Login error:', e)
    error.value = e.data?.message || 'Failed to login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-lightest to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-8 shadow-2xl sm:rounded-xl space-y-8">
        <!-- Logo and Title -->
        <div class="text-center">
          <img src="~/assets/images/logo1.jpg" alt="Logo" class="mx-auto h-16 w-auto" />
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Access the WebDev Clients Feedback Platform
          </p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                required
                v-model="credentials.email"
                class="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                required
                v-model="credentials.password"
                class="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" 
               class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 transition-colors duration-200"
            >
              <span v-if="loading" class="absolute left-4">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <!-- Footer Links -->
        <div class="text-center">
          <p class="text-xs text-gray-500">
            By signing in, you agree to our
            <a href="#" class="text-primary hover:text-primary-dark">Terms of Service</a>
            and
            <a href="#" class="text-primary hover:text-primary-dark">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 