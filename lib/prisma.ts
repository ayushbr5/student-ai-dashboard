import { PrismaClient } from '@prisma/client'

// Add prisma to the NodeJS global type to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use the existing instance if it exists, otherwise create a new one
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// In development, save the instance to globalThis to persist across reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma