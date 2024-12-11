-- AlterTable
ALTER TABLE "H3Cell" ADD COLUMN     "dominantLanguage" TEXT;

-- AlterTable
ALTER TABLE "H3CellLanguageStat" ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "H3Cell_dominantLanguage_idx" ON "H3Cell"("dominantLanguage");
