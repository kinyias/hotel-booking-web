/*
  Warnings:

  - A unique constraint covering the columns `[jti]` on the table `AuthSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `AuthSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jti` to the `AuthSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshHash` to the `AuthSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthSession" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "jti" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "refreshHash" TEXT NOT NULL,
ADD COLUMN     "revokedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_jti_key" ON "AuthSession"("jti");

-- CreateIndex
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");
