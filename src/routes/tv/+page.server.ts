// +page.server.ts
import { pool } from '$lib/server/mysql';
import type { PageServerLoad } from './$types';

export type Genre = {
	id: number;
	name: string;
};

export const load: PageServerLoad = async () => {
	try {
		const [rows, fields] = await pool.query(`SELECT g.id, g.name FROM genre g
			                                     WHERE EXISTS (SELECT 1 FROM tv_genres tvg WHERE g.id = tvg.genreid)
												 ORDER BY g.name`);
	
		const genres: Genre[] = rows.map((row: RowDataPacket) => { 
		  return {
			id: Number(row.id),
			name: String(row.name)
		  };
		});
	
		return {
		  genre: genres
		};
	  } catch (error) {
		console.error('Database query failed:', error);
		return {
		  genre: []
		};
	  }
};
