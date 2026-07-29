import { NextResponse } from "next/server";

const BOE_API_URL = process.env.BOE_API_URL || "http://api.wahandri.com";

export async function GET() {
  try {
    const res = await fetch(`${BOE_API_URL}/api/contracts/stats/by-category`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "by-category unavailable" }, { status: 503 });
  }
}