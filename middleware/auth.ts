export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie('admin_token')

    // If trying to access login page and already logged in
    if (to.path === '/auth/login' && token.value) {
        return navigateTo('/admin')
    }

    // If trying to access protected route and not logged in
    if (to.path === '/admin' && !token.value) {
        return navigateTo('/auth/login')
    }
}) 