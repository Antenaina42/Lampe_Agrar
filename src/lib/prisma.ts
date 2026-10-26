import { PrismaClient } from '@prisma/client';

export function sanitizeDatabaseUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  let url = String(raw).trim();

  // If user pasted 'DATABASE_URL=...'
  if (url.startsWith('DATABASE_URL=')) {
    url = url.substring('DATABASE_URL='.length).trim();
  }

  // Strip wrapping escaped quotes or quotes: \" or " or '
  url = url.replace(/^(\\"|'|")/, '').replace(/(\\"|'|")$/, '').trim();
  url = url.replace(/^(\\"|'|")/, '').replace(/(\\"|'|")$/, '').trim();

  // If protocol missing but has host/user
  if (!url.startsWith('mysql://') && url.includes('@')) {
    url = `mysql://${url}`;
  }

  return url;
}

const cleanedUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
if (cleanedUrl) {
  process.env.DATABASE_URL = cleanedUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: cleanedUrl
      ? {
          db: {
            url: cleanedUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
