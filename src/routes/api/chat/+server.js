import { createOpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';

import { OPENAI_API_KEY } from '$env/static/private';
console.log('key', OPENAI_API_KEY)
const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { messages } = await request.json();
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  return result.toAIStreamResponse();

}