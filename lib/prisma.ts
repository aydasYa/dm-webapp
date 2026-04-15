import { PrismaClient } from "@/src/generated/prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg"; 


// each comment-code not need for supabase to run, just for the next.js (enable later)
// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient; 
// }; 

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL, 
}); 

// const prisma = globalForPrisma.prisma || new PrismaClient({ adapter, }); 

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
const prisma = new PrismaClient({ adapter });
export default prisma; 