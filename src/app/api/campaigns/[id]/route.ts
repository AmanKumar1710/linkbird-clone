import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let result;
  if (status && status !== "All") {
    result = await db.select().from(campaigns).where(eq(campaigns.status, status)).limit(100);
  } else {
    result = await db.select().from(campaigns).limit(100);
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const json = await request.json();
  if (!json.name || !json.status) {
    return NextResponse.json({ error: "Name and status required" }, { status: 400 });
  }

  const result = await db.insert(campaigns).values({
    name: json.name,
    status: json.status,
  }).returning();

  return NextResponse.json(result);
}
