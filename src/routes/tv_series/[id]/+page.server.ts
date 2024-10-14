import { pool } from '$lib/server/mysql';
import { error } from '@sveltejs/kit';
import type { RowDataPacket } from 'mysql2';

interface SeasonList {
	season_number: number;
}

interface TvSeriesDetails {
	season_number: number;
	episode_number: number;
	name: string;
	overview: string;
	air_date: Date;
}

interface Genre {
	name: string;
}

interface CastMember {
	id: number;
	name: string;
	character: string;
	picture: string | null;
}

export async function load({ params, url }) {
	try {
		const movieId = parseInt(params.id);
		const seasonListResult = await fetchSeasonList(movieId);
		const seasonList = seasonListResult as SeasonList[];
		let season = getSeason(url, seasonList)

		console.log('server doing', season);

		const [seriesName, seasons, movieDetailsResult, genresResult, castResult] = await Promise.all([
			fetchSeriesName(movieId),
			fetchSeasons(movieId),
			fetchMovieDetails(movieId, season),
			fetchGenres(movieId),
			fetchCast(movieId)
		]);

		const movieDetails = serializeMovieDetails(movieDetailsResult as RowDataPacket[]);
		const genres = serializeGenres(genresResult as RowDataPacket[]);
		const cast = serializeCast(castResult as RowDataPacket[]);

		return {
			seriesName: seriesName,
			seasons: seasons,
			season_list: seasonList,
			movieDetails: movieDetails,
			genres: genres,
			cast: cast,
			season
		};
	} catch (err) {
		console.error('Failed to load data:', err);
		throw error(500, 'Failed to load data');
	}
}
// navigating from search we have no season param
// all client side navigation have a 'season' from the select
function getSeason(url: URL, theList: SeasonList[]): number {
	const tmp = url.searchParams.get('season');
	if (tmp) return parseInt(tmp);
	// figure out from what's in theList what we return
	if (theList[0].season_number === 0 && theList.length > 1) {
		return theList[1].season_number;
	}
	return theList[0].season_number;
}

async function fetchSeriesName(movieId: number): Promise<string> {
	const [rows] = await pool.query<RowDataPacket[]>('SELECT name FROM tv_series WHERE id = ?', [
		movieId
	]);
	return rows[0]?.name || 'Unknown Series';
}

async function fetchSeasons(movieId: number): Promise<number> {
	const [rows] = await pool.query<RowDataPacket[]>('SELECT seasons FROM tv_series WHERE id = ?', [
		movieId
	]);
	return rows[0]?.seasons || 1;
}

async function fetchSeasonList(movieId: number): Promise<RowDataPacket[]> {
	const [rows] = await pool.query<RowDataPacket[]>(
		'SELECT DISTINCT season_number FROM tv_episodes where id = ? order by season_number',
		[movieId]
	);
	return rows;
}

async function fetchMovieDetails(movieId: number, season: number): Promise<RowDataPacket[]> {
	const [rows] = await pool.query<RowDataPacket[]>(
		`SELECT season_number, episode_number, name, overview, air_date
         FROM tv_episodes
         WHERE id = ? AND season_number = ?
         ORDER BY episode_number`,
		[movieId, season]
	);
	return rows;
}

async function fetchGenres(movieId: number): Promise<RowDataPacket[]> {
	const [rows] = await pool.query<RowDataPacket[]>(
		`SELECT g.name
         FROM tv_series t
         JOIN tv_genres gs ON gs.seriesid = t.id
         JOIN genre g ON g.id = gs.genreid
         WHERE t.id = ?`,
		[movieId]
	);
	return rows;
}

async function fetchCast(movieId: number): Promise<RowDataPacket[]> {
	const [rows] = await pool.query<RowDataPacket[]>(
		`SELECT a.id, a.name, c.character, a.picture
         FROM tv_series t
         JOIN tv_cast c ON c.seriesid = t.id
         JOIN actors a ON a.id = c.actorid
         WHERE t.id = ?
         ORDER BY c.character_order`,
		[movieId]
	);
	return rows;
}

function serializeMovieDetails(rows: RowDataPacket[]): TvSeriesDetails[] {
	return rows.map((record) => ({
		season_number: record.season_number,
		episode_number: record.episode_number,
		name: record.name,
		overview: record.overview,
		air_date: record.air_date ? record.air_date : null
	}));
}

function serializeGenres(rows: RowDataPacket[]): Genre[] {
	return rows.map((record) => ({ name: record.name }));
}

function serializeCast(rows: RowDataPacket[]): CastMember[] {
	return rows.map((record) => ({
		id: record.id,
		name: record.name,
		character: record.character,
		picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
	}));
}
