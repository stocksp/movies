// src/routes/api/movie/[id]/review/+server.js
import { json } from '@sveltejs/kit';
import { updateReview, removeReview } from '$lib/database.js';

export async function POST({ params, request }) {
  const { review } = await request.json();
  await updateReview(params.id, review);
  return json({ success: true });
}

export async function PUT({ params, request }) {
  const { review } = await request.json();
  await updateReview(params.id, review);
  return json({ success: true });
}

export async function DELETE({ params }) {
  await removeReview(params.id);
  return json({ success: true });
}
