/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Website_domain_key" ON "Website"("domain");
