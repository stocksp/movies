// src/routes/api/actors/+server.js
import { json } from '@sveltejs/kit';
import { pool } from '$lib/server/mysql';

export async function GET({ url }) {
	const search = url.searchParams.get('search') || '';
	const fullWildcard = url.searchParams.get('fullWildcard') === 'true';

	let searchTerm = `${search}%`; // Default is wildcard at the end

	if (fullWildcard) {
		searchTerm = `%${search}%`; // Add wildcards to both ends
	}

	//console.log('Doing it:', searchTerm);

	if (search.length >= 3) {
		try {
			const [results] = await pool.query('SELECT id, name FROM actors WHERE name LIKE ?', [
				searchTerm
			]);
			return json(results);
		} catch (error) {
			console.error('Error querying database:', error);
			return json([]);
		}
	}

	return json([]);
}
