/*
  Warnings:

  - You are about to drop the column `company` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "company",
ADD COLUMN     "companyAddress" TEXT,
ADD COLUMN     "companyCity" TEXT,
ADD COLUMN     "companyContactPerson" TEXT,
ADD COLUMN     "companyEmail" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "companyPhone" TEXT,
ADD COLUMN     "companyPostcode" TEXT;
