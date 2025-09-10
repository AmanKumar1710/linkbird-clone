import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/db/schema";
import { and, eq, ilike } from "drizzle-orm";

// --- GET: fetch leads list with filter/search ---
export async function GET(request: Request) {
  const url = new URL(request.url);
  const campaignId = url.searchParams.get("campaign_id");
  const search = url.searchParams.get("search");
  const status = url.searchParams.get("status");

  // Build dynamic Drizzle "where" conditions array
  const conditions: any[] = [];

  if (campaignId) conditions.push(eq(leads.campaignId, campaignId));
  if (status && status !== "All") conditions.push(eq(leads.status, status));
  if (search) {
    // SQL "ILIKE" for case-insensitive match on name or email
    conditions.push(
      ilike(leads.name, `%${search}%`)
    );
    // For additional email field match, use or:
    // conditions.push(
    //   or(ilike(leads.name, `%${search}%`), ilike(leads.email, `%${search}%`))
    // );
  }

  const query = db
    .select()
    .from(leads)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(100);

  const result = await query;
  return NextResponse.json(result);
}

// --- POST: create new lead ---
export async function POST(request: Request) {
  const json = await request.json();
  if (!json.name || !json.campaignId) {
    return NextResponse.json({ error: "Name and campaignId required" }, { status: 400 });
  }
  const data = {
    name: json.name,
    email: json.email,
    company: json.company,
    campaignId: json.campaignId,
    status: json.status ?? "Pending Approval",
    lastContactDate: json.lastContactDate ? new Date(json.lastContactDate) : undefined,
  };

  const result = await db.insert(leads).values(data).returning();
  return NextResponse.json(result);
}
