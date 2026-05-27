import { NextRequest, NextResponse } from "next/server";
import { generateSignalFromAI } from "@/lib/signal-generator";
import { getLivePriceAsync } from "@/lib/price-feed";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pair } = body;
    if (!pair) return NextResponse.json({ error: "Pair is required" }, { status: 400 });

    // Fetch LIVE price from free API
    const price = await getLivePriceAsync(pair);
    const signal = await generateSignalFromAI(pair, price);

    return NextResponse.json({ signal, success: true });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Signal analysis failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const pair = req.nextUrl.searchParams.get("pair");
  if (!pair) return NextResponse.json({ error: "Pair required" }, { status: 400 });
  const price = await getLivePriceAsync(pair);
  return NextResponse.json({ price, pair, success: true });
}
