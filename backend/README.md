# Backend - Rutas

Backend NestJS + TypeScript con Prisma + SQLite.

## Requisitos

- Node 22 LTS.
- pnpm.

## Instalación y ejecución

```bash
cd backend
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm db:seed
pnpm start:dev
```

## Variables

Ver `.env.example`.

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

## Endpoints disponibles

```txt
GET    /routes
POST   /routes
GET    /routes/:id
PATCH  /routes/:id
DELETE /routes/:id
```

El frontend inicial de Fase 1B solo consume:

```txt
GET  /routes
POST /routes
```

## Tests

```bash
pnpm test
pnpm test:e2e
```

## Notas

- `DELETE /routes/:id` es soft delete si está disponible en el backend recibido.
- No se implementa auth todavía.
- CORS está configurado para `http://localhost:4200` por defecto.
