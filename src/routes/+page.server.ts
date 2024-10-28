import { pool } from '$lib/server/mysql';
import type { RowDataPacket } from 'mysql2';

export async function load(): Promise<{ genre: Genre[] }> {
	try {
		const [rows] = await pool.query<RowDataPacket[]>(`SELECT g.id, g.name FROM genre g`);

		const genres = rows.map((row) => ({
			id: Number(row.id),
			name: String(row.name)
		}));

		return {
			genre: genres
		};
	} catch (error) {
		console.error('Database query failed:', error);
		return {
			genre: []
		};
	}
}
