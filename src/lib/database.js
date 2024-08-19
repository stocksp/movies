// src/lib/database.js
import { mysql } from '$lib/server/mysql';

/**
 * @param {string} movieId
 * @param {string} review
 * @returns {Promise<import('@libsql/client').ResultSet>}
 */
export async function updateReview(movieId, review) {
	try {
		return await mysql.query({
			sql: `
      UPDATE movies
      SET review = ?
      WHERE id = ?
    `,
			args: [review, movieId]
		});
	} catch (error) {
		console.error('Database query failed:', error);
		ResultSet: null;
	}
}

/**
 * @param {string} movieId
 * @returns {Promise<import('@libsql/client').ResultSet>}
 */
export async function removeReview(movieId) {
	try {
		return await mysql.query({
			sql: `
      UPDATE movies
      SET review = NULL
      WHERE id = ?
    `,
			args: [movieId]
		});
	} catch (error) {
		console.error('Database query failed:', error);
		ResultSet: null;
	}
}
