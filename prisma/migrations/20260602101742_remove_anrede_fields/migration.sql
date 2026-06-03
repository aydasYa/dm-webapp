/*
  Warnings:

  - You are about to drop the column `anrede` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyContactAnrede` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "anrede",
DROP COLUMN "companyContactAnrede";
