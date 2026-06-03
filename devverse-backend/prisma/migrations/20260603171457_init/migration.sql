-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "emprego" TEXT NOT NULL,
    "experiencia" TEXT NOT NULL,
    "avaliacao" TEXT NOT NULL,
    "pretensao" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Career_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Career_userId_key" ON "Career"("userId");
