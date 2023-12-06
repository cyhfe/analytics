/*
  Warnings:

  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `browser` on the `ViewData` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `ViewData` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `ViewData` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `ViewData` table. All the data in the column will be lost.
  - Made the column `browser` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `device` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `os` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Page_pathname_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Page";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "country" TEXT,
    "online" BOOLEAN NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "wid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("browser", "country", "createdAt", "device", "id", "ip", "online", "os", "updatedAt", "wid") SELECT "browser", "country", "createdAt", "device", "id", "ip", "online", "os", "updatedAt", "wid" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_ip_browser_os_device_key" ON "Session"("ip", "browser", "os", "device");
CREATE TABLE "new_ViewData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "wid" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "referrer" TEXT,
    "language" TEXT,
    "screen" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ViewData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ViewData_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ViewData" ("count", "createdAt", "duration", "id", "language", "pathname", "referrer", "screen", "sessionId", "updatedAt", "wid") SELECT "count", "createdAt", "duration", "id", "language", "pathname", "referrer", "screen", "sessionId", "updatedAt", "wid" FROM "ViewData";
DROP TABLE "ViewData";
ALTER TABLE "new_ViewData" RENAME TO "ViewData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
