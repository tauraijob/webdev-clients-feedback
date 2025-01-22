import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
    try {
        const testimonials = await prisma.review.findMany({
            where: {
                isTestimonial: true,
                rating: {
                    gte: 4 // Only show 4 and 5 star reviews
                }
            },
            orderBy: {
                testimonialOrder: 'asc'
            },
            select: {
                id: true,
                content: true,
                rating: true,
                clientName: true,
                companyName: true,
                service: true
            }
        })
        return testimonials
    } catch (error) {
        console.error('Failed to fetch testimonials:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch testimonials'
        })
    }
}) 