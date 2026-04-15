-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "workshop" ADD COLUMN     "deletedAt" TIMESTAMP(3);
