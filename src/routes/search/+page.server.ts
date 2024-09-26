import { pool } from '$lib/server/mysql';
import type { RowDataPacket } from 'mysql2';

interface Movie {
	title: string;
	release_date: string;
	overview: string;
	runtime: number;
	poster: string | null;
	id: number;
}

interface Genre {
	id: number;
	name: string;
}

export async function load({ url }) {
	try {
		const name = url.searchParams.get('name') || '';
		const genres = url.searchParams.getAll('genres');
		const genrecount = Number(url.searchParams.get('genrecount')) || 0;
		const page = parseInt(url.searchParams.get('page') || '1');
		const pageSize = 50;
		const offset = (page - 1) * pageSize;

		console.log('Search parameters:', { name, genres, genrecount, page });

		let sql: string;
		let args: (string | number)[];

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
		const [totalCountResult] = await pool.query<RowDataPacket[]>(sql, args);
		const totalCount = totalCountResult[0].total as number;
		const totalPages = Math.ceil(totalCount / pageSize);

		// Fetch paginated results
		let movieSql: string;
		let movieArgs: (string | number)[];

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

		const [movieData] = await pool.query(movieSql, movieArgs);
		const movies = (movieData as RowDataPacket[]).map((record) => ({
			title: record.title,
			release_date: record.release_date,
			overview: record.overview,
			runtime: record.runtime,
			poster: record.poster ? Buffer.from(record.poster as Buffer).toString('base64') : null,
			id: record.id
		}));

		// Fetch genre names
		let genreNamesSql: string;
		let genreNamesArgs: (string | number)[];

		if (genres.length > 0) {
			const placeholders = genres.map(() => '?').join(', ');
			genreNamesSql = `SELECT id, name FROM genre WHERE id IN (${placeholders})`;
			genreNamesArgs = genres.map(Number);
		} else {
			genreNamesSql = `SELECT id, name FROM genre`;
			genreNamesArgs = [];
		}

		const [genreNames] = await pool.query(genreNamesSql, genreNamesArgs);
		const theGenres = (genreNames as RowDataPacket[]).map((record) => ({
			id: record.id,
			name: record.name
		}));

		return {
			movieData: movies,
			pagination: {
				currentPage: page,
				totalPages,
				pageSize,
				totalCount
			},
			genreNames: theGenres
		};
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			movieData: [],
			
			genreNames: []
		};
	}
}
