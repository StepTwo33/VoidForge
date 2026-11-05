-- CreateTable
CREATE TABLE "SavedRiven" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "stats" TEXT NOT NULL,
    "polarity" TEXT NOT NULL DEFAULT 'universal',
    "drain" INTEGER NOT NULL DEFAULT 10,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SavedRiven_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SavedRiven_userId_idx" ON "SavedRiven"("userId");

-- CreateIndex
CREATE INDEX "SavedRiven_userId_weaponId_idx" ON "SavedRiven"("userId", "weaponId");
