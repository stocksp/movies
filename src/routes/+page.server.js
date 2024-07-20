import { turso } from '$lib/server/turso';

/** @typedef {Object} Genre
 * @property {number} id
 * @property {string} name
 */

/**
 * @returns {Promise<{ genre: Genre[] }>}
 */
export async function load() {
    const result = await turso.execute({
        sql: `SELECT g.id, g.name FROM genre g`,
        args: [],
    });

    /** @type {Genre[]} */
    const genres = result.rows.map(row => ({
        id: Number(row.id),
        name: String(row.name)
    }));

    return {
        genre: genres
    };
}
