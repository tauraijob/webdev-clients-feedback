import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log('Login attempt for:', body.email)

    try {
        const admin = await prisma.admin.findUnique({
            where: { email: body.email }
        })

        if (!admin) {
            console.log('Admin not found')
            throw createError({
                statusCode: 401,
                message: 'Invalid credentials'
            })
        }

        console.log('Verifying password...')
        const passwordMatch = await argon2.verify(admin.password, body.password)

        if (!passwordMatch) {
            console.log('Password mismatch')
            throw createError({
                statusCode: 401,
                message: 'Invalid credentials'
            })
        }

        console.log('Login successful')
        const token = 'admin_' + Math.random().toString(36).substr(2)

        setCookie(event, 'admin_token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax'
        })

        return {
            success: true,
            token,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        }
    } catch (error) {
        console.error('Login error:', error)
        throw createError({
            statusCode: 401,
            message: 'Invalid credentials'
        })
    }
}) 