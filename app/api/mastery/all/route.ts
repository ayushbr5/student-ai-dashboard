import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. GET: Fetch all cards for the authenticated user
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();
    
    if (!clerkId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the student exists in our DB
    const email = user.emailAddresses[0]?.emailAddress;
    await prisma.student.upsert({
      where: { clerkId },
      update: { email },
      create: {
        clerkId,
        email: email || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student",
        interests: [],
      },
    });

    const cards = await prisma.masteredFlashcard.findMany({
      where: {
        student: { clerkId }
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("[MASTERY_GET_ALL_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch knowledge bank" }, { status: 500 });
  }
}

// 2. DELETE: Clear the entire knowledge bank for this user
export async function DELETE() {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all mastered flashcards belonging to this student
    const deletion = await prisma.masteredFlashcard.deleteMany({
      where: {
        student: { clerkId }
      }
    });

    return NextResponse.json({ 
      message: "Knowledge bank cleared", 
      count: deletion.count 
    });
  } catch (error) {
    console.error("[MASTERY_DELETE_ALL_ERROR]", error);
    return NextResponse.json({ error: "Failed to clear knowledge bank" }, { status: 500 });
  }
}