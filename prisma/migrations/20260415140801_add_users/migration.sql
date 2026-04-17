/*
  Warnings:

  - You are about to drop the `auditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `qrScan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workshop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auditLog" DROP CONSTRAINT "auditLog_leadId_fkey";

-- DropForeignKey
ALTER TABLE "auditLog" DROP CONSTRAINT "auditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "commission" DROP CONSTRAINT "commission_leadId_fkey";

-- DropForeignKey
ALTER TABLE "commission" DROP CONSTRAINT "commission_towTruckDriverId_fkey";

-- DropForeignKey
ALTER TABLE "lead" DROP CONSTRAINT "lead_towTruckDriverId_fkey";

-- DropForeignKey
ALTER TABLE "lead" DROP CONSTRAINT "lead_workshopId_fkey";

-- DropForeignKey
ALTER TABLE "qrScan" DROP CONSTRAINT "qrScan_leadId_fkey";

-- DropTable
DROP TABLE "auditLog";

-- DropTable
DROP TABLE "commission";

-- DropTable
DROP TABLE "lead";

-- DropTable
DROP TABLE "qrScan";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "workshop";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "company" TEXT,
    "supabaseId" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'TOW_TRUCK_DRIVER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "qrCode" TEXT,
    "salesforceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "customerLastName" TEXT NOT NULL,
    "vehicleMake" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "breakdownAddress" TEXT NOT NULL,
    "internNotice" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "salesforceId" TEXT,
    "salesforceStatus" TEXT,
    "towTruckDriverId" TEXT NOT NULL,
    "workshopId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_scans" (
    "id" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utmMedium" TEXT,
    "utmSource" TEXT,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "landingpageLink" TEXT NOT NULL,

    CONSTRAINT "qr_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
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

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "userId" TEXT,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "users_qrCode_key" ON "users"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_salesforceId_key" ON "users"("salesforceId");

-- CreateIndex
CREATE UNIQUE INDEX "leads_salesforceId_key" ON "leads"("salesforceId");

-- CreateIndex
CREATE UNIQUE INDEX "qr_scans_leadId_key" ON "qr_scans"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "commissions_leadId_key" ON "commissions"("leadId");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_towTruckDriverId_fkey" FOREIGN KEY ("towTruckDriverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_towTruckDriverId_fkey" FOREIGN KEY ("towTruckDriverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
