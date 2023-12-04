/*
  Warnings:

  - The primary key for the `Website` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Website` table. All the data in the column will be lost.
  - Added the required column `wid` to the `Session` table without a default value. This is not possible if the table is not empty.

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
    "referer" TEXT,
    "duration" TEXT,
    "wid" TEXT NOT NULL,
    CONSTRAINT "Session_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("browser", "country", "device", "duration", "id", "ip", "online", "os", "referer") SELECT "browser", "country", "device", "duration", "id", "ip", "online", "os", "referer" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");
CREATE TABLE "new_Website" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL
);
INSERT INTO "new_Website" ("domain", "id") SELECT "domain", "id" FROM "Website";
DROP TABLE "Website";
ALTER TABLE "new_Website" RENAME TO "Website";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
