/*
  Warnings:

  - You are about to drop the column `languageStats` on the `H3Cell` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "H3Cell" DROP COLUMN "languageStats";

-- CreateTable
CREATE TABLE "H3CellLanguageStat" (
    "id" SERIAL NOT NULL,
    "h3CellIndex" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "H3CellLanguageStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "H3CellLanguageStat_h3CellIndex_language_key" ON "H3CellLanguageStat"("h3CellIndex", "language");

-- AddForeignKey
ALTER TABLE "H3CellLanguageStat" ADD CONSTRAINT "H3CellLanguageStat_h3CellIndex_fkey" FOREIGN KEY ("h3CellIndex") REFERENCES "H3Cell"("index") ON DELETE RESTRICT ON UPDATE CASCADE;
