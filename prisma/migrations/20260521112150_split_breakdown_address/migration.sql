/*
  Warnings:

  - You are about to drop the column `breakdownAddress` on the `leads` table. All the data in the column will be lost.
  - Added the required column `breakdownCity` to the `leads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `breakdownPostcode` to the `leads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `breakdownStreet` to the `leads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "leads" DROP COLUMN "breakdownAddress",
ADD COLUMN     "breakdownCity" TEXT NOT NULL,
ADD COLUMN     "breakdownPostcode" TEXT NOT NULL,
ADD COLUMN     "breakdownStreet" TEXT NOT NULL;
