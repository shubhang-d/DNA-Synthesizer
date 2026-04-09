// Prisma client wrapper with v7 adapter configuration
import { PrismaClient } from "@prisma/client";

let prisma;
if (process.env.DATABASE_URL) {
  prisma = new PrismaClient({
    adapter: {
      provider: "postgres",
      url: process.env.DATABASE_URL,
    },
  });
} else {
  console.warn("DATABASE_URL not set, using mock Prisma client");
  prisma = {
    user: {
      findUnique: async () => null,
      create: async () => null,
    },
    order: {
      create: async () => null,
      findMany: async () => [],
    },
  };
}

export default prisma;
