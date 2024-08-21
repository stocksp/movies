// @ts-nocheck
// src/routes/+page.server.js
import { mysql } from '$lib/server/mysql';

export async function load({ url }) {
  console.log("whaaaa");
  const search = url.searchParams.get('search') || '';

  if (search.length >= 3) {
    const query = 'SELECT id, name FROM actors WHERE name LIKE ?';
    const values = [`${search}%`];

    try {
      const [results] = await mysql.query(query, values);
      return {
        actors: results
      };
    } catch (error) {
      console.error('Error querying database:', error);
      return {
        actors: []
      };
    }
  }

  return {
    actors: []
  };
}
