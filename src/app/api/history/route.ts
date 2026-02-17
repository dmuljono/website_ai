import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ history: [] });

  const key = `dt:chat:${sessionId}`;
  const items = await redis.lrange<string>(key, 0, -1);

  const history = items
    .map((s) => {
      try { return JSON.parse(s); } catch { return null; }
    })
    .filter(Boolean);

  return NextResponse.json({ history });
}
