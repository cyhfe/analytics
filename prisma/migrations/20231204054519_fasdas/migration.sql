/*
  Warnings:

  - You are about to drop the column `referer` on the `Session` table. All the data in the column will be lost.
  - Added the required column `count` to the `ViewData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "device" TEXT,
    "country" TEXT,
    "language" TEXT,
    "duration" INTEGER,
    "wid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("browser", "country", "createdAt", "device", "duration", "id", "ip", "online", "os", "updatedAt", "wid") SELECT "browser", "country", "createdAt", "device", "duration", "id", "ip", "online", "os", "updatedAt", "wid" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");
CREATE TABLE "new_ViewData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "referer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ViewData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ViewData_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ViewData" ("createdAt", "duration", "id", "pageId", "sessionId", "updatedAt") SELECT "createdAt", "duration", "id", "pageId", "sessionId", "updatedAt" FROM "ViewData";
DROP TABLE "ViewData";
ALTER TABLE "new_ViewData" RENAME TO "ViewData";
CREATE UNIQUE INDEX "ViewData_sessionId_pageId_key" ON "ViewData"("sessionId", "pageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
