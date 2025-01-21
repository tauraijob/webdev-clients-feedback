import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const feedbackSchema = z.object({
    service: z.enum(['WEBSITE_DEVELOPMENT', 'HOSTING', 'DOMAIN_SALES', 'CONSULTING', 'MAINTENANCE']),
    content: z.string().min(10),
    rating: z.number().min(1).max(5),
    clientEmail: z.string().email(),
    clientName: z.string().min(2),
    phoneNumber: z.string().optional(),
    userId: z.string(),
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const validatedData = feedbackSchema.parse(body)

        const review = await prisma.review.create({
            data: {
                ...validatedData,
                status: 'PENDING',
            },
        })

        return { review }
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: JSON.stringify(error.errors),
            })
        }
        throw createError({
            statusCode: 500,
            message: 'Internal Server Error',
        })
    }
}) 