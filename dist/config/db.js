"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/db.ts
const client_1 = require("@prisma/client");
const client = globalThis.prisma || new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // INI BAGIAN PENTING
});
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = client;
}
exports.default = client;
