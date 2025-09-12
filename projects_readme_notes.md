Pagos - PayPal (sandbox)

Para activar PayPal en entorno de pruebas:
1) Crea/usa cuenta Mercado Pago Developer y obtén credenciales sandbox.
- Client ID (frontend/backend)
- Client Secret (backend)
2) Backend Saleor:
   - Saleor no trae integrador nativo oficial de Mercado Pago; opciones:
     a) Usar el gateway Dummy para pruebas de flujo de checkout.
     b) Integrar Mercado Pago vía App personalizada (webhook + Payments API) o un plugin de terceros.
3) Recomendación inicial: activar Dummy Gateway para validar checkout end-to-end y luego implementar App Mercado Pago.

Variables sugeridas
- FRONTEND (storefront/.env.local):
  NEXT_PUBLIC_PAYPAL_CLIENT_ID={{PAYPAL_CLIENT_ID}}

- BACKEND (storefront/.env.local):
  PAYPAL_CLIENT_ID={{PAYPAL_CLIENT_ID}}
  PAYPAL_CLIENT_SECRET={{PAYPAL_CLIENT_SECRET}}
  PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
  PAYPAL_CURRENCY=USD

Siguientes pasos si confirmas credenciales:
- Implemento endpoints para crear/capturar órdenes y, si lo deseas, conecto el flujo de checkout de Saleor para registrar pagos reales (o usar Dummy mientras tanto).
