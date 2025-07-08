/*
  Warnings:

  - You are about to drop the column `userId` on the `victorina` table. All the data in the column will be lost.
  - Added the required column `templateId` to the `Victorina` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `victorina` DROP FOREIGN KEY `Victorina_userId_fkey`;

-- DropIndex
DROP INDEX `Victorina_userId_fkey` ON `victorina`;

-- AlterTable
ALTER TABLE `victorina` DROP COLUMN `userId`,
    ADD COLUMN `answeredUserId` INTEGER NULL,
    ADD COLUMN `templateId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Victorina` ADD CONSTRAINT `Victorina_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `Template`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Victorina` ADD CONSTRAINT `Victorina_answeredUserId_fkey` FOREIGN KEY (`answeredUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
