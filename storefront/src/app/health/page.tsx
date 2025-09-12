import { gql } from "@/lib/saleorClient";

export default async function HealthPage() {
  let status: { ok: boolean; shop?: { name: string }; error?: string } = { ok: false };
  try {
    const data = await gql<{ shop: { name: string } }>({ query: `query { shop { name } }` });
    status = { ok: true, shop: data.shop };
  } catch (e: any) {
    status = { ok: false, error: e.message || String(e) };
  }
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Healthcheck API</h1>
      <div>
        Estado: {status.ok ? (
          <span className="text-green-600">OK</span>
        ) : (
          <span className="text-red-600">FALLA</span>
        )}
      </div>
      {status.shop?.name && (
        <div>Shop: <span className="font-mono">{status.shop.name}</span></div>
      )}
      {status.error && (
        <pre className="text-sm bg-black/5 p-2 rounded">{status.error}</pre>
      )}
    </div>
  );
}