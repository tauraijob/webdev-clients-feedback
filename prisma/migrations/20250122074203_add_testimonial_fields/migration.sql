-- AlterTable
ALTER TABLE `review` ADD COLUMN `isTestimonial` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `testimonialOrder` INTEGER NULL;
