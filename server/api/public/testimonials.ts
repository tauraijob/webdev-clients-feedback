import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    // Enable CORS for WordPress domain
    setResponseHeaders(event, {
        'Access-Control-Allow-Origin': 'https://reviews.devpreview.net',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
    })

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
                content: true,
                rating: true,
                clientName: true,
                companyName: true,
                service: true
            }
        })

        return {
            success: true,
            testimonials: testimonials.map(t => ({
                ...t,
                service: t.service.replace('_', ' '),
                stars: '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating)
            }))
        }
    } catch (error) {
        console.error('Failed to fetch testimonials:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch testimonials'
        })
    }
}) 