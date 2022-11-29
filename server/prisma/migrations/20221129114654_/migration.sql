/*
  Warnings:

  - You are about to drop the `_servertouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_servertouser` DROP FOREIGN KEY `_ServerToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_servertouser` DROP FOREIGN KEY `_ServerToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_serverId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_userId_fkey`;

-- AlterTable
ALTER TABLE `server` ADD COLUMN `ownerId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_servertouser`;

-- DropTable
DROP TABLE `message`;

-- CreateTable
CREATE TABLE `_JoinedServers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_JoinedServers_AB_unique`(`A`, `B`),
    INDEX `_JoinedServers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Server` ADD CONSTRAINT `Server_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JoinedServers` ADD CONSTRAINT `_JoinedServers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Server`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JoinedServers` ADD CONSTRAINT `_JoinedServers_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
