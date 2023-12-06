/*
  Warnings:

  - You are about to drop the column `pageId` on the `ViewData` table. All the data in the column will be lost.
  - Added the required column `pathname` to the `ViewData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ViewData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wid" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "referrer" TEXT,
    "language" TEXT,
    "screen" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "country" TEXT,
    CONSTRAINT "ViewData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ViewData_pathname_fkey" FOREIGN KEY ("pathname") REFERENCES "Page" ("pathname") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ViewData_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ViewData" ("browser", "count", "country", "createdAt", "device", "duration", "id", "language", "os", "referrer", "screen", "sessionId", "updatedAt", "wid") SELECT "browser", "count", "country", "createdAt", "device", "duration", "id", "language", "os", "referrer", "screen", "sessionId", "updatedAt", "wid" FROM "ViewData";
DROP TABLE "ViewData";
ALTER TABLE "new_ViewData" RENAME TO "ViewData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
