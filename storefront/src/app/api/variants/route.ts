import { NextRequest, NextResponse } from "next/server";
import { gql } from "@/lib/saleorClient";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const first = Number(searchParams.get("first") ?? 24);
    const channel = searchParams.get("channel") ?? process.env.NEXT_PUBLIC_DEFAULT_CHANNEL ?? "default-channel";

    const query = `
      query Variants($first: Int!, $channel: String!) {
        products(first: $first, channel: $channel) {
          edges {
            node {
              name
              variants {
                id
                name
                pricing {
                  price {
                    gross { amount currency }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await gql<{ products: { edges: { node: { name: string; variants: any[] } }[] } }>({
      query,
      variables: { first, channel },
      next: { revalidate: 60 },
    });

    const variants = (data.products?.edges ?? []).flatMap((edge) => {
      const productName = edge.node.name;
      return (edge.node.variants ?? []).map((v) => ({
        id: v.id,
        name: v.name,
        productName,
        price: v.pricing?.price?.gross ?? null,
      }));
    });

    return NextResponse.json({ variants });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}