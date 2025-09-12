"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("customer@example.com");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

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
      <p className="text-sm opacity-80">
        Ingresa un Variant ID de Saleor (de los datos demo) y cantidad para crear un checkout.
      </p>
      <form onSubmit={createCheckout} className="space-y-3 max-w-xl">
        <div className="flex flex-col gap-1">
          <label className="text-sm">Email</label>
          <input className="border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm">Variant ID (Saleor Global ID)</label>
          <input className="border rounded px-3 py-2" value={variantId} onChange={e => setVariantId(e.target.value)} placeholder="gid://saleor/ProductVariant/XYZ" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm">Cantidad</label>
          <input type="number" min={1} className="border rounded px-3 py-2" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Crear checkout</button>
      </form>

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