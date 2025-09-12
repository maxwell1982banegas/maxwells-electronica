import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const token = await getAccessToken();
    const body = await req.json().catch(() => ({}));
    const currency = process.env.PAYPAL_CURRENCY || "USD";
    const amount = body.amount || "10.00";

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: currency, value: amount },
          },
        ],
        application_context: {
          return_url: body.return_url || "http://localhost:3000/es",
          cancel_url: body.cancel_url || "http://localhost:3000/es",
        },
      }),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: json }, { status: res.status });
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}