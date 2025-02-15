// @ts-nocheck
import { pool } from '$lib/server/mysql';
import type { RowDataPacket } from 'mysql2';

interface TvSeries {
	title: string;
	overview: string;
	backdrop: string | null;
	seasons: number;
	id: number;
	first_air_date: Date;
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
		const pageSize = 15;
		const offset = (page - 1) * pageSize;

		console.log('Search parameters:', { name, genres, genrecount, page });

		let sql;
		let args;

		if (genres.length > 0) {
			const placeholders = genres.map(() => '?').join(', ');
			sql = `
            SELECT COUNT(*) as total
            FROM tv_series t
            WHERE (
                SELECT COUNT(*)
                FROM tv_genres gs
                WHERE gs.seriesid = t.id AND gs.genreid IN (${placeholders})
            ) = ?
            AND t.name LIKE ?
        `;
			args = [...genres, genrecount, `%${name}%`];
		} else {
			sql = `
            SELECT COUNT(*) as total
            FROM tv_series t
            WHERE t.name LIKE ?
        `;
			args = [`%${name}%`];
		}

		// Count total matching records
		const [totalCountResult] = await pool.query<RowDataPacket[]>(sql, args);

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
                    WHEN t.name LIKE 'a %' THEN SUBSTRING(t.name, 3)
                    WHEN t.name LIKE 'the %' THEN SUBSTRING(t.name, 5)
                    ELSE t.name
                END AS title,
                t.overview, t.backdrop, t.seasons, t.id, t.first_air_date
            FROM tv_series t
            WHERE (
                SELECT COUNT(*)
                FROM tv_genres gs
                WHERE seriesid = t.id AND gs.genreid IN (${placeholders})
            ) = ?
            AND t.name LIKE ?
            ORDER BY title
            LIMIT ? OFFSET ?
        `;
			movieArgs = [...genres, genrecount, `%${name}%`, pageSize, offset];
		} else {
			movieSql = `
            SELECT 
                CASE
                    WHEN t.name LIKE 'a %' THEN SUBSTRING(t.name, 3)
                    WHEN t.name LIKE 'the %' THEN SUBSTRING(t.name, 5)
                    ELSE t.name
                END AS title,
                t.overview, t.backdrop, t.seasons, t.id, t.first_air_date
            FROM tv_series t
            WHERE t.name LIKE ?
            ORDER BY title
            LIMIT ? OFFSET ?
        `;
			movieArgs = [`%${name}%`, pageSize, offset];
		}

		const [movieDataResult] = await pool.query(movieSql, movieArgs);
		const movieData = (movieDataResult as RowDataPacket[]).map((record) => ({
			title: record.title,
			overview: record.overview,
			backdrop: record.backdrop ? Buffer.from(record.backdrop).toString('base64') : null,
			seasons: record.seasons,
			id: record.id,
			first_air_date: record.first_air_date
		})) as TvSeries[];

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

		const [genreNamesResult] = await pool.query(genreNamesSql, genreNamesArgs);
		const genreNames = genreNamesResult as Genre[];

		return {
			movieData: movieData,
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
