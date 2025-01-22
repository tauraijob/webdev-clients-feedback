-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `service` ENUM('WEBSITE_DEVELOPMENT', 'HOSTING', 'DOMAIN_SALES', 'CONSULTING', 'MAINTENANCE') NOT NULL,
    `content` TEXT NOT NULL,
    `rating` INTEGER NOT NULL,
    `clientEmail` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `isTestimonial` BOOLEAN NOT NULL DEFAULT false,
    `testimonialOrder` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
