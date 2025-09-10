import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const inserted = await db
      .insert(users)
      .values({
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(), // Combine for NextAuth compatibility
      })
      .returning();

    return NextResponse.json({ user: inserted[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Registration failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
