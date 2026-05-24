import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// THE PRISMA CLIENT — our single connection to the Postgres database.
//
// Prisma 7 talks to the database through a "driver adapter". For Postgres that's
// PrismaPg. We give it the connection string from the DATABASE_URL environment
// variable, which Next.js loads from the .env file automatically.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Why the global trick below:
// In development, Next.js hot-reloads your code on every save. Without this,
// each reload would create a BRAND NEW PrismaClient (and a new pool of database
// connections), and you'd quickly exhaust the database's connection limit.
// Stashing one client on the global object means reloads reuse the same one.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
