# CHANGELOG FASE 1 - Backend inicial

## Incluido

- Boilerplate NestJS + TypeScript.
- Configuración pnpm.
- Configuración Prisma + SQLite.
- Modelo `Route` con índices para filtros frecuentes.
- Campo `deletedAt` para soft delete futuro.
- Seed reproducible desde `data/routes_dataset.csv`.
- Módulo `routes` con arquitectura por capas:
  - Controller
  - Use cases
  - Repository port
  - Prisma repository adapter
  - Zod schemas
  - DTOs de respuesta
- Endpoint `GET /routes`:
  - paginación
  - filtros por origen, destino, vehículo, estado y transportista
- Endpoint `POST /routes`:
  - validación Zod
  - creación de ruta
- Feature flags:
  - `FEATURE_ROUTES_READ`
  - `FEATURE_ROUTES_CREATE`
  - `FEATURE_ROUTES_SEED`
- Seguridad base:
  - Helmet
  - CORS explícito
  - validación de entrada
  - manejo centralizado de errores
  - correlation-id por request
- Tests unitarios:
  - `ListRoutesUseCase`
  - `CreateRouteUseCase`
- Tests e2e:
  - `GET /routes`
  - validación de query
  - `POST /routes`
  - validación de body
- README con comandos exactos para levantar local.

## No incluido en esta fase

- Frontend Angular.
- Autenticación JWT.
- Roles.
- Edición de rutas.
- Inhabilitación de rutas.
- Importación masiva por endpoint.
- Integración SOAP.
- Dashboard.
- Docker.
- CI/CD.

## Validación arquitectónica

- `RoutesController` no contiene lógica de negocio.
- `ListRoutesUseCase` y `CreateRouteUseCase` dependen de `RouteRepository`.
- `PrismaRouteRepository` es el único adapter que conoce Prisma para rutas.
- Feature flags se evalúan en casos de uso.
- Zod centraliza validación de entrada.
