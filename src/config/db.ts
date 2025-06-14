// src/config/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // INI BAGIAN PENTING
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

export default client;