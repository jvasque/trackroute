# Backend - Rutas

Backend NestJS + Prisma + SQLite para la kata de TrackRoute, incluyendo RF-02 de monitoreo con snapshots persistidos y provider de rastreo intercambiable.

## Requisitos

- Node 22 LTS.
- pnpm.

## Instalacion y arranque

```bash
pnpm install
cp .env.example .env
pnpm prisma generate
pnpm prisma migrate dev
pnpm db:seed
pnpm start:dev
```

Servidor por defecto: `http://localhost:3000`.

## Variables de entorno

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:4200"
FEATURE_ROUTES_READ=true
FEATURE_ROUTES_CREATE=true
FEATURE_ROUTES_SEED=true
FEATURE_ROUTES_UPDATE_ENABLED=true
FEATURE_ROUTES_SOFT_DELETE_ENABLED=true
FEATURE_TRACKING_ENABLED=true
FEATURE_SOAP_CACHE_ENABLED=true
FEATURE_SOAP_STUB_ENABLED=true
TRACKING_PROVIDER=stub
SOAP_TRACKING_URL=http://localhost:4001/mock-soap/tracking
SOAP_TRACKING_TIMEOUT_MS=5000
```

## Endpoints

```txt
GET    /routes
GET    /routes/active/tracking
GET    /routes/:id
POST   /routes
PATCH  /routes/:id
DELETE /routes/:id
```

Notas:

- `DELETE /routes/:id` aplica soft delete y deja la ruta en estado `INACTIVA`.
- El listado principal excluye rutas con `deletedAt`.
- `GET /routes/active/tracking` devuelve solo rutas activas, reutiliza snapshots recientes y persiste nuevos snapshots cuando consulta el adapter de rastreo.
- La autorizacion no se implementa en esta fase; la escritura queda centralizada en use cases para exigir `ADMIN` despues sin romper contratos.

## Monitoreo RF-02

- `RouteTrackingSnapshot` persiste la ultima lectura normalizada por ruta.
- `TrackingAdapter` desacopla los use cases del proveedor real de rastreo.
- `StubTrackingAdapter` cubre local y test.
- `SoapTrackingAdapter` queda listo para el contrato SOAP `<TrackRouteRequest>`.
- `CachedTrackingAdapter` evita llamadas repetidas dentro del TTL de 60 segundos cuando la flag esta activa.

## Validacion

```bash
pnpm prisma generate
pnpm test
pnpm test:e2e
```
