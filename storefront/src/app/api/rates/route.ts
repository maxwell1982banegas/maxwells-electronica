import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

// Sencillo proxy de tipos de cambio con caché. Usa exchangerate.host (gratis, sin API key).
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const base = (searchParams.get("base") || "USD").toUpperCase();
    const symbols = (searchParams.get("symbols") || "HNL,USD").toUpperCase();

    const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbols)}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1h
    const json = await res.json();
    if (!res.ok || json.error) {
      return NextResponse.json({ error: json.error || "error fetching rates" }, { status: res.status || 500 });
    }
    // Normalizamos respuesta
    return NextResponse.json({ base: json.base, date: json.date, rates: json.rates });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}