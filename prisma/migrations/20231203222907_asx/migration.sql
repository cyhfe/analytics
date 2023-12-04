/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);
INSERT INTO "new_User" ("firstName", "lastName") SELECT "firstName", "lastName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_firstName_lastName_key" ON "User"("firstName", "lastName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
