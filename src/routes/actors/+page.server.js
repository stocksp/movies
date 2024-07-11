// @ts-nocheck
// src/routes/+page.server.js
import { turso } from '$lib/server/turso';

export async function load() {
  const movieData = await turso.execute({
    sql: `
      select m.title, m.release_date, a.name, c.character, a.birthday, 
       a.birthplace, a.picture
      from movies m
      join cast c on c.movieid = m.id
      join actors a on a.id = c.actorid
      where m.id = 4513
    `,
    args: [],
  });

  const serializedMovieData = movieData.rows.map(record => ({
    ...record,
    picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
  }));

  return {
    movieData: serializedMovieData
  };
}

