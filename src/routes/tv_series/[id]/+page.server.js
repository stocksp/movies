// src/routes/movie/[id]/+page.server.js
import { pool } from '$lib/server/mysql';
import { get } from 'svelte/store';
import { fail } from '@sveltejs/kit';

// ... (keep all type definitions as they are)

export async function load({ params }) {
	try {
		const movieId = params.id;

		let result;
		const [seriesName, movieDetails, genres, cast] = await Promise.all([
			fetchSeriesName(movieId),
			fetchMovieDetails(movieId),
			fetchGenres(movieId),
			fetchCast(movieId)
		]);

		const serializedMovieDetails = serializeMovieDetails(movieDetails);
		const serializedGenres = serializeGenres(genres);
		const serializedCast = serializeCast(cast);

		result = /** @type {MovieData} */ ({
			seriesName: seriesName,
			movieDetails: serializedMovieDetails,
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

async function fetchSeriesName(movieId) {
	try {
		const [rows] = await pool.query('SELECT name FROM tv_series WHERE id = ?', [movieId]);
		return rows[0]?.name || 'Unknown Series';
	} catch (error) {
		console.error('Database query failed:', error);
		return 'Unknown Series';
	}
}

async function fetchMovieDetails(movieId) {
	try {
		const [rows] = await pool.query(
			`
    SELECT e.season_number, e.episode_number, e.name, e.overview, e.air_date
    FROM tv_episodes e
    WHERE e.id = ?
	ORDER BY e.season_number, e.episode_number
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
		const [rows] = await pool.query(
			`
    SELECT g.name FROM
    tv_series t
    JOIN tv_genres gs ON gs.seriesid = t.id
    JOIN genre g ON g.id = gs.genreid
    WHERE t.id = ?
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
		const [rows] = await pool.query(
			`
    SELECT a.id, a.name, c.character, a.picture
    FROM tv_series t
    JOIN tv_cast c ON c.seriesid = t.id
    JOIN actors a ON a.id = c.actorid
    WHERE t.id = ?
    ORDER BY c.character_order
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
		season_number: record.season_number,
		episode_number: record.episode_number,
		name: record.name,
		overview: record.overview,
		air_date: record.air_date ? record.air_date.split(' ')[0] : null
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
		picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
	}));
}
