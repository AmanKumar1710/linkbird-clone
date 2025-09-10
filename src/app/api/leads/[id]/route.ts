import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const result = await db.select().from(leads).where(eq(leads.id, params.id)).limit(1);
  const lead = result[0] || null;
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const json = await request.json();
  const result = await db.update(leads).set({ status: json.status }).where(eq(leads.id, params.id)).returning();
  return NextResponse.json(result);
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await db.delete(leads).where(eq(leads.id, params.id));
  return NextResponse.json({ success: true });
}

