// @ts-nocheck
import { turso } from '$lib/server/turso';
/**
 * @typedef {Object} LoadEvent
 * @property {URL} url
 */

/**
 * @typedef {Object} LoadResult
 * @property {string | null} name
 * @property {string[]} genres
 * @property {number | null} genrecount
 */

/**
 * @param {LoadEvent} event
 * @returns {Promise<LoadResult>}
 */
export async function load({ url }) {
    const name = url.searchParams.get('name');
    const genres = url.searchParams.getAll('genres');
    const genrestring = genres.join(", ");
    const genrecount = Number(url.searchParams.get('genrecount'));
 
    console.log('Search parameters:', { name, genrestring, genrecount });
    const movieData = await turso.execute({
        sql: `
        SELECT CASE
        WHEN m.title LIKE 'a %' THEN SUBSTR(m.title, 3)
        WHEN m.title LIKE 'the %' THEN SUBSTR(m.title, 5)
        ELSE m.title
        END AS title
        ,m.release_date, m.overview, m.runtime, m.poster
        FROM movies m
        where (
           select count(*)
           from genres gs
           join genre g on g.id = gs.genreid
           where movieid = m.id and g.name in ('Comedy', 'Horror')
        ) = ?
        AND m.title LIKE ?
        ORDER BY title COLLATE NOCASE
        `,
        args: [genrecount, `%${name}%`]
    });
    const serializedMovieData = movieData.rows.map(record => ({
        ...record,
        poster: record.poster ? Buffer.from(record.poster).toString('base64') : null
      }));
  
    // TODO: Perform database query here
    // For now, we'll just return the parameters
    return {
        movieData: serializedMovieData
    };
  }
  