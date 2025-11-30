// Prisma configuration file for Prisma 7 with MongoDB
// The DATABASE_URL is passed to PrismaClient at runtime
// See app/api routes for PrismaClient initialization

export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
