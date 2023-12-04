-- CreateTable
CREATE TABLE "Website" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "browser" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "referer" TEXT NOT NULL,
    "time" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathname" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    CONSTRAINT "Page_id_fkey" FOREIGN KEY ("id") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");

-- CreateIndex
CREATE UNIQUE INDEX "Page_pathname_key" ON "Page"("pathname");
