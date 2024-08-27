// @ts-nocheck
// src/routes/+page.server.js
import { pool } from '$lib/server/mysql';

export async function load({ params }) {
	try {
		const actorId = params.id; // Assuming the actor ID is passed as a route parameter

		// Query 1: Actor details
		const [actorDetails] = await pool.query(
			`
        SELECT 
            a.name, 
            substr(a.birthday, 1, instr(a.birthday, ' ') -1) as birthday, 
            substr(a.deathday, 1, instr(a.deathday, ' ') -1) as deathday, 
            a.birthplace, 
            a.biography, 
            a.picture
        FROM actors a
        WHERE a.id = ?
    `,
			[actorId]
		);

		// Query 2: Roles
		const [roles] = await pool.query(
			`
        SELECT 
            c.character, 
            m.id as movieId, 
            m.title, 
            substr(m.release_date, 1, instr(m.release_date, ' ')) as releasedate
        FROM cast c
        JOIN movies m ON m.id = c.movieid
        WHERE c.actorid = ?
        ORDER BY substr(m.release_date, instr(m.release_date, ' ') -4, 4)
    `,
			[actorId]
		);

		// Serialize the data
		const serializedActorDetails = actorDetails.map((record) => ({
			...record,
			picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
		}));

		// Return the data
		return {
			actorDetails: serializedActorDetails[0], // Assuming there's only one actor
			roles: roles
		};
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			roles: []
		};
	}
}
