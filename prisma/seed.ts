// @ts-check
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
    // Add more test reviews without deleting existing ones
    const reviews: any = [
        {
            service: 'WEBSITE_DEVELOPMENT',
            content: 'Outstanding website development. They understood our needs perfectly.',
            rating: 5,
            clientEmail: 'mark@example.com',
            clientName: 'Mark Johnson',
            phoneNumber: '1112223333'
        },
        {
            service: 'HOSTING',
            content: 'Had some issues with uptime initially, but support was helpful.',
            rating: 3,
            clientEmail: 'sarah@example.com',
            clientName: 'Sarah Williams',
            phoneNumber: '4445556666'
        },
        {
            service: 'DOMAIN_SALES',
            content: 'Very competitive pricing and smooth transfer process.',
            rating: 4,
            clientEmail: 'mike@example.com',
            clientName: 'Mike Brown',
            phoneNumber: null
        },
        {
            service: 'CONSULTING',
            content: 'Not entirely satisfied with the consultation. Expected more detailed insights.',
            rating: 2,
            clientEmail: 'emma@example.com',
            clientName: 'Emma Davis',
            phoneNumber: '7778889999'
        },
        {
            service: 'MAINTENANCE',
            content: 'Excellent maintenance service. Always responsive and proactive.',
            rating: 5,
            clientEmail: 'david@example.com',
            clientName: 'David Wilson',
            phoneNumber: null
        },

    ]

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

