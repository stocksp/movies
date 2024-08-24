// src/routes/movie/[id]/+page.server.js
import { mysql } from '$lib/server/mysql';
import { get } from 'svelte/store';
import { fail } from '@sveltejs/kit';

// ... (keep all type definitions as they are)

export async function load({ params }) {
	try {
		const movieId = params.id;

		let result;
		const [movieDetails, genres, cast] = await Promise.all([
			fetchMovieDetails(movieId),
			fetchGenres(movieId),
			fetchCast(movieId)
		]);

		const serializedMovieDetails = serializeMovieDetails(movieDetails);
		const serializedGenres = serializeGenres(genres);
		const serializedCast = serializeCast(cast);

		result = /** @type {MovieData} */ ({
			movieDetails: serializedMovieDetails[0],
			genres: serializedGenres,
			cast: serializedCast
		});

		return result;
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			result: []
		};
	}
}

async function fetchMovieDetails(movieId) {
	try {
		const [rows] = await mysql.query(
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

async function fetchGenres(movieId) {
	try {
		const [rows] = await mysql.query(
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

async function fetchCast(movieId) {
	try {
		const [rows] = await mysql.query(
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

/**
 * @param {any[]} rows
 * @returns {MovieDetails[]}
 */
function serializeMovieDetails(rows) {
	return rows.map((record) => ({
		title: record.title,
		release_date: record.release_date,
		overview: record.overview,
		review: record.review,
		runtime: record.runtime,
		poster: record.poster ? Buffer.from(record.poster).toString('base64') : null
	}));
}

/**
 * @param {any[]} rows
 * @returns {Genre[]}
 */
function serializeGenres(rows) {
	return rows.map((record) => ({
		name: record.name
	}));
}

/**
 * @param {any[]} rows
 * @returns {CastMember[]}
 */
function serializeCast(rows) {
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
		const movieId = params.id;

		if (typeof review !== 'string' || review.length === 0) {
			return fail(400, { review, missing: true });
		}

		await updateMovieReview(movieId, review);

		return { success: true };
	},

	updateReview: async ({ params, request }) => {
		const formData = await request.formData();
		const review = formData.get('review');
		const movieId = params.id;

		if (typeof review !== 'string' || review.length === 0) {
			return fail(400, { review, missing: true });
		}

		await updateMovieReview(movieId, review);

		return { success: true };
	},

	removeReview: async ({ params }) => {
		const movieId = params.id;

		await updateMovieReview(movieId, null);

		return { success: true };
	}
};

async function updateMovieReview(movieId, review) {
	try {
		await mysql.query(
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
