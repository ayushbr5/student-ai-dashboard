import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Save a card to the permanent Mastery Bank
export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { q, a, subject } = await req.json();

    const student = await prisma.student.findUnique({
      where: { clerkId: userId }
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const masteredCard = await prisma.masteredFlashcard.create({
      data: {
        question: q,
        answer: a,
        subject: subject || "General",
        studentId: student.id,
        // The createdAt field is handled automatically by Prisma
      }
    });

    return NextResponse.json(masteredCard);
  } catch (error) {
    console.error("[MASTERY_POST_ERROR]", error);
    return NextResponse.json({ error: "Failed to save card" }, { status: 500 });
  }
}

// DELETE: Remove a card from the Mastery Bank
export async function DELETE(req: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: "Card ID is required" }, { status: 400 });
  }

  try {
    // We use deleteMany to ensure the card belongs to the user for security
    const deletion = await prisma.masteredFlashcard.deleteMany({
      where: {
        id: id,
        student: { clerkId: userId }
      }
    });

    if (deletion.count === 0) {
      return NextResponse.json({ error: "Card not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[MASTERY_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}