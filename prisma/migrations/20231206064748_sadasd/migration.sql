-- AlterTable
ALTER TABLE "ViewData" ADD COLUMN "browser" TEXT;
ALTER TABLE "ViewData" ADD COLUMN "country" TEXT;
ALTER TABLE "ViewData" ADD COLUMN "device" TEXT;
ALTER TABLE "ViewData" ADD COLUMN "os" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "browser" TEXT,
    "os" TEXT,
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
CREATE UNIQUE INDEX "Session_ip_key" ON "Session"("ip");
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
