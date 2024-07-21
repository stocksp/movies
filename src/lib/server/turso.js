// @ts-nocheck
import { createClient } from "@libsql/client";

export const turso = createClient(
  {
    url: "file:local.db",
  }
);
