// @ts-nocheck
import { turso } from '$lib/server/turso';

/**
 * @typedef {Object} LoadEvent
 * @property {URL} url
 */

/**
 * @typedef {Object} LoadResult
 * @property {Array<Object>} movieData
 * @property {Object} pagination
 */

/**
 * @param {LoadEvent} event
 * @returns {Promise<LoadResult>}
 */
export async function load({ url }) {
	const name = url.searchParams.get('name') || '';
	const genres = url.searchParams.getAll('genres');
	const genrecount = Number(url.searchParams.get('genrecount')) || 0;
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 50; // Number of records per page
	const offset = (page - 1) * pageSize;

	console.log('Search parameters:', { name, genres, genrecount, page });

	const placeholders = genres.map(() => '?').join(', ');

	// Count total matching records
	const totalCountResult = await turso.execute({
		sql: `
      SELECT COUNT(*) as total
      FROM movies m
      WHERE (
        SELECT COUNT(*)
        FROM genres gs
        JOIN genre g ON g.id = gs.genreid
        WHERE movieid = m.id AND g.name IN (${placeholders})
      ) = ?
      AND m.title LIKE ?
      `,
		args: [...genres, genrecount, `%${name}%`]
	});

	const totalCount = totalCountResult.rows[0].total;
	const totalPages = Math.ceil(totalCount / pageSize);

	// Fetch paginated results
	const movieData = await turso.execute({
		sql: `
      SELECT CASE
        WHEN m.title LIKE 'a %' THEN SUBSTR(m.title, 3)
        WHEN m.title LIKE 'the %' THEN SUBSTR(m.title, 5)
        ELSE m.title
      END AS title
      ,m.release_date, m.overview, m.runtime, m.poster, m.id
      FROM movies m
      WHERE (
        SELECT COUNT(*)
        FROM genres gs
        JOIN genre g ON g.id = gs.genreid
        WHERE movieid = m.id AND g.name IN (${placeholders})
      ) = ?
      AND m.title LIKE ?
      ORDER BY title COLLATE NOCASE
      LIMIT ? OFFSET ?
      `,
		args: [...genres, genrecount, `%${name}%`, pageSize, offset]
	});

	const serializedMovieData = movieData.rows.map((record) => ({
		...record,
		poster: record.poster ? Buffer.from(record.poster).toString('base64') : null
	}));

	return {
		movieData: serializedMovieData,
		pagination: {
			currentPage: page,
			totalPages,
			pageSize,
			totalCount
		}
	};
}
