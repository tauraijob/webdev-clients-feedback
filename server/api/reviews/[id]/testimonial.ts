import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    const body = await readBody(event)

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Review ID is required'
        })
    }

    try {
        // First check if review exists
        const existingReview = await prisma.review.findUnique({
            where: { id }
        })

        if (!existingReview) {
            throw createError({
                statusCode: 404,
                message: 'Review not found'
            })
        }

        // Update the review
        const review = await prisma.review.update({
            where: { id },
            data: {
                isTestimonial: body.isTestimonial,
                testimonialOrder: body.isTestimonial
                    ? await getNextTestimonialOrder()
                    : null
            }
        })

        console.log('Updated review:', review) // Add logging
        return { success: true, review }
    } catch (error) {
        console.error('Failed to update testimonial status:', error)

        // More specific error messages
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                message: 'Testimonial order conflict'
            })
        }

        throw createError({
            statusCode: 500,
            message: `Failed to update testimonial status: ${error.message}`
        })
    }
})

async function getNextTestimonialOrder() {
    try {
        const maxOrder = await prisma.review.aggregate({
            _max: {
                testimonialOrder: true
            },
            where: {
                isTestimonial: true
            }
        })
        return (maxOrder._max.testimonialOrder || 0) + 1
    } catch (error) {
        console.error('Failed to get next testimonial order:', error)
        throw error
    }
} 