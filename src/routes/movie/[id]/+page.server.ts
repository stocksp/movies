// src/routes/movie/[id]/+page.server.js
import { pool } from '$lib/server/mysql';
import { get } from 'svelte/store';
import { fail } from '@sveltejs/kit';
import type { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

interface Genre {
	name: string;
}

function isRowDataPacketArray(result: any): result is RowDataPacket[] {
	return Array.isArray(result) && result.every((item) => typeof item === 'object');
}

export async function load({ params }) {
	
	try {
		console.log('running load for movie/id', params.id)
		const movieId = parseInt(params.id);

		let result;
		const [movieDetailsResult, genresResult, castResult] = await Promise.all([
			fetchMovieDetails(movieId),
			fetchGenres(movieId),
			fetchCast(movieId)
		]);

		let serializedMovieDetails: MovieDetails[] = [];
		if (isRowDataPacketArray(movieDetailsResult)) {
			serializedMovieDetails = serializeMovieDetails(movieDetailsResult);
		}
		let serializedGenres: Genre[] = [];
		if (isRowDataPacketArray(genresResult)) {
			serializedGenres = serializeGenres(genresResult);
		}
		let serializedCast: CastMember[] = [];
		if (isRowDataPacketArray(castResult)) {
			serializedCast = serializeCast(castResult);
		}
		result = {
			movieDetails: serializedMovieDetails[0],
			genres: serializedGenres,
			cast: serializedCast
		};

		return result;
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			result: []
		};
	}
}

async function fetchMovieDetails(movieId: number) {
	try {
		const [rows] = await pool.query(
			`
    SELECT m.title, m.release_date, m.overview, m.review, m.runtime, m.poster
    FROM movies m
    WHERE m.id = ?
  `,
			[movieId]
		);
		return rows;
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			rows: []
		};
	}
}

async function fetchGenres(movieId: number) {
	try {
		const [rows] = await pool.query(
			`
    SELECT g.name FROM
    movies m
    JOIN genres gs ON gs.movieid = m.id
    JOIN genre g ON g.id = gs.genreid
    WHERE m.id = ?
  `,
			[movieId]
		);
		return rows;
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			rows: []
		};
	}
}

async function fetchCast(movieId: number) {
	try {
		const [rows] = await pool.query(
			`
    SELECT a.id, a.name, c.character, a.picture,
    (SELECT COUNT(*) FROM cast WHERE actorid = c.actorid) AS roles
    FROM movies m
    JOIN cast c ON c.movieid = m.id
    JOIN actors a ON a.id = c.actorid
    WHERE m.id = ?
    ORDER BY roles DESC
  `,
			[movieId]
		);
		return rows;
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			rows: []
		};
	}
}

function serializeMovieDetails(rows: RowDataPacket[]): MovieDetails[] {
	return rows.map((record) => ({
		title: record.title,
		release_date: record.release_date,
		overview: record.overview,
		review: record.review,
		runtime: record.runtime,
		poster: record.poster ? Buffer.from(record.poster).toString('base64') : null
	}));
}

function serializeGenres(rows: RowDataPacket[]): Genre[] {
	return rows.map((record) => ({
		name: record.name
	}));
}


function serializeCast(rows: RowDataPacket[]): CastMember[] {
	return rows.map((record) => ({
		id: record.id,
		name: record.name,
		character: record.character,
		picture: record.picture ? Buffer.from(record.picture).toString('base64') : null,
		roles: record.roles
	}));
}

export const actions = {
	addReview: async ({ params, request }) => {
		const formData = await request.formData();
		const review = formData.get('review');
		const movieId = parseInt(params.id);

		if (typeof review !== 'string' || review.length === 0) {
			return fail(400, { review, missing: true });
		}

		await updateMovieReview(movieId, review);

		return { success: true };
	},

	updateReview: async ({ params, request }) => {
		const formData = await request.formData();
		const review = formData.get('review');
		const movieId = parseInt(params.id);

		if (typeof review !== 'string' || review.length === 0) {
			return fail(400, { review, missing: true });
		}

		await updateMovieReview(movieId, review);

		return { success: true };
	},

	removeReview: async ({ params }) => {
		const movieId = parseInt(params.id);

		await updateMovieReview(movieId, null);

		return { success: true };
	}
};

async function updateMovieReview(movieId: number, review: string | null) {
	try {
		await pool.query(
			`
    UPDATE movies
    SET review = ?
    WHERE id = ?
  `,
			[review, movieId]
		);
	} catch (error) {
		console.error('Database query failed:', error);
	}
}
