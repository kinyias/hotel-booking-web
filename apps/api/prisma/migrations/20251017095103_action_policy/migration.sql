-- CreateEnum
CREATE TYPE "PolicyMode" AS ENUM ('ANY', 'ALL');

-- CreateTable
CREATE TABLE "ApiAction" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "mode" "PolicyMode" NOT NULL DEFAULT 'ANY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiActionPolicy" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "ApiActionPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiAction_key_key" ON "ApiAction"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiActionPolicy_actionId_permissionId_key" ON "ApiActionPolicy"("actionId", "permissionId");

-- AddForeignKey
ALTER TABLE "ApiActionPolicy" ADD CONSTRAINT "ApiActionPolicy_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ApiAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiActionPolicy" ADD CONSTRAINT "ApiActionPolicy_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
