# Backend - Rutas

Backend NestJS + Prisma + SQLite para la kata de TrackRoute.

## Requisitos

- Node 22 LTS.
- pnpm.

## Instalacion y arranque

```bash
pnpm install
cp .env.example .env
pnpm prisma generate
pnpm prisma migrate dev --name init
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
```

## Endpoints

```txt
GET    /routes
GET    /routes/:id
POST   /routes
PATCH  /routes/:id
DELETE /routes/:id
```

Notas:

- `DELETE /routes/:id` aplica soft delete y deja la ruta en estado `INACTIVA`.
- El listado principal excluye rutas con `deletedAt`.
- La autorizacion no se implementa en esta fase; la escritura queda centralizada en use cases para exigir `ADMIN` despues sin romper contratos.

## Validacion

```bash
pnpm test
pnpm test:e2e
```
