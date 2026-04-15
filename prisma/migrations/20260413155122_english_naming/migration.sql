/*
  Warnings:

  - The values [ABSCHLEPPER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `abschlepperId` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the `comission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `towTruckDriverId` to the `lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('TOW_TRUCK_DRIVER', 'ADMIN');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'TOW_TRUCK_DRIVER';
COMMIT;

-- DropForeignKey
ALTER TABLE "comission" DROP CONSTRAINT "comission_abschlepperId_fkey";

-- DropForeignKey
ALTER TABLE "comission" DROP CONSTRAINT "comission_leadId_fkey";

-- DropForeignKey
ALTER TABLE "lead" DROP CONSTRAINT "lead_abschlepperId_fkey";

-- AlterTable
ALTER TABLE "lead" DROP COLUMN "abschlepperId",
ADD COLUMN     "towTruckDriverId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'TOW_TRUCK_DRIVER';

-- DropTable
DROP TABLE "comission";

-- CreateTable
CREATE TABLE "commission" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paymentRef" TEXT,
    "paidAt" TIMESTAMP(3),
    "leadId" TEXT NOT NULL,
    "towTruckDriverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commission_leadId_key" ON "commission"("leadId");

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_towTruckDriverId_fkey" FOREIGN KEY ("towTruckDriverId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_towTruckDriverId_fkey" FOREIGN KEY ("towTruckDriverId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
