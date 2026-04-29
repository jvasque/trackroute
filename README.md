# TrackRoute

Implementacion fullstack de gestion de rutas para la kata, manteniendo la arquitectura modular existente:

- `backend/`: NestJS + Prisma + SQLite.
- `frontend/`: Angular standalone para listado, creacion, edicion e inhabilitacion logica de rutas.

## Fase actual

Fase 2 - Edicion e inhabilitacion de rutas.

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
pnpm prisma migrate dev --name init
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

Frontend disponible en `http://localhost:4200/routes`.

## Endpoints de rutas

```txt
GET    /routes
GET    /routes/:id
POST   /routes
PATCH  /routes/:id
DELETE /routes/:id
```

Notas:

- `DELETE /routes/:id` realiza soft delete.
- Las rutas con `deletedAt` no aparecen en el listado principal.
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
```

## Validacion

### Backend

```bash
cd backend
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
