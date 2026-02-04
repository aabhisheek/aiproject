-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "expenses_createdAt_idx" ON "expenses"("createdAt" DESC);
