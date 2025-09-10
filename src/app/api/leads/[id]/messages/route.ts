import { NextResponse } from "next/server";
let messagesStorage: Record<string, any> = {};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return messagesStorage[params.id] ? NextResponse.json(messagesStorage[params.id]) : NextResponse.json({});
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const json = await request.json();
  messagesStorage[params.id] = json;
  return NextResponse.json({ success: true });
}
