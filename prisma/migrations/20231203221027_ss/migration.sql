-- CreateTable
CREATE TABLE "_PageToSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PageToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PageToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathname" TEXT NOT NULL,
    "views" INTEGER NOT NULL
);
INSERT INTO "new_Page" ("id", "pathname", "views") SELECT "id", "pathname", "views" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_pathname_key" ON "Page"("pathname");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PageToSession_AB_unique" ON "_PageToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_PageToSession_B_index" ON "_PageToSession"("B");
