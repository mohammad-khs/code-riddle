// Prisma configuration file for Prisma with MongoDB
// The DATABASE_URL environment variable is read from .env.local or Vercel environment

export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
