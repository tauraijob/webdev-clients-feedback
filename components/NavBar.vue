<script setup lang="ts">
const router = useRouter()
const token = useCookie('admin_token')

const logout = async () => {
  if (!confirm('Are you sure you want to log out?')) return
  
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    token.value = null
    await router.push('/auth/login', { replace: true })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <NuxtLink to="/" class="flex items-center text-gray-900 font-medium">
            <img src="~/assets/images/logo1.jpg" alt="Logo" class="h-8 w-auto mr-2" />
            WebDev Clients Feedback
          </NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
          <NuxtLink 
            to="/reviews" 
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-lightest"
          >
            View Reviews
          </NuxtLink>
          
          <!-- Only show Admin + Logout when already logged in -->
          <template v-if="token">
            <NuxtLink 
              to="/admin" 
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-lightest"
            >
              Admin
            </NuxtLink>
            <button 
              @click="logout"
              class="px-3 py-2 rounded-md text-sm font-medium text-primary hover:text-primary-dark hover:bg-primary-lightest"
            >
              Logout
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template> 