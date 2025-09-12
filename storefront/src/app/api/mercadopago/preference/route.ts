import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: "MP_ACCESS_TOKEN no configurado" }, { status: 500 });
  }

  const preference = {
    items: body.items ?? [
      { title: "Producto de prueba", quantity: 1, currency_id: "HNL", unit_price: 100 },
    ],
    back_urls: body.back_urls ?? {
      success: "http://localhost:3000/es",
      failure: "http://localhost:3000/es",
      pending: "http://localhost:3000/es",
    },
    auto_return: "approved",
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preference),
  });

  const json = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: json }, { status: res.status });
  }
  return NextResponse.json(json);
}