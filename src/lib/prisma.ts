import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL_NON_POOLING,
    },
  },
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
