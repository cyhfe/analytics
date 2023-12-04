/*
  Warnings:

  - You are about to drop the column `city` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `engine` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Session` table. All the data in the column will be lost.
  - Added the required column `country` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "referer" TEXT NOT NULL,
    "duration" TEXT
);
INSERT INTO "new_Session" ("browser", "device", "id", "ip", "online", "os", "referer") SELECT "browser", "device", "id", "ip", "online", "os", "referer" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
