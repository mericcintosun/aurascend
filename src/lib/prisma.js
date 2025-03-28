import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis;

// Ensure database URL has a database name
const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && !databaseUrl.includes('/aurascend?')) {
  console.warn('DATABASE_URL may be missing database name. Current URL:', 
    databaseUrl.replace(/:[^:]*@/, ':****@')); // Hide password in logs
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma; 