import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { content } = await req.json();

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: "You are a helpful assistant that creates very short, 3-5 word catchy titles for study notes. Return ONLY the title text, no quotes or extra words.",
      prompt: `Generate a title for this content: ${content.substring(0, 500)}`, // Send a snippet to save tokens
    });

    return NextResponse.json({ title: text.trim() });
  } catch (error) {
    return new NextResponse("Error generating title", { status: 500 });
  }
}