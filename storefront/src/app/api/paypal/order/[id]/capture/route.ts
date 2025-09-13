import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
import { gql } from "@/lib/saleorClient";

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const client = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!client || !secret) throw new Error("Faltan PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET");

  const auth = Buffer.from(`${client}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`OAuth error ${res.status}: ${JSON.stringify(json)}`);
  return json.access_token as string;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const { saleorOrderId } = await req.json().catch(() => ({}));

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${params.id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const capture = await res.json();
    if (!res.ok) return NextResponse.json({ error: capture }, { status: res.status });

    // Opcional: marcar como pagado en Saleor si hay token y saleorOrderId
    const saleorToken = process.env.SALEOR_API_TOKEN;
    let saleorResult: any = null;
    if (saleorToken && saleorOrderId) {
      try {
        saleorResult = await gql<{ orderMarkAsPaid: any }>({
          query: `mutation MarkPaid($id: ID!) { orderMarkAsPaid(id: $id) { order { id status } errors { field message } } }`,
          variables: { id: saleorOrderId },
          headers: { Authorization: `Bearer ${saleorToken}` },
        });
      } catch (e) {
        // No interrumpir respuesta principal
        saleorResult = { error: (e as Error).message };
      }
    }

    return NextResponse.json({ capture, saleor: saleorResult });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}