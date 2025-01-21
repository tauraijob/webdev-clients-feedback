-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `service` ENUM('WEBSITE_DEVELOPMENT', 'HOSTING', 'DOMAIN_SALES', 'CONSULTING', 'MAINTENANCE') NOT NULL,
    `content` TEXT NOT NULL,
    `rating` INTEGER NOT NULL,
    `clientEmail` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
