// @ts-nocheck
import { createClient } from "@libsql/client"
import { TURSO_DB_TOKEN, TURSO_SYNC_URL } from '$env/static/private'

console.log('setting up Turso')
//remote only
export const turso = createClient({
  url: TURSO_SYNC_URL,
  authToken: TURSO_DB_TOKEN,
}) 
