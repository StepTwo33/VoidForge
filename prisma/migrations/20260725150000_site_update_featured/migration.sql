-- AlterTable
ALTER TABLE "SiteUpdate" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- DropIndex
DROP INDEX IF EXISTS "SiteUpdate_published_createdAt_idx";

-- CreateIndex
CREATE INDEX "SiteUpdate_published_featured_createdAt_idx" ON "SiteUpdate"("published", "featured", "createdAt");
