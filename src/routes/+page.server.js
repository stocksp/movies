import { mysql } from '$lib/server/mysql';

/** @typedef {Object} Genre
 * @property {number} id
 * @property {string} name
 */

/**
 * @returns {Promise<{ genre: Genre[] }>}
 */
export async function load() {
    const [rows] = await mysql.query({
        sql: `SELECT g.id, g.name FROM genre g`,
        args: [],
    });

    /** @type {Genre[]} */
    const genres = rows.map(row => ({
        id: Number(row.id),
        name: String(row.name)
    }));

    return {
        genre: genres
    };
}
