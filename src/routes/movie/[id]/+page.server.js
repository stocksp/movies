// @ts-nocheck
// src/routes/+page.server.js
import { turso } from '$lib/server/turso';

export async function load({ params }) {
  const movieId = params.id; // Assuming the movie ID is passed as a route parameter

  // Query 1: Movie details
  const movieDetails = await turso.execute({
    sql: `
      select m.title, m.release_date, m.overview, m.runtime, m.poster
      from movies m
      where m.id = ?
    `,
    args: [movieId],
  });

  // Query 2: Genres
  const genres = await turso.execute({
    sql: `
      select g.name from
      movies m
      join genres gs on gs.movieid = m.id
      join genre g on g.id = gs.genreid
      where m.id = ?
    `,
    args: [movieId],
  });

  // Query 3: Cast
  const cast = await turso.execute({
    sql: `
      select a.name, c.character, a.picture,
      (select count(*) from cast where actorid = c.actorid) as roles
      from movies m
      join cast c on c.movieid = m.id
      join actors a on a.id = c.actorid
      where m.id = ?
      order by roles desc
    `,
    args: [movieId],
  });

  // Serialize the data
  const serializedMovieDetails = movieDetails.rows.map(record => ({
    ...record,
    poster: record.poster ? Buffer.from(record.poster).toString('base64') : null
  }));

  const serializedCast = cast.rows.map(record => ({
    ...record,
    picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
  }));

  // Return the data
  return {
    movieDetails: serializedMovieDetails[0], // Assuming there's only one movie
    genres: genres.rows,
    cast: serializedCast
  };
}
