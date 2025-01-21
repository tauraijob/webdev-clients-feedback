export default defineEventHandler((event) => {
    deleteCookie(event, 'admin_token')
    return {
        success: true
    }
}) 