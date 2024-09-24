// src/lib/stores/movieStore.js
import { writable } from 'svelte/store';

/**
 * @typedef {import('../../routes/movie/[id]/+page.server').MovieData} MovieData
 */

/**
 * @type {import('svelte/store').Writable<Record<string, MovieData>>}
 */
