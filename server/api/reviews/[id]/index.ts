import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Review ID is required'
        })
    }

    if (event.method === 'DELETE') {
        try {
            await prisma.review.delete({
                where: { id }
            })
            return { success: true }
        } catch (error) {
            console.error('Failed to delete review:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to delete review'
            })
        }
    }

    if (event.method === 'PATCH') {
        try {
            const body = await readBody(event)
            const review = await prisma.review.update({
                where: { id },
                data: body
            })
            return review
        } catch (error) {
            console.error('Failed to update review:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to update review'
            })
        }
    }

    throw createError({
        statusCode: 405,
        message: 'Method not allowed'
    })
}) 