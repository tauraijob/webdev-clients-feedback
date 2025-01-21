import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
    try {
        const hashedPassword = await argon2.hash('admin123')

        const admin = await prisma.admin.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin User'
            }
        })

        console.log('Created admin user:', admin)
    } catch (error) {
        console.error('Error creating admin:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main() 