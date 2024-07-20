// @ts-nocheck
import { createClient } from "@libsql/client";
import { TURSO_DB_TOKEN, TURSO_SYNC_URL } from '$env/static/private';

const isProd = process.env.NODE_ENV === 'production';

console.log(`Setting up Turso in ${isProd ? 'production' : 'development'} mode`);

export const turso = createClient(
  isProd
    ? {
        // Production configuration
        url: TURSO_SYNC_URL,
        authToken: TURSO_DB_TOKEN,
      }
    : {
        // Development configuration
        url: "file:local.db",
        syncUrl: TURSO_SYNC_URL,
        authToken: TURSO_DB_TOKEN,
      }
);
