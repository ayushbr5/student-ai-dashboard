import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  // Extract 'prompt' which is sent by default from useCompletion
  // Extract 'interests' from the custom body
  const { prompt, interests } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'), 
    system: `You are a math teacher. 
             Chat with the student like any other chatbot.
             just answer to the question that he is asking 
              
             Keep the mathematical numbers exactly the same.`,
    // Use the extracted 'prompt' variable here
    prompt: prompt, 
  });

  // Use toTextStreamResponse as requested for simple text streaming
  return result.toTextStreamResponse();
}