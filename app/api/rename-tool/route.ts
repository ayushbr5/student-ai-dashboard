import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id, newName, category } = await req.json();

    const updated = await prisma.savedToolResult.update({
      where: { id },
      data: { 
        ...(newName && { toolName: newName }),
        ...(category && { category: category }) // Handles category updates
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[RENAME_PATCH_ERROR]", error);
    return new NextResponse("Error updating document", { status: 500 });
  }
}