-- CreateTable
CREATE TABLE "User" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_key" ON "User"("firstName", "lastName");
