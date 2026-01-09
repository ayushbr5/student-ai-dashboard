import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function syncStudent() {
  // 1. Check if the user is signed in to Clerk
  const { userId } = await auth();
  if (!userId) return null;

  try {
    // 2. See if the student already exists in your Neon database
    const existingStudent = await prisma.student.findUnique({
      where: { clerkId: userId },
    });

    if (existingStudent) return existingStudent;

    // 3. If they don't exist, fetch their full details from Clerk
    const user = await currentUser();
    if (!user) return null;

    // 4. Create the student record in Neon
    const newStudent = await prisma.student.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
    });

    return newStudent;
  } catch (error) {
    console.error("Error syncing student:", error);
    return null;
  }
}