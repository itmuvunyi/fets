import { PrismaClient } from "@prisma/client";

const createPrismaClient = () =>
  new PrismaClient();

export const db = (globalThis as any).prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).prisma = db;
}
