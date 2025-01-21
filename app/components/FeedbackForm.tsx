'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const feedbackSchema = z.object({
    service: z.enum(['WEBSITE_DEVELOPMENT', 'HOSTING', 'DOMAIN_SALES', 'CONSULTING', 'MAINTENANCE']),
    content: z.string().min(10, 'Review must be at least 10 characters'),
    rating: z.number().min(1).max(5),
    clientEmail: z.string().email(),
    clientName: z.string().min(2),
    phoneNumber: z.string().optional(),
    userId: z.string(),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function FeedbackForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FeedbackForm>({
        resolver: zodResolver(feedbackSchema),
    });

    const onSubmit = async (data: FeedbackForm) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Submission failed');

            toast.success('Thank you for your feedback!');
            reset();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <select
                    {...register('service')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="WEBSITE_DEVELOPMENT">Website Development</option>
                    <option value="HOSTING">Hosting</option>
                    <option value="DOMAIN_SALES">Domain Sales</option>
                    <option value="CONSULTING">Consulting</option>
                    <option value="MAINTENANCE">Maintenance</option>
                </select>
                {errors.service && (
                    <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                    {...register('content')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            {...register('rating', { valueAsNumber: true })}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            ⭐
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        {...register('clientName')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.clientName && (
                        <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('clientEmail')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.clientEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.clientEmail.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <input
                    type="tel"
                    {...register('phoneNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </form>
    );
} 