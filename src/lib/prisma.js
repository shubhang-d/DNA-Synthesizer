// Prisma client singleton for Next.js dev (prevents multiple instances during HMR)
// Prisma v7 requires an adapter to be passed to PrismaClient constructor
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const db = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(db);
  return new PrismaClient({ adapter, log: ["warn", "error"] });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
