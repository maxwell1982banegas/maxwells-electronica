"use client";

import { useState } from "react";

export default function PayPalTest() {
  const [orderId, setOrderId] = useState<string>("");

  const createOrder = async () => {
    try {
      const res = await fetch("/api/paypal/order", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw data;
      const approve = (data.links || []).find((l: any) => l.rel === "approve");
      if (approve?.href) {
        setOrderId(data.id);
        window.open(approve.href, "_blank");
      } else {
        alert("Orden creada, pero no se encontró link de aprobación. Revisa consola.");
        console.log(data);
      }
    } catch (e) {
      console.error(e);
      alert("Error creando orden PayPal. Configura credenciales sandbox y revisa consola.");
    }
  };

  const captureOrder = async () => {
    if (!orderId) return alert("Primero crea la orden y apruébala.");
    try {
      const res = await fetch(`/api/paypal/order/${orderId}/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      alert("Orden capturada. Revisa consola para detalles.");
      console.log("Captura:", data);
    } catch (e) {
      console.error(e);
      alert("Error capturando la orden. Revisa consola.");
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <button
        onClick={createOrder}
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Crear orden PayPal (sandbox)
      </button>
      <div className="text-sm">Order ID: <code>{orderId || "—"}</code></div>
      <button
        onClick={captureOrder}
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        disabled={!orderId}
      >
        Capturar orden PayPal
      </button>
    </div>
  );
}
