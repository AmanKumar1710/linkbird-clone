import { NextResponse } from "next/server";
let messagesStorage: Record<string, any> = {};

// Helper to extract lead id from the URL
function getLeadIdFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  // This will match `/api/leads/123/messages`
  const match = url.pathname.match(/\/api\/leads\/([^/]+)\/messages/);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  const leadId = getLeadIdFromRequest(request);
  if (!leadId) return NextResponse.json({}, { status: 400 });

  return messagesStorage[leadId]
    ? NextResponse.json(messagesStorage[leadId])
    : NextResponse.json({});
}

export async function POST(request: Request) {
  const leadId = getLeadIdFromRequest(request);
  if (!leadId) return NextResponse.json({ error: "Lead id required" }, { status: 400 });

  const json = await request.json();
  messagesStorage[leadId] = json;
  return NextResponse.json({ success: true });
}
