/*
  Warnings:

  - A unique constraint covering the columns `[ip,browser,os]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Session_ip_browser_key";

-- CreateIndex
CREATE UNIQUE INDEX "Session_ip_browser_os_key" ON "Session"("ip", "browser", "os");
