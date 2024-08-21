// @ts-nocheck
// src/routes/api/actors/+server.js
import { json } from '@sveltejs/kit';
import { mysql } from '$lib/server/mysql';

export async function GET({ url }) {
  const search = url.searchParams.get('search') || '';

  console.log('Doing it:', search);

  if (search.length >= 3) {
    try {
      const searchTerm = `${search}%`; // Add wildcard to the end of the search term
      const [results] = await mysql.query(
        'SELECT id, name FROM actors WHERE name LIKE ?',
        [searchTerm]);
      return json(results);
    } catch (error) {
      console.error('Error querying database:', error);
      return json([]);
    }
  }

  return json([]);
}
