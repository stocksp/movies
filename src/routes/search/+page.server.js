// @ts-nocheck
import { mysql } from '$lib/server/mysql';

export async function load({ url }) {
	try {
		const name = url.searchParams.get('name') || '';
		const genres = url.searchParams.getAll('genres');
		const genrecount = Number(url.searchParams.get('genrecount')) || 0;
		const page = parseInt(url.searchParams.get('page') || '1');
		const pageSize = 50;
		const offset = (page - 1) * pageSize;

		console.log('Search parameters:', { name, genres, genrecount, page });

		let sql;
		let args;

		if (genres.length > 0) {
			const placeholders = genres.map(() => '?').join(', ');
			sql = `
            SELECT COUNT(*) as total
            FROM movies m
            WHERE (
                SELECT COUNT(*)
                FROM genres gs
                WHERE gs.movieid = m.id AND gs.genreid IN (${placeholders})
            ) = ?
            AND m.title LIKE ?
        `;
			args = [...genres, genrecount, `%${name}%`];
		} else {
			sql = `
            SELECT COUNT(*) as total
            FROM movies m
            WHERE m.title LIKE ?
        `;
			args = [`%${name}%`];
		}

		// Count total matching records
		const [totalCountResult] = await mysql.query(sql, args);

		const totalCount = totalCountResult[0].total;
		const totalPages = Math.ceil(totalCount / pageSize);

		// Fetch paginated results
		let movieSql;
		let movieArgs;

		if (genres.length > 0) {
			const placeholders = genres.map(() => '?').join(', ');
			movieSql = `
            SELECT 
                CASE
                    WHEN m.title LIKE 'a %' THEN SUBSTRING(m.title, 3)
                    WHEN m.title LIKE 'the %' THEN SUBSTRING(m.title, 5)
                    ELSE m.title
                END AS title,
                m.release_date, m.overview, m.runtime, m.poster, m.id
            FROM movies m
            WHERE (
                SELECT COUNT(*)
                FROM genres gs
                WHERE movieid = m.id AND gs.genreid IN (${placeholders})
            ) = ?
            AND m.title LIKE ?
            ORDER BY title
            LIMIT ? OFFSET ?
        `;
			movieArgs = [...genres, genrecount, `%${name}%`, pageSize, offset];
		} else {
			movieSql = `
            SELECT 
                CASE
                    WHEN m.title LIKE 'a %' THEN SUBSTRING(m.title, 3)
                    WHEN m.title LIKE 'the %' THEN SUBSTRING(m.title, 5)
                    ELSE m.title
                END AS title,
                m.release_date, m.overview, m.runtime, m.poster, m.id
            FROM movies m
            WHERE m.title LIKE ?
            ORDER BY title
            LIMIT ? OFFSET ?
        `;
			movieArgs = [`%${name}%`, pageSize, offset];
		}

		const [movieData] = await mysql.query(movieSql, movieArgs);

		// Fetch genre names
		let genreNamesSql;
		let genreNamesArgs;

		if (genres.length > 0) {
			const placeholders = genres.map(() => '?').join(', ');
			genreNamesSql = `SELECT id, name FROM genre WHERE id IN (${placeholders})`;
			genreNamesArgs = genres;
		} else {
			genreNamesSql = `SELECT id, name FROM genre`;
			genreNamesArgs = [];
		}

		const [genreNames] = await mysql.query(genreNamesSql, genreNamesArgs);

		const serializedMovieData = movieData.map((record) => ({
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
			},
			genreNames: genreNames
		};
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			genreNames: []
		};
	}
}
