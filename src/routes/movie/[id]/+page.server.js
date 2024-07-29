// src/routes/movie/[id]/+page.server.js
import { turso } from '$lib/server/turso';
import { movieCache } from '$lib/stores/movieStore';
import { get } from 'svelte/store';
import { fail } from '@sveltejs/kit';

/**
 * @typedef {Object} MovieDetails
 * @property {string} title
 * @property {string} release_date
 * @property {string} overview
 * @property {string} review
 * @property {number} runtime
 * @property {string|null} poster
 */

/**
 * @typedef {Object} Genre
 * @property {string} name
 */

/**
 * @typedef {Object} CastMember
 * @property {number} id
 * @property {string} name
 * @property {string} character
 * @property {string|null} picture
 * @property {number} roles
 */

/**
 * @typedef {Object} MovieData
 * @property {MovieDetails} movieDetails
 * @property {Genre[]} genres
 * @property {CastMember[]} cast
 */

/**
 * Load function for the movie page
 * @param {{ params: { id: string } }} event
 * @returns {Promise<MovieData>}
 */
export async function load({ params }) {
  const movieId = params.id;
  const cachedMovies = get(movieCache);

  let result;
  // Check if the movie data is already in the cache
  if (cachedMovies[movieId]) {
    result = cachedMovies[movieId];
  } else {
    // If not in cache, fetch the data
    const [movieDetails, genres, cast] = await Promise.all([
      fetchMovieDetails(movieId),
      fetchGenres(movieId),
      fetchCast(movieId)
    ]);

    // Serialize the data
    const serializedMovieDetails = serializeMovieDetails(movieDetails.rows);
    const serializedGenres = serializeGenres(genres.rows);
    const serializedCast = serializeCast(cast.rows);

    // Prepare the result
    result = /** @type {MovieData} */ ({
      movieDetails: serializedMovieDetails[0],
      genres: serializedGenres,
      cast: serializedCast
    });
  }

  // Update the cache
  movieCache.update(cache => ({ ...cache, [movieId]: result }));

  // Return the data
  return result;
}

/**
 * @param {string} movieId
 * @returns {Promise<import('@libsql/client').ResultSet>}
 */
async function fetchMovieDetails(movieId) {
  return await turso.execute({
    sql: `
      select m.title, m.release_date, m.overview, m.review, m.runtime, m.poster
      from movies m
      where m.id = ?
    `,
    args: [movieId],
  });
}

/**
 * @param {string} movieId
 * @returns {Promise<import('@libsql/client').ResultSet>}
 */
async function fetchGenres(movieId) {
  return await turso.execute({
    sql: `
      select g.name from
      movies m
      join genres gs on gs.movieid = m.id
      join genre g on g.id = gs.genreid
      where m.id = ?
    `,
    args: [movieId],
  });
}

/**
 * @param {string} movieId
 * @returns {Promise<import('@libsql/client').ResultSet>}
 */
async function fetchCast(movieId) {
  return await turso.execute({
    sql: `
      select a.id, a.name, c.character, a.picture,
      (select count(*) from cast where actorid = c.actorid) as roles
      from movies m
      join cast c on c.movieid = m.id
      join actors a on a.id = c.actorid
      where m.id = ?
      order by roles desc
    `,
    args: [movieId],
  });
}

/**
 * @param {any[]} rows
 * @returns {MovieDetails[]}
 */
function serializeMovieDetails(rows) {
  return rows.map(record => ({
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
  return rows.map(record => ({
    name: record.name
  }));
}

/**
 * @param {any[]} rows
 * @returns {CastMember[]}
 */
function serializeCast(rows) {
  return rows.map(record => ({
    id: record.id,
    name: record.name,
    character: record.character,
    picture: record.picture ? Buffer.from(record.picture).toString('base64') : null,
    roles: record.roles
  }));
}

/** @type {import('./$types').Actions} */
export const actions = {
  addReview: async ({ params, request }) => {
    const formData = await request.formData();
    const review = formData.get('review');
    const movieId = params.id;

    if (typeof review !== 'string' || review.length === 0) {
      return fail(400, { review, missing: true });
    }

    await updateMovieReview(movieId, review);
    clearMovieCache(movieId);

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
    clearMovieCache(movieId);

    return { success: true };
  },

  removeReview: async ({ params }) => {
    const movieId = params.id;

    await updateMovieReview(movieId, null);
    clearMovieCache(movieId);

    return { success: true };
  }
};

/**
 * @param {string} movieId
 * @param {string|null} review
 */
async function updateMovieReview(movieId, review) {
  await turso.execute({
    sql: `
      UPDATE movies
      SET review = ?
      WHERE id = ?
    `,
    args: [review, movieId],
  });
}

/**
 * @param {string} movieId
 */
function clearMovieCache(movieId) {
  movieCache.update(cache => {
    const updatedCache = { ...cache };
    delete updatedCache[movieId];
    return updatedCache;
  });
}
