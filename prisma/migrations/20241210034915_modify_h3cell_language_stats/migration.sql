/*
  Warnings:

  - The `languageStats` column on the `H3Cell` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "H3Cell" DROP COLUMN "languageStats",
ADD COLUMN     "languageStats" JSONB NOT NULL DEFAULT '{}';
