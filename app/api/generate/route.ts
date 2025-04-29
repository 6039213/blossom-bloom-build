
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const key = process.env.GEMINI_API_KEY!;
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview:generateContent?key="+key,
    { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ role: "user", parts: [{ text: prompt }] }] 
      }) 
    }
  );
  if (!res.ok) return NextResponse.json({ error: res.statusText }, { status: res.status });
  return NextResponse.json(await res.json());
}
