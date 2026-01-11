import { groq } from '@ai-sdk/groq';
import { generateText } from "ai";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  
  // Return JSON even for Auth errors to prevent frontend parsing crashes
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch the user's latest 3 notes from Prisma
    const userNotes = await prisma.note.findMany({
      where: {
        student: { clerkId: userId }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3 
    });

    if (!userNotes || userNotes.length === 0) {
      return Response.json({ 
        message: "Notebook is empty! Save some notes first." 
      }, { status: 404 });
    }

    const context = userNotes.map(n => `Topic: ${n.title}\nContent: ${n.content}`).join("\n\n");

    // 2. Use Groq llama-3.3-70b for fast JSON generation
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a learning scientist. Create 5 high-impact flashcards for active recall.
      Instructions:
      - Return ONLY a raw JSON array.
      - Do not include markdown, backticks, or 'json' labels.
      - Ensure the output is valid JSON.
      Format: [{"q": "Question", "a": "Answer"}]`,
      prompt: `Notes context: ${context}`,
    });

    // 3. Robust JSON Parsing
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const flashcards = JSON.parse(cleanJson);

    return Response.json(flashcards);

  } catch (error) {
    console.error("Groq Sync Error:", error);
    
    // Always return JSON to avoid the "Unexpected token A" error
    return Response.json({ 
      error: "AI_SYNC_FAILED", 
      message: "Neural engine failed to generate cards. Try syncing again." 
    }, { status: 500 });
  }
}