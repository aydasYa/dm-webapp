// import { PrismaClient } from "../src/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import "dotenv/config";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

// const prisma = new PrismaClient({
//   adapter,
// });

// async function main() {
//   // Create an Admin
//   const admin = await prisma.user.create({
//     data: {
//       email: "admin@deinmotorschaden.de",
//       name: "Admin",
//       passwordHash: "placeholder_hash",
//       role: "ADMIN",
//       status: "ACTIVE",
//     },
//   });

//   // Create an Tow-Truck-Driver
//   const towTruckDriver = await prisma.user.create({
//     data: {
//       email: "max@towTruckDriver123.de",
//       name: "Max Mustermann",
//       passwordHash: "placeholder_hash",
//       role: "TOW_TRUCK_DRIVER",
//       status: "ACTIVE",
//       qrCode: "QR-MAX-001",
//     },
//   });

//   // Create a Workshop
//   const workshop = await prisma.workshop.create({
//     data: {
//       name: "Auto Müller GmbH",
//       address: "Musterstraße 1",
//       city: "München",
//       phone: "+49 89 123456",
//       email: "info@automueller.de",
//     },
//   });

//   // Create a Lead
//   const lead = await prisma.lead.create({
//     data: {
//       customerLastName: "Schmidt",
//       vehicleMake: "BMW",
//       vehicleModel: "320i",
//       breakdownAddress: "Leopoldstraße 5, München",
//       status: "COMPLETED",
//       towTruckDriverId: towTruckDriver.id,
//       workshopId: workshop.id,
//     },
//   });

//   // Create a QRScan for that Lead
//   await prisma.qRScan.create({
//     data: {
//       utmMedium: towTruckDriver.id,
//       utmSource: "ADAC_TowTruckDriver",
//       leadId: lead.id,
//     },
//   });

//   // Create a Commission for that Lead
//   await prisma.commission.create({
//     data: {
//       amount: 50.00,
//       currency: "EUR",
//       status: "PAID",
//       leadId: lead.id,
//       towTruckDriverId: towTruckDriver.id,
//     },
//   });

//   console.log("✅ Seed complete");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });