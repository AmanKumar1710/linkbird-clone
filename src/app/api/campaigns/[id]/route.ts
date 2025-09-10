import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper to extract campaign id from the URL
function getIdFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  const match = url.pathname.match(/\/api\/campaigns\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  const id = getIdFromRequest(request);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  const campaign = result[0] || null;
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function PUT(request: Request) {
  const id = getIdFromRequest(request);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const json = await request.json();
  if (!json.name || !json.status) {
    return NextResponse.json({ error: "Name and status required" }, { status: 400 });
  }

  const result = await db.update(campaigns).set({
    name: json.name,
    status: json.status,
    updatedAt: new Date(),
  }).where(eq(campaigns.id, id)).returning();

  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const id = getIdFromRequest(request);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await db.delete(campaigns).where(eq(campaigns.id, id));
  return NextResponse.json({ success: true });
}
