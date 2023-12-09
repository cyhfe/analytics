/*
  Warnings:

  - A unique constraint covering the columns `[wid,ip,browser,os,device]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Session_ip_browser_os_device_key";

-- CreateIndex
CREATE UNIQUE INDEX "Session_wid_ip_browser_os_device_key" ON "Session"("wid", "ip", "browser", "os", "device");
