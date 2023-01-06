/*
  Warnings:

  - You are about to drop the `_joinedservers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_roletouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_joinedservers` DROP FOREIGN KEY `_JoinedServers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_joinedservers` DROP FOREIGN KEY `_JoinedServers_B_fkey`;

-- DropForeignKey
ALTER TABLE `_roletouser` DROP FOREIGN KEY `_RoleToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_roletouser` DROP FOREIGN KEY `_RoleToUser_B_fkey`;

-- DropTable
DROP TABLE `_joinedservers`;

-- DropTable
DROP TABLE `_roletouser`;

-- CreateTable
CREATE TABLE `ServerMember` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `serverId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NULL,

    PRIMARY KEY (`serverId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServerMember` ADD CONSTRAINT `ServerMember_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServerMember` ADD CONSTRAINT `ServerMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServerMember` ADD CONSTRAINT `ServerMember_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
