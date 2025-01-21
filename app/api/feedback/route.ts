import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const feedbackSchema = z.object({
    service: z.enum(['WEBSITE_DEVELOPMENT', 'HOSTING', 'DOMAIN_SALES', 'CONSULTING', 'MAINTENANCE']),
    content: z.string().min(10),
    rating: z.number().min(1).max(5),
    clientEmail: z.string().email(),
    clientName: z.string().min(2),
    phoneNumber: z.string().optional(),
    userId: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = feedbackSchema.parse(body);

        const review = await prisma.review.create({
            data: {
                ...validatedData,
                status: 'PENDING',
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 