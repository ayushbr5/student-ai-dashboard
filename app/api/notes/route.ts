import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET & POST remain largely same, but optimized
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();
    if (!clerkId || !user) return new NextResponse("Unauthorized", { status: 401 });

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
      where: { student: { clerkId } },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(notes);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { title, content } = await req.json();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const note = await prisma.note.create({
      data: {
        title,
        content,
        student: { connect: { clerkId } } // Simplified connection
      }
    });
    return NextResponse.json(note);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const { id, title, content } = await req.json();

    // Fix: We use update instead of updateMany to get the actual updated object back
    // but we add the student check in the 'where' clause for security
    const note = await prisma.note.update({
      where: { 
        id,
        student: { clerkId } 
      },
      data: { title, content }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("[NOTES_PATCH]", error);
    return new NextResponse("Unauthorized or Not Found", { status: 404 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!clerkId || !id) return new NextResponse("Bad Request", { status: 400 });

    await prisma.note.delete({
      where: { id, student: { clerkId } }
    });

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}