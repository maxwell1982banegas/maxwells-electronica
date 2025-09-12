Pagos - Mercado Pago (sandbox)

Para activar Mercado Pago en entorno de pruebas:
1) Crea/usa cuenta Mercado Pago Developer y obtén credenciales sandbox.
   - Public Key (frontend)
   - Access Token (backend)
2) Backend Saleor:
   - Saleor no trae integrador nativo oficial de Mercado Pago; opciones:
     a) Usar el gateway Dummy para pruebas de flujo de checkout.
     b) Integrar Mercado Pago vía App personalizada (webhook + Payments API) o un plugin de terceros.
3) Recomendación inicial: activar Dummy Gateway para validar checkout end-to-end y luego implementar App Mercado Pago.

Variables sugeridas
- FRONTEND (storefront/.env.local):
  NEXT_PUBLIC_MP_PUBLIC_KEY={{MP_PUBLIC_KEY}}

- BACKEND (saleor env): Se requiere app/servicio integrador externo. Para pruebas con Dummy no hace falta.

Siguientes pasos si confirmas credenciales:
- Implemento una App simple (Node) que reciba createPreference, redireccione, e integre notificaciones IPN/webhooks, y capture/aplique pagos en Saleor via GraphQL.