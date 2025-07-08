/*
  Warnings:

  - You are about to drop the column `questionName` on the `answer` table. All the data in the column will be lost.
  - Added the required column `question` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `answer` DROP COLUMN `questionName`,
    ADD COLUMN `question` VARCHAR(191) NOT NULL;
