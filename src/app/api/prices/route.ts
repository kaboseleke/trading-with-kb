import { NextRequest, NextResponse } from "next/server";
import { getLivePriceAsync } from "@/lib/price-feed";
import { FOREX_PAIRS } from "@/lib/forex-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const pair = req.nextUrl.searchParams.get("pair");

  try {
    if (pair) {
      const price = await getLivePriceAsync(pair);
      return NextResponse.json({ pair, price, success: true });
    }

    const prices = await Promise.all(
      FOREX_PAIRS.map(async (p) => ({
        symbol: p.symbol,
        price: await getLivePriceAsync(p.symbol),
      }))
    );

    return NextResponse.json({ prices, success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: "Price fetch failed" }, { status: 500 });
  }
}
