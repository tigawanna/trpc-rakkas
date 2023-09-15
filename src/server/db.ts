import { PrismaClient } from "@prisma/client";
import { envs } from "@/utils/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:envs.DEV_MODE ? ["query", "error", "warn"] : ["error"],
      // env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
if (envs.PROD_MODE) globalForPrisma.prisma = prisma;
