import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

let db: PrismaClient | undefined;

/**
 * Lazy initialize Prisma client on first use
 * Prevents build-time errors when environment variables aren't available
 * Ensures database connection only happens at runtime
 */
export function getDb(): PrismaClient {
  // Return existing instance if available
  if (db) return db;

  // Check for development global instance
  if (globalThis.prisma) {
    db = globalThis.prisma;
    return db;
  }

  // Initialize new client with connection string from environment
  // Use POSTGRES_PRISMA_URL for Vercel Postgres (with PgBouncer pooling)
  // Fall back to DATABASE_URL for local development
  const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_PRISMA_URL environment variable is required");
  }

  db = new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
    log: process.env.NODE_ENV === "development" ? ["info"] : [],
  });

  // Store in global for development hot reload support
  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
  }

  return db;
}