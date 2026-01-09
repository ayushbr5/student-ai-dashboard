import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const student = await prisma.student.findUnique({
      where: { clerkId },
    });

    if (!student) return new NextResponse("Student not found", { status: 404 });

    const savedDocs = await prisma.savedToolResult.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(savedDocs);
  } catch (error) {
    console.error("[GET_SAVED_TOOLS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}