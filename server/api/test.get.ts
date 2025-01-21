import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`
        console.log('Database connection successful')
        return { status: 'Database connection successful' }
    } catch (error) {
        console.error('Database connection error:', error)
        throw createError({
            statusCode: 500,
            message: 'Database connection failed'
        })
    }
}) 