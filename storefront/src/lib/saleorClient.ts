// Fallback a la demo pública si no hay variable definida (útil en Vercel sin configuración inicial)
export const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL ?? "https://demo.saleor.io/graphql/";

type GqlRequestOptions = {
  query: string;
  variables?: Record<string, any>;
  headers?: Record<string, string>;
  next?: RequestInit["next"];
};

export async function gql<T>({ query, variables, headers, next }: GqlRequestOptions): Promise<T> {
  const res = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    next,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL error ${res.status}: ${text}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data as T;
}