# Backend Fase 1 - Gestión de Rutas

Backend inicial para la Fase 1 del proyecto Fullstack Rutas.

## Stack

- Node 22 LTS
- pnpm
- NestJS + TypeScript
- Prisma + SQLite
- Zod
- Jest

## Arquitectura

Monolito modular con capas limpias:

```txt
controller -> use case -> repository port -> Prisma repository adapter -> SQLite
```

La persistencia usa una hexagonal ligera: los casos de uso dependen del contrato `RouteRepository`, no de Prisma directamente.

## Requisitos previos

```bash
node -v
pnpm -v
```

Se espera Node 22 LTS.

## Cómo correr local

Desde la raíz descomprimida:

```bash
cd backend
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm db:seed
pnpm start:dev
```

API local:

```txt
http://localhost:3000
```

## Endpoints Fase 1

### GET /routes

Lista rutas con paginación y filtros.

Query params soportados:

```txt
page
pageSize
originCity
destinationCity
vehicleType
status
carrier
```

Ejemplo:

```bash
curl "http://localhost:3000/routes?page=1&pageSize=20&status=ACTIVA"
```

### POST /routes

Crea una ruta.

```bash
curl -X POST "http://localhost:3000/routes" \
  -H "Content-Type: application/json" \
  -d '{
    "originCity": "Bogotá",
    "destinationCity": "Cali",
    "distanceKm": 462,
    "estimatedTimeHours": 9.5,
    "vehicleType": "CAMION",
    "carrier": "TransAndes",
    "costUsd": 390,
    "status": "ACTIVA"
  }'
```

## Tests

```bash
pnpm test
pnpm test:e2e
```

## Seed

El dataset está incluido en:

```txt
data/routes_dataset.csv
```

El seed se ejecuta con:

```bash
pnpm db:seed
```

Si `FEATURE_ROUTES_SEED=false`, el seed se omite.

## Feature flags

Configuradas en `.env`:

```env
FEATURE_ROUTES_READ=true
FEATURE_ROUTES_CREATE=true
FEATURE_ROUTES_SEED=true
```

Comportamiento:

- `FEATURE_ROUTES_READ=false`: `GET /routes` responde `403`.
- `FEATURE_ROUTES_CREATE=false`: `POST /routes` responde `403`.
- `FEATURE_ROUTES_SEED=false`: el script de seed no carga datos.

## Seguridad incluida en esta fase

- Validación de entrada con Zod.
- CORS explícito desde `CORS_ORIGIN`.
- Helmet activo.
- Manejo centralizado de errores.
- `x-correlation-id` por request.
- Sin secretos hardcodeados.
- `.env` ignorado por Git.

## Modelo de datos

Tabla `routes`:

- `id`
- `origin_city`
- `destination_city`
- `distance_km`
- `estimated_time_hours`
- `vehicle_type`
- `carrier`
- `cost_usd`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

Índices:

- `originCity`
- `destinationCity`
- `status`
- `vehicleType`
- `carrier`

## Límites de SQLite

SQLite es correcto para portabilidad local y prueba técnica. Para producción con mayor concurrencia, escrituras simultáneas o escalabilidad horizontal, migrar a PostgreSQL manteniendo Prisma y el contrato `RouteRepository`.

## Checklist antes de PR

```txt
[ ] pnpm install funciona desde cero.
[ ] .env.example permite levantar local sin secretos reales.
[ ] DATABASE_URL usa SQLite.
[ ] pnpm prisma:generate ejecuta sin errores.
[ ] pnpm prisma:migrate --name init crea migración reproducible.
[ ] pnpm db:seed importa el CSV.
[ ] GET /routes pagina por defecto con page=1 y pageSize=20.
[ ] GET /routes filtra por originCity, destinationCity, vehicleType, status y carrier.
[ ] POST /routes valida todos los campos obligatorios con Zod.
[ ] Controllers no contienen lógica de negocio.
[ ] Use cases dependen de RouteRepository, no de Prisma directamente.
[ ] Feature flags apagan lectura, creación y seed.
[ ] CORS no usa "*" en configuración base.
[ ] Helmet está activo.
[ ] Errores devuelven correlationId.
[ ] Soft delete está modelado con deletedAt.
[ ] Índices existen para campos filtrables.
[ ] pnpm test pasa.
[ ] pnpm test:e2e pasa.
[ ] No hay secretos ni base SQLite commiteada.
```
