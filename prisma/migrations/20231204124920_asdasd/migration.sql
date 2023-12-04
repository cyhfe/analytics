/*
  Warnings:

  - Added the required column `wid` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wid` to the `ViewData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathname" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "wid" TEXT NOT NULL,
    CONSTRAINT "Page_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("createdAt", "id", "pathname", "updatedAt") SELECT "createdAt", "id", "pathname", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_pathname_key" ON "Page"("pathname");
CREATE TABLE "new_ViewData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wid" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "referrer" TEXT,
    "language" TEXT,
    "screen" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ViewData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ViewData_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ViewData_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ViewData" ("count", "createdAt", "duration", "id", "language", "pageId", "referrer", "screen", "sessionId", "updatedAt") SELECT "count", "createdAt", "duration", "id", "language", "pageId", "referrer", "screen", "sessionId", "updatedAt" FROM "ViewData";
DROP TABLE "ViewData";
ALTER TABLE "new_ViewData" RENAME TO "ViewData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
