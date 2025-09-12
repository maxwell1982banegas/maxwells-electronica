import { NextRequest, NextResponse } from "next/server";
import { gql } from "@/lib/saleorClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { variantId, quantity = 1, email = "customer@example.com", channel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel" } = body;

    if (!variantId) {
      return NextResponse.json({ error: "variantId es requerido" }, { status: 400 });
    }

    const mutation = `
      mutation CreateCheckout($email: String!, $lines: [CheckoutLineInput!]!, $channel: String!) {
        checkoutCreate(input: { email: $email, lines: $lines, channel: $channel }) {
          checkout {
            id
            token
            email
            lines { id quantity variant { id name product { name } } }
          }
          errors { field message }
        }
      }
    `;

    const data = await gql<{ checkoutCreate: { checkout: any; errors: { field: string; message: string }[] } }>({
      query: mutation,
      variables: {
        email,
        channel,
        lines: [
          { quantity: Number(quantity), variantId },
        ],
      },
    });

    const errors = data.checkoutCreate.errors || [];
    if (errors.length) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    return NextResponse.json({ checkout: data.checkoutCreate.checkout });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}