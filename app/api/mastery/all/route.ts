import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  
  // 1. Verify Authentication
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Fetch all cards for the authenticated user
    const cards = await prisma.masteredFlashcard.findMany({
      where: {
        student: { clerkId: userId }
      },
      orderBy: { 
        createdAt: 'desc' // Most recent knowledge first
      }
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("[MASTERY_GET_ALL_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch knowledge bank" }, { status: 500 });
  }
}