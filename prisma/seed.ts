// @ts-check
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
    // Add reviews with specific dates
    const reviews = [
        // October 2024 Reviews
        {
            service: 'WEBSITE_DEVELOPMENT',
            content: 'Excellent work on our e-commerce website. The team was very professional.',
            rating: 5,
            clientEmail: 'john@example.com',
            clientName: 'John Smith',
            phoneNumber: '+263771234567',
            companyName: 'Tech Solutions Ltd',
            createdAt: new Date('2024-10-05'),
            updatedAt: new Date('2024-10-05')
        },
        {
            service: 'HOSTING',
            content: 'Good hosting service but had some minor downtime issues.',
            rating: 4,
            clientEmail: 'sarah@example.com',
            clientName: 'Sarah Brown',
            phoneNumber: '+263772345678',
            createdAt: new Date('2024-10-15'),
            updatedAt: new Date('2024-10-15')
        },
        {
            service: 'MAINTENANCE',
            content: 'Not entirely satisfied with the response time.',
            rating: 3,
            clientEmail: 'mike@example.com',
            clientName: 'Mike Johnson',
            companyName: 'Johnson Enterprises',
            createdAt: new Date('2024-10-25'),
            updatedAt: new Date('2024-10-25')
        },
        // November 2024 Reviews
        {
            service: 'CONSULTING',
            content: 'Outstanding consulting service. Really helped our business strategy.',
            rating: 5,
            clientEmail: 'lisa@example.com',
            clientName: 'Lisa Williams',
            phoneNumber: '+263773456789',
            companyName: 'Williams & Co',
            createdAt: new Date('2024-11-10'),
            updatedAt: new Date('2024-11-10')
        },
        {
            service: 'DOMAIN_SALES',
            content: 'Domain transfer process was a bit complicated.',
            rating: 2,
            clientEmail: 'david@example.com',
            clientName: 'David Chen',
            phoneNumber: '+263774567890',
            createdAt: new Date('2024-11-20'),
            updatedAt: new Date('2024-11-20')
        }
    ]

    // Create/Update admin
    await prisma.admin.upsert({
        where: {
            email: 'taurai@webdev.co.zw'
        },
        update: {
            password: await argon2.hash('DevTeam24.$.$.')
        },
        create: {
            email: 'taurai@webdev.co.zw',
            password: await argon2.hash('DevTeam24.$.$.')
        }
    })

    // Add reviews
    for (const review of reviews) {
        // Check if review already exists to avoid duplicates
        const exists = await prisma.review.findFirst({
            where: {
                clientEmail: review.clientEmail
            }
        })

        if (!exists) {
            await prisma.review.create({
                data: review
            })
            console.log(`Added review from ${review.clientName}`)
        }
    }

    const totalReviews = await prisma.review.count()
    console.log(`Total reviews in database: ${totalReviews}`)
}

await main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

