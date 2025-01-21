import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createReview = async (reviewData: any) => {
    try {
        const review = await prisma.review.create({
            data: {
                ...reviewData,
            },
        })
        return { success: true, data: review }
    } catch (error) {
        console.error('Database error:', error)
        return { success: false, error: 'Failed to save review' }
    }
} 