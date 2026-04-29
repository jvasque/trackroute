# TrackRoute

Implementacion fullstack de gestion de rutas para la kata, manteniendo la arquitectura modular existente:

- `backend/`: NestJS + Prisma + SQLite.
- `frontend/`: Angular standalone para listado, creacion, edicion, inhabilitacion logica y monitoreo de rutas activas.

## Fase actual

Fase 3 parcial - RF-02 monitoreo en tiempo real con SOAP mock, cache TTL y snapshots persistidos.

## Requisitos

- Node 22 LTS.
- pnpm.

## Puesta en marcha

### Backend

```bash
cd backend
pnpm install
cp .env.example .env
pnpm prisma generate
pnpm prisma migrate dev
pnpm db:seed
pnpm start:dev
```

Backend disponible en `http://localhost:3000`.

### Frontend

```bash
cd frontend
pnpm install
pnpm start
```

Frontend disponible en:

- `http://localhost:4200/routes`
- `http://localhost:4200/monitoring`

## Endpoints de rutas

```txt
GET    /routes
GET    /routes/active/tracking
GET    /routes/:id
POST   /routes
PATCH  /routes/:id
DELETE /routes/:id
```

Notas:

- `DELETE /routes/:id` realiza soft delete.
- Las rutas con `deletedAt` no aparecen en el listado principal.
- `GET /routes/active/tracking` solo devuelve rutas activas y usa snapshots persistidos para amortiguar consultas de rastreo.
- No hay auth todavia; la escritura queda preparada para requerir `ADMIN` mas adelante.

## Variables de entorno backend

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

## Monitoreo RF-02

- El backend expone `GET /routes/active/tracking`.
- El panel `/monitoring` hace polling cada 30 segundos sin recargar la pagina.
- El adapter de rastreo se selecciona por entorno:
  - `TRACKING_PROVIDER=stub`
  - `TRACKING_PROVIDER=soap`
- `FEATURE_SOAP_STUB_ENABLED=true` fuerza el stub aunque el provider quede en `soap`.
- `FEATURE_SOAP_CACHE_ENABLED=true` envuelve el adapter con cache TTL de 60 segundos.
- Los snapshots se persisten en `RouteTrackingSnapshot` para dejar trazabilidad local del ultimo dato consultado.

## Validacion

### Backend

```bash
cd backend
pnpm prisma generate
pnpm test
pnpm test:e2e
```

### Frontend

```bash
cd frontend
pnpm exec tsc -p tsconfig.spec.json --noEmit
pnpm test
pnpm exec ng build --configuration development
```

## Docker y Hostinger

Se agrego una configuracion Docker pensada para un VPS o entorno Docker de Hostinger:

- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `frontend/nginx/default.conf`
- `docker-compose.yml`
- `.dockerignore`

Arquitectura:

- `frontend` se sirve con Nginx en puerto `80`
- Nginx hace proxy de `/api/*` hacia `backend:3000`
- Angular en produccion usa `apiBaseUrl: '/api'`
- backend usa Prisma + SQLite con volumen persistente

### Levantar local con Docker

```bash
docker compose up --build
```

Abrir:

- `http://localhost/routes`
- `http://localhost/monitoring`

### Despliegue en Hostinger

1. Copia el proyecto al VPS.
2. Instala Docker y Docker Compose plugin.
3. Desde la raiz del repo ejecuta:

```bash
docker compose up -d --build
```

4. Si usas dominio, coloca Nginx Proxy Manager o el proxy del propio Hostinger apuntando al contenedor frontend.

### Notas de despliegue

- El backend ejecuta `pnpm prisma migrate deploy` al arrancar.
- La base SQLite queda persistida en el volumen `trackroute_prisma_data`.
- Si luego migras a proveedor SOAP real, cambia las variables:
  - `TRACKING_PROVIDER=soap`
  - `FEATURE_SOAP_STUB_ENABLED=false`
