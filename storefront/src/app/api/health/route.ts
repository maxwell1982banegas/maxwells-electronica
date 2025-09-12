import { NextResponse } from "next/server";
import { gql } from "@/lib/saleorClient";

export async function GET() {
  try {
    const data = await gql<{ shop: { name: string } }>({
      query: `query HealthShop { shop { name } }`,
    });
    return NextResponse.json({ ok: true, shop: data.shop });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || String(e) }, { status: 500 });
  }
}