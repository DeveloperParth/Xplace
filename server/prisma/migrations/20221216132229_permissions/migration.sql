/*
  Warnings:

  - You are about to alter the column `name` on the `permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `permission` MODIFY `name` ENUM('invitePeople', 'kickPeople', 'banPeople', 'manageRoles', 'manageChannels', 'manageServer', 'manageInvites', 'manageMessages') NOT NULL;
