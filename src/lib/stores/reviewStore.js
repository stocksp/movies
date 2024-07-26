import { writable } from 'svelte/store';

/**
 * @typedef {Object.<string, string>} ReviewCacheType
 */

/**
 * Writable store for caching movie reviews
 * @type {import('svelte/store').Writable<ReviewCacheType>}
 */
export const reviewCache = writable({});

/**
 * Adds a review to the cache
 * @param {string} movieTitle - The title of the movie
 * @param {string} review - The review text
 */
export function addReviewToCache(movieTitle, review) {
    reviewCache.update(cache => ({
        ...cache,
        [movieTitle]: review
    }));
}

/**
 * Retrieves a review from the cache
 * @param {string} movieTitle - The title of the movie
 * @returns {string|undefined} The cached review or undefined if not found
 */
export function getReviewFromCache(movieTitle) {
    let cachedReview;
    reviewCache.subscribe(cache => {
        cachedReview = cache[movieTitle];
    })();
    return cachedReview;
}

/**
 * Clears the entire review cache
 */
export function clearReviewCache() {
    reviewCache.set({});
}
