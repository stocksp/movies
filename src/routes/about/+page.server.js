// @ts-nocheck
// src/routes/+page.server.js
import { turso } from '$lib/server/turso';

export async function load() {
	const movieData = await turso.execute({
		sql: `
      SELECT m.title, m.release_date, m.overview, m.runtime, m.poster
      FROM movies m
      ORDER BY m.title COLLATE NOCASE
      LIMIT 150
    `,
		args: []
	});

	const serializedMovieData = movieData.rows.map((record) => ({
		...record,
		poster: record.poster ? Buffer.from(record.poster).toString('base64') : null
	}));

	return {
		movieData: serializedMovieData
	};
}
