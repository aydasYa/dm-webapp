/*
  Warnings:

  - You are about to drop the column `companyContactPerson` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "companyContactPerson",
ADD COLUMN     "companyContactFirstname" TEXT,
ADD COLUMN     "companyContactLastname" TEXT;
