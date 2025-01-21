import { createReview } from '../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const result = await createReview(body)

        if (result.success) {
            return { success: true, data: result.data }
        } else {
            throw createError({
                statusCode: 400,
                message: result.error || 'Failed to create review'
            })
        }
    } catch (error) {
        console.error('Server error:', error)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
}) 