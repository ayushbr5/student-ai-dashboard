import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, prompt, systemRole } = await req.json();

  // Support both useChat (messages) and useCompletion (prompt)
  const coreMessages = messages || (prompt ? [{ role: 'user', content: prompt }] : []);

  const result = streamText({
    // Return to the versatile text model
    model: groq('llama-3.3-70b-versatile'),
    system: systemRole || "You are a helpful AI assistant.",
    messages: coreMessages,
  });

  return result.toTextStreamResponse();
}