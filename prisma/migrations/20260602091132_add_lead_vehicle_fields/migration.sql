-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "vehicleDiagnosis" TEXT,
ADD COLUMN     "vehicleEngine" TEXT,
ADD COLUMN     "vehicleFuelType" TEXT,
ADD COLUMN     "vehicleHsn" TEXT,
ADD COLUMN     "vehicleMileage" TEXT,
ADD COLUMN     "vehicleMotorCode" TEXT,
ADD COLUMN     "vehicleProblems" TEXT[],
ADD COLUMN     "vehicleTsn" TEXT,
ADD COLUMN     "vehicleType" TEXT;
