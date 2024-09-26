import { pool } from '$lib/server/mysql';
import type { RowDataPacket } from 'mysql2';

interface ActorDetails {
	name: string;
	birthday: Date;
	deathday: Date;
	birthplace: string;
	biography: string;
	picture: string | null;
}

interface Role {
	character: string;
	movieId: number;
	title: string;
	release_date: Date;
}

interface TvRole {
	character: string;
	seriesid: number;
	name: string;
	first_air_date: Date;
}

export async function load({ params }) {
	try {
		const actorId = params.id;

		const [actorDetailsResult] = await pool.query(
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

		const [rolesResult] = await pool.query(
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

		const [tvRolesResult] = await pool.query(
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

		const actorDetails = (actorDetailsResult as RowDataPacket[]).map((record) => ({
			name: record.name,
			birthday: record.birthday,
			deathday: record.deathday,
			birthplace: record.birthplace,
			biography: record.biography,
			picture: record.picture ? Buffer.from(record.picture).toString('base64') : null
		  })) as ActorDetails[]; // Add type assertion here

		const roles = rolesResult as Role[];
		const tv_roles = tvRolesResult as TvRole[];

		return {
			actorDetails: actorDetails[0],
			roles,
			tv_roles
		};
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			actorDetails: {} as ActorDetails, // Provide a default empty object
			roles: [],
			tv_roles: []
		};
	}
}
