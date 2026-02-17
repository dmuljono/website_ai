import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    KV_URL: !!process.env.KV_REST_API_URL,
    KV_TOKEN: !!process.env.KV_REST_API_TOKEN,
    STORAGE_URL: !!process.env.STORAGE_REST_API_URL,
    STORAGE_TOKEN: !!process.env.STORAGE_REST_API_TOKEN,
    VERCEL_ENV: process.env.VERCEL_ENV ?? null, // "production" | "preview" | "development"
  });
}
