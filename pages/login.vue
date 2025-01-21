<script setup lang="ts">
const router = useRouter()
const credentials = ref({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

const login = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials.value
    })
    
    if (response.success) {
      router.push('/admin')
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (e) {
    error.value = 'Failed to login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img src="~/assets/images/logo1.jpg" alt="Logo" class="mx-auto h-12 w-auto" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Admin Login
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                type="email"
                required
                v-model="credentials.email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                type="password"
                required
                v-model="credentials.password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 