import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. GET: Fetch all notes for the logged-in user
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the student exists in our DB before fetching
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

    const notes = await prisma.note.findMany({
      where: {
        student: { clerkId }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("[NOTES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 2. POST: Create a new note
export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content } = await req.json();
    const email = user.emailAddresses[0]?.emailAddress;

    // Sync student record first
    const student = await prisma.student.upsert({
      where: { clerkId },
      update: { email },
      create: {
        clerkId,
        email: email || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student",
        interests: [],
      },
    });

    const note = await prisma.note.create({
      data: {
        title,
        content,
        studentId: student.id // Link using the internal CUID
      }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("[NOTES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 3. PATCH: Update an existing note (Secure)
export async function PATCH(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const { id, title, content } = await req.json();

    // Securely update by checking the note ID and the user's clerkId
    const note = await prisma.note.updateMany({
      where: { 
        id,
        student: { clerkId } 
      },
      data: { title, content }
    });

    if (note.count === 0) {
      return new NextResponse("Note not found or unauthorized", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTES_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 4. DELETE: Remove a note (Secure)
export async function DELETE(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!id) return new NextResponse("Note ID missing", { status: 400 });

    // Ensure only the owner can delete the note
    const deletion = await prisma.note.deleteMany({
      where: { 
        id,
        student: { clerkId } 
      }
    });

    if (deletion.count === 0) {
      return new NextResponse("Note not found or unauthorized", { status: 404 });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[NOTES_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}