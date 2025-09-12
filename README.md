# Maxwell's Electrónica monorepo

Estructura
- saleor-platform/  # Backend headless (Docker Compose)
- storefront/       # Next.js 15 (App Router) con Tailwind

Desarrollo
1. Backend (una sola vez):
   - docker compose -f saleor-platform/docker-compose.yml -f saleor-platform/docker-compose.override.yml up -d
   - docker compose -f saleor-platform/docker-compose.yml -f saleor-platform/docker-compose.override.yml run --rm api python3 manage.py migrate
   - docker compose -f saleor-platform/docker-compose.yml -f saleor-platform/docker-compose.override.yml run --rm api python3 manage.py populatedb --createsuperuser

2. Frontend:
   - cd storefront
   - cp .env.local.example .env.local  # usar si existe; aquí ya configuramos NEXT_PUBLIC_SALEOR_API_URL
   - npm run dev

URLs locales
- API: http://localhost:18000/graphql/
- Dashboard: http://localhost:19000/
- Mailpit: http://localhost:18025/
- Jaeger: http://localhost:16687/

i18n
- Rutas soportadas: /es y /en (por defecto / apunta al contenido compartido)

Notas
- En Dashboard > Configuration > Plugins, activa el "Dummy Payment" para probar el checkout.
- Para PayPal sandbox, configura variables en storefront/.env.local y usa el botón de prueba en la home del storefront.
- Cambia credenciales del admin en el Dashboard.
- Dominio sugerido: maxwells-electronica.com
