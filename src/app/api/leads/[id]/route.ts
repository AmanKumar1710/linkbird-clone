import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper to extract lead id from URL
function getIdFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  const match = url.pathname.match(/\/api\/leads\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  const id = getIdFromRequest(request);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  const lead = result[0] || null;
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(request: Request) {
  const id = getIdFromRequest(request);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const json = await request.json();
  const result = await db.update(leads).set({ status: json.status }).where(eq(leads.id, id)).returning();
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const id = getIdFromRequest(request);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await db.delete(leads).where(eq(leads.id, id));
  return NextResponse.json({ success: true });
}
