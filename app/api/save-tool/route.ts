import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Using your existing prisma client

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const { toolName, toolId, input, output } = await req.json();

    // Find the student in your database using their Clerk ID
    const student = await prisma.student.findUnique({
      where: { clerkId },
    });

    if (!student) return new NextResponse("Student not found", { status: 404 });

    const savedDoc = await prisma.savedToolResult.create({
      data: {
        studentId: student.id,
        toolName,
        toolId,
        input,
        output
      }
    });

    return NextResponse.json(savedDoc);
  } catch (error) {
    console.error("[SAVE_TOOL_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!clerkId || !id) return new NextResponse("Unauthorized or Missing ID", { status: 401 });

    await prisma.savedToolResult.delete({
      where: { id }
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    return new NextResponse("Error deleting record", { status: 500 });
  }
}