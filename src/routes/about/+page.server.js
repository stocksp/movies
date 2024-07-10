// @ts-nocheck
// src/routes/+page.server.js
import { turso } from '$lib/server/turso';

export async function load({ url }) {
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = 20; // Number of records per page
    const offset = (page - 1) * pageSize;

    const totalCountResult = await turso.execute({
        sql: `SELECT COUNT(*) as total FROM movies`,
        args: []
    });

    const totalCount = totalCountResult.rows[0].total;
    const totalPages = Math.ceil(totalCount / pageSize);

    const movieData = await turso.execute({
        sql: `
            SELECT m.title, m.release_date, m.overview, m.runtime, m.poster
            FROM movies m
            ORDER BY m.title COLLATE NOCASE
            LIMIT ? OFFSET ?
        `,
        args: [pageSize, offset]
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
