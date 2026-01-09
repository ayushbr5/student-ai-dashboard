import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt, messages, systemRole } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    // This 'system' instruction is the key to making the tool unique!
    system: systemRole || "You are a helpful AI assistant.",
    // Handle both Assistant (messages) and Tools (prompt)
    messages: messages || [{ role: 'user', content: prompt }],
  });

  return result.toTextStreamResponse();
}