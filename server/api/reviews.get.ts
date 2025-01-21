import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return reviews
    } catch (error) {
        console.error('Failed to fetch reviews:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch reviews'
        })
    }
}) 