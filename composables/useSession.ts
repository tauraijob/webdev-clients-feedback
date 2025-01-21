import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

export const useSession = (timeout = 30 * 60 * 1000) => { // Default 30 minutes
    const router = useRouter()
    const token = useCookie('admin_token')
    let timeoutId: NodeJS.Timeout | null = null
    const lastActivity = ref(Date.now())

    const resetTimer = () => {
        if (timeoutId) clearTimeout(timeoutId)
        lastActivity.value = Date.now()

        timeoutId = setTimeout(async () => {
            // Auto logout
            token.value = null
            await router.push('/auth/login')
            alert('Your session has expired. Please login again.')
        }, timeout)
    }

    const setupActivityListeners = () => {
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer)
        })
    }

    const cleanupActivityListeners = () => {
        if (timeoutId) clearTimeout(timeoutId)
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.removeEventListener(event, resetTimer)
        })
    }

    onMounted(() => {
        if (token.value) {
            setupActivityListeners()
            resetTimer()
        }
    })

    onBeforeUnmount(() => {
        cleanupActivityListeners()
    })

    return {
        lastActivity,
        resetTimer
    }
} 