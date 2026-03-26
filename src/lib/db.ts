import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  // Use POSTGRES_PRISMA_URL for Vercel Postgres (with PgBouncer pooling)
  // Fall back to DATABASE_URL for local development
  const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_PRISMA_URL environment variable is required");
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
    log: process.env.NODE_ENV === "development" ? ["info"] : [],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export { db };

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;