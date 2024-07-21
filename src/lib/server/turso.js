// @ts-nocheck
import { createClient } from "@libsql/client";
import { TURSO_DB_TOKEN, TURSO_SYNC_URL } from '$env/static/private';

export const turso = createClient(
  {
    url: "file:local.db",
  }
);
