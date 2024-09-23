import { pool } from '$lib/server/mysql';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
    try {
        const movieId = params.id;
        const season = parseInt(url.searchParams.get('season') || '1');

        const [seriesName, seasons, season_list, movieDetails, genres, cast] = await Promise.all([
            fetchSeriesName(movieId),
            fetchSeasons(movieId),
            fetchSeason_list(movieId),
            fetchMovieDetails(movieId, season),
            fetchGenres(movieId),
            fetchCast(movieId)
        ]);

        const serializedMovieDetails = serializeMovieDetails(movieDetails);
        const serializedGenres = serializeGenres(genres);
        const serializedCast = serializeCast(cast);

        return {
            seriesName: seriesName,
            seasons: seasons,
            season_list: season_list,
            movieDetails: serializedMovieDetails,
            genres: serializedGenres,
            cast: serializedCast
        };
    } catch (err) {
        console.error('Failed to load data:', err);
        throw error(500, 'Failed to load data');
    }
}

async function fetchSeriesName(movieId) {
    const [rows] = await pool.query('SELECT name FROM tv_series WHERE id = ?', [movieId]);
    return rows[0]?.name || 'Unknown Series';
}

async function fetchSeasons(movieId) {
    const [rows] = await pool.query('SELECT seasons FROM tv_series WHERE id = ?', [movieId]);
    return rows[0]?.seasons || 1;
}

async function fetchSeason_list(movieId) {
    const [rows] = await pool.query('SELECT DISTINCT season_number FROM tv_episodes where id = ? order by season_number', [movieId]);
    return rows;
}

async function fetchMovieDetails(movieId, season) {
    const [rows] = await pool.query(
        `SELECT season_number, episode_number, name, overview, air_date
         FROM tv_episodes
         WHERE id = ? AND season_number = ?
         ORDER BY episode_number`,
        [movieId, season]
    );
    return rows;
}

async function fetchGenres(movieId) {
    const [rows] = await pool.query(
        `SELECT g.name
         FROM tv_series t
         JOIN tv_genres gs ON gs.seriesid = t.id
         JOIN genre g ON g.id = gs.genreid
         WHERE t.id = ?`,
        [movieId]
    );
    return rows;
}

async function fetchCast(movieId) {
    const [rows] = await pool.query(
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

function serializeMovieDetails(rows) {
    return rows.map(record => ({
        season_number: record.season_number,
        episode_number: record.episode_number,
        name: record.name,
        overview: record.overview,
        air_date: record.air_date ? record.air_date.split('T')[0] : null
    }));
}

function serializeGenres(rows) {
    return rows.map(record => ({ name: record.name }));
}

function serializeCast(rows) {
    return rows.map(record => ({
        id: record.id,
        name: record.name,
        character: record.character,
        picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
    }));
}
