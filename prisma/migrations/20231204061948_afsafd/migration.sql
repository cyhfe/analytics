/*
  Warnings:

  - You are about to drop the column `duration` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ViewData" ADD COLUMN "language" TEXT;
ALTER TABLE "ViewData" ADD COLUMN "screen" TEXT;

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
    "wid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("browser", "country", "createdAt", "device", "id", "ip", "online", "os", "updatedAt", "wid") SELECT "browser", "country", "createdAt", "device", "id", "ip", "online", "os", "updatedAt", "wid" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
