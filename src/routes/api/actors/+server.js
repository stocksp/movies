// @ts-nocheck
// src/routes/api/actors/+server.js
import { json } from '@sveltejs/kit';
import { mysql } from '$lib/server/mysql';

export async function GET({ url }) {
  console.log('Doing it:');
  const search = url.searchParams.get('search') || '';

  if (search.length >= 3) {
    try {
      const [results] = await mysql.query(
'SELECT id, name FROM actors WHERE name LIKE ?',
[search]);
      return json(results);
    } catch (error) {
      console.error('Error querying database:', error);
      return json([]);
    }
  }

  return json([]);
}
