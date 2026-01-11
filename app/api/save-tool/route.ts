import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST: Saves an AI Tool result. 
 * Automatically creates a Student record if it doesn't exist (Upsert).
 */
export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser(); // Required to get email for your Schema
    
    // 1. Authentication Check
    if (!clerkId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { toolName, toolId, input, output } = await req.json();

    // 2. Data Validation
    if (!toolName || !input || !output) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Extract Email (Required by your Student model)
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email associated with this account" }, { status: 400 });
    }

    // 4. Upsert Student: This ensures the record exists before saving the tool
    const student = await prisma.student.upsert({
      where: { clerkId },
      update: { email }, // Keep email in sync if changed in Clerk
      create: { 
        clerkId,
        email, // Matches your @unique requirement
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student",
        interests: [], // Initializes the string array
      },
    });

    // 5. Create the SavedToolResult linked to the internal student ID
    const savedDoc = await prisma.savedToolResult.create({
      data: {
        studentId: student.id,
        toolName,
        toolId,
        input,
        output,
        category: "General" // Providing a default value for your optional field
      }
    });

    return NextResponse.json(savedDoc);
  } catch (error) {
    console.error("[SAVE_TOOL_POST_ERROR]", error);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}

/**
 * DELETE: Securely removes a saved tool result.
 * Ensures the record belongs to the authenticated user.
 */
export async function DELETE(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // 1. Auth and ID presence check
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    // 2. Secure deletion: Filter by ID AND the student's clerkId
    const deletion = await prisma.savedToolResult.deleteMany({
      where: {
        id: id,
        student: { clerkId: clerkId } 
      }
    });

    // 3. Verify if a record was actually removed
    if (deletion.count === 0) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("[SAVE_TOOL_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Error deleting record" }, { status: 500 });
  }
}