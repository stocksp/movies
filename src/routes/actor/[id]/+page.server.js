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
            a.birthday,
            a.deathday,
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
            m.release_date
        FROM cast c
        JOIN movies m ON m.id = c.movieid
        WHERE c.actorid = ?
        ORDER BY m.release_date
    `,
			[actorId]
		);

		// Query 3: TVRoles
		const [tv_roles] = await pool.query(
			`
        SELECT 
            c.character, 
            s.id as seriesid, 
            s.name,
			s.first_air_date
        FROM tv_cast c
        JOIN tv_series s ON s.id = c.seriesid
        WHERE c.actorid = ?
        ORDER BY s.first_air_date
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
			roles: roles,
			tv_roles: tv_roles
		};
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			roles: [],
			tv_roles: []
		};
	}
}
