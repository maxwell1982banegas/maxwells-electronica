"use client";
import { useEffect, useMemo, useState } from "react";

type Variant = {
  id: string;
  name: string;
  productName: string;
  price: { amount: number; currency: string } | null;
};

const SUPPORTED_CURRENCIES = (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(",") ?? ["HNL","USD"]).includes("HNL")
  ? ["HNL","USD"]
  : ["USD","HNL"]; // fallback

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function CheckoutPage() {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("customer@example.com");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<string>(SUPPORTED_CURRENCIES[0]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/variants?first=24`)
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setVariants(json.variants || []);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  const selectedVariant = useMemo(() => variants.find(v => v.id === variantId) || null, [variants, variantId]);

  const createCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity, email }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setResult(data.checkout);
    } catch (e) {
      setError(e);
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Checkout (demo)</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm">Moneda:</label>
        <select className="border rounded px-2 py-1" value={currency} onChange={(e)=>setCurrency(e.target.value)}>
          {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs opacity-70">Nota: los precios provienen del canal de Saleor y pueden estar en otra moneda.</span>
      </div>

      <p className="text-sm opacity-80">
        Selecciona una variante o ingresa un Variant ID manualmente para crear un checkout.
      </p>
      <form onSubmit={createCheckout} className="space-y-3 max-w-xl">
        <div className="flex flex-col gap-1">
          <label className="text-sm">Seleccionar variante</label>
          <select
            className="border rounded px-3 py-2"
            value={variantId}
            onChange={(e)=>setVariantId(e.target.value)}
          >
            <option value="">-- Elige una variante --</option>
            {variants.map(v => (
              <option key={v.id} value={v.id}>
                {v.productName} - {v.name} {v.price ? `(${formatMoney(v.price.amount, v.price.currency)})` : ""}
              </option>
            ))}
          </select>
          {loading && <div className="text-xs opacity-70">Cargando variantes…</div>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm">O pegar Variant ID (Saleor Global ID)</label>
          <input className="border rounded px-3 py-2" value={variantId} onChange={e => setVariantId(e.target.value)} placeholder="gid://saleor/ProductVariant/XYZ" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm">Email</label>
          <input className="border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm">Cantidad</label>
          <input type="number" min={1} className="border rounded px-3 py-2" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={!variantId}>Crear checkout</button>
      </form>

      {selectedVariant && selectedVariant.price && (
        <div className="text-sm">
          Precio seleccionado: {formatMoney(selectedVariant.price.amount, selectedVariant.price.currency)}
          {selectedVariant.price.currency !== currency && (
            <span className="opacity-70"> (sin conversión a {currency})</span>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Resultado</h2>
          <div className="text-sm">Token: <code>{result.token}</code></div>
          <pre className="text-xs bg-black/5 p-2 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <pre className="text-xs bg-red-50 p-2 rounded overflow-auto">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
