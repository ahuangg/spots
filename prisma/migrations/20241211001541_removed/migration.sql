/*
  Warnings:

  - You are about to drop the column `savedH3Index` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `savedLanguage` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "savedH3Index",
DROP COLUMN "savedLanguage";
