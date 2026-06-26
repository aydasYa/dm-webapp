/*
  Warnings:

  - You are about to drop the column `companyAddress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyCity` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyContactFirstname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyContactLastname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyEmail` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyPhone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyPostcode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyWebsite` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "companyAddress",
DROP COLUMN "companyCity",
DROP COLUMN "companyContactFirstname",
DROP COLUMN "companyContactLastname",
DROP COLUMN "companyEmail",
DROP COLUMN "companyName",
DROP COLUMN "companyPhone",
DROP COLUMN "companyPostcode",
DROP COLUMN "companyWebsite";
