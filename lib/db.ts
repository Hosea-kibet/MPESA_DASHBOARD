import { PrismaClient } from "@prisma/client"

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Create a new PrismaClient instance or use the existing one
export const prisma = global.prisma || new PrismaClient()

// In development, attach the PrismaClient instance to the global object
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}
