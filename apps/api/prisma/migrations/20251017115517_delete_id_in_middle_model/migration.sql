/*
  Warnings:

  - The primary key for the `ApiActionPolicy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ApiActionPolicy` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RolePermission` table. All the data in the column will be lost.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserRole` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."ApiActionPolicy_actionId_permissionId_key";

-- DropIndex
DROP INDEX "public"."RolePermission_roleId_permissionId_key";

-- DropIndex
DROP INDEX "public"."UserRole_userId_roleId_key";

-- AlterTable
ALTER TABLE "ApiActionPolicy" DROP CONSTRAINT "ApiActionPolicy_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ApiActionPolicy_pkey" PRIMARY KEY ("actionId", "permissionId");

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");

-- AlterTable
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId", "roleId");
