// @ts-nocheck
// src/routes/+page.server.js
import { turso } from '$lib/server/turso';

export async function load({ params }) {
	const actorId = params.id; // Assuming the movie ID is passed as a route parameter

	// Query 1: Actor details
	const actorDetails = await turso.execute({
		sql: `
          select a.name, substr(a.birthday, 0, instr(a.birthday, ' ')) as birthday, substr(a.deathday, 0, instr(a.deathday, ' ')) as deathday, a.birthplace, a.biography, a.picture
          from actors a
          where a.id = ?
    `,
		args: [actorId]
	});

	// Query 2: Roles
	const roles = await turso.execute({
		sql: `
           select c.character, m.id as movieId, m.title, substr(m.release_date, 0, instr(m.release_date, ' ')) as releasedate
         from cast c
         join movies m on m.id = c.movieid
         where c.actorid = ?
         order by substr(m.release_date, instr(m.release_date, ' ') -4, 4)
    `,
		args: [actorId]
	});

	// Serialize the data
	const serializedactorDetails = actorDetails.rows.map((record) => ({
		...record,
		picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
	}));

	// Return the data
	return {
		actorDetails: serializedactorDetails[0], // Assuming there's only one actor
		roles: roles.rows
	};
}
