/*
  Warnings:

  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_User" ("firstName", "lastName") SELECT "firstName", "lastName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_firstName_lastName_key" ON "User"("firstName", "lastName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
