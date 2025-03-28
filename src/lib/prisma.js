import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global;

const getPrismaClient = () => {
  try {
    return new PrismaClient();
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    return null;
  }
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma; 