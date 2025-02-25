import { OpenAI } from 'openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';

// @ts-ignore
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
    const { messages } = await request.json();
    console.log("Server received messages:", messages);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            stream: true,
            messages,
        });

        console.log("OpenAI API call successful"); // Add this line

        const stream = new ReadableStream({
            async start(controller) {
                //console.log("ReadableStream started"); // Add this line
                try {
                    for await (const part of response) {
                        const content = part.choices[0]?.delta?.content || '';
                      //  console.log("Received part from OpenAI:", content); // Add this line
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                  //  console.log("Stream completed successfully"); // Add this line
                    controller.close();
                } catch (streamError) {
                    console.error("Error in ReadableStream:", streamError);
                    controller.error(streamError); // Propagate the error
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
            },
        });
    } catch (e) {
        console.error("OpenAI API error:", e);
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}) satisfies RequestHandler;
