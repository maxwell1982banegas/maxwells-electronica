"use client";

export default function MercadoPagoTest() {
  const createPref = async () => {
    try {
      const res = await fetch("/api/mercadopago/preference", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw data;
      alert(`Preferencia creada: ${data.id || data.init_point || "ver consola"}`);
      console.log("Preferencia MP:", data);
    } catch (e) {
      console.error(e);
      alert("Error creando preferencia. Revisa la consola y variables de entorno.");
    }
  };
  return (
    <button
      onClick={createPref}
      className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
    >
      Probar Mercado Pago (sandbox)
    </button>
  );
}