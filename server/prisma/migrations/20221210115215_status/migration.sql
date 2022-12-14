-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('Online', 'Offline', 'Idle', 'DND') NOT NULL DEFAULT 'Offline';
