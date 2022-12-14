-- AlterTable
ALTER TABLE `message` ADD COLUMN `isEdited` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `replyToId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
