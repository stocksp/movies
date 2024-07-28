// src/lib/database.js
import { turso } from '$lib/server/turso';

/**
 * @param {string} movieId
 * @param {string} review
 * @returns {Promise<import('@libsql/client').ResultSet>}
 */
export async function updateReview(movieId, review) {
  return await turso.execute({
    sql: `
      UPDATE movies
      SET review = ?
      WHERE id = ?
    `,
    args: [review, movieId],
  });
}

/**
 * @param {string} movieId
 * @returns {Promise<import('@libsql/client').ResultSet>}
 */
export async function removeReview(movieId) {
  return await turso.execute({
    sql: `
      UPDATE movies
      SET review = NULL
      WHERE id = ?
    `,
    args: [movieId],
  });
}
