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
    "referer" TEXT,
    "duration" TEXT
);
INSERT INTO "new_Session" ("browser", "country", "device", "duration", "id", "ip", "online", "os", "referer") SELECT "browser", "country", "device", "duration", "id", "ip", "online", "os", "referer" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
