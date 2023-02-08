/*
  Warnings:

  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissionsonrole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servermember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `permissionsonrole` DROP FOREIGN KEY `PermissionsOnRole_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `permissionsonrole` DROP FOREIGN KEY `PermissionsOnRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_serverId_fkey`;

-- DropForeignKey
ALTER TABLE `servermember` DROP FOREIGN KEY `ServerMember_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `servermember` DROP FOREIGN KEY `ServerMember_serverId_fkey`;

-- DropForeignKey
ALTER TABLE `servermember` DROP FOREIGN KEY `ServerMember_userId_fkey`;

-- DropTable
DROP TABLE `permission`;

-- DropTable
DROP TABLE `permissionsonrole`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `servermember`;
