/*
  Warnings:

  - You are about to drop the column `referer` on the `ViewData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ViewData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "referrer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ViewData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ViewData_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ViewData" ("count", "createdAt", "duration", "id", "pageId", "sessionId", "updatedAt") SELECT "count", "createdAt", "duration", "id", "pageId", "sessionId", "updatedAt" FROM "ViewData";
DROP TABLE "ViewData";
ALTER TABLE "new_ViewData" RENAME TO "ViewData";
CREATE UNIQUE INDEX "ViewData_sessionId_pageId_key" ON "ViewData"("sessionId", "pageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
