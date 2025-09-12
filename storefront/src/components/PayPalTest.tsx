"use client";

export default function PayPalTest() {
  const createOrder = async () => {
    try {
      const res = await fetch("/api/paypal/order", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw data;
      const approve = (data.links || []).find((l: any) => l.rel === "approve");
      if (approve?.href) {
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
  return (
    <button
      onClick={createOrder}
      className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Probar PayPal (sandbox)
    </button>
  );
}