import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const result = await db.select().from(campaigns).where(eq(campaigns.id, params.id)).limit(1);
  const campaign = result[0] || null;
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const json = await request.json();
  if (!json.name || !json.status) {
    return NextResponse.json({ error: "Name and status required" }, { status: 400 });
  }

  const result = await db.update(campaigns).set({
    name: json.name,
    status: json.status,
    updatedAt: new Date(),
  }).where(eq(campaigns.id, params.id)).returning();

  return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await db.delete(campaigns).where(eq(campaigns.id, params.id));
  return NextResponse.json({ success: true });
}
