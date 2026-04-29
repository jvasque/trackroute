# CHANGELOG FASE 2 - Edición e inhabilitación de rutas

## Objetivo

Completar RF-01 en backend agregando detalle, edición e inhabilitación lógica de rutas sobre la base de Fase 1.

## Cambios incluidos

### Endpoints nuevos

- `GET /routes/:id`
  - Devuelve una ruta por id.
  - Solo considera rutas no eliminadas (`deletedAt = null`).
  - Responde `404` si no existe o fue inhabilitada.

- `PATCH /routes/:id`
  - Edita parcialmente una ruta existente no eliminada.
  - Valida body parcial con Zod.
  - Rechaza body vacío.
  - Responde `404` si la ruta no existe o fue inhabilitada.

- `DELETE /routes/:id`
  - Implementa soft delete.
  - No elimina físicamente registros.
  - Llena `deletedAt`.
  - Cambia `status` a `INACTIVA`.
  - La ruta deja de aparecer en `GET /routes`.

### Feature flags agregadas

- `FEATURE_ROUTES_UPDATE_ENABLED`
  - Apaga `PATCH /routes/:id` con `403`.

- `FEATURE_ROUTES_SOFT_DELETE_ENABLED`
  - Apaga `DELETE /routes/:id` con `403`.

### Feature flags mantenidas

- `FEATURE_ROUTES_READ`
- `FEATURE_ROUTES_CREATE`
- `FEATURE_ROUTES_SEED`

### Archivos agregados

```txt
src/modules/routes/application/get-route-by-id.use-case.ts
src/modules/routes/application/get-route-by-id.use-case.spec.ts
src/modules/routes/application/update-route.use-case.ts
src/modules/routes/application/update-route.use-case.spec.ts
src/modules/routes/application/soft-delete-route.use-case.ts
src/modules/routes/application/soft-delete-route.use-case.spec.ts
src/modules/routes/schemas/route-id-param.schema.ts
src/modules/routes/schemas/update-route.schema.ts
```

### Archivos actualizados

```txt
.env.example
README.md
CHANGELOG_FASE.md
src/config/env.schema.ts
src/config/env.service.ts
src/config/feature-flags.service.ts
src/modules/routes/domain/route.entity.ts
src/modules/routes/domain/route.repository.ts
src/modules/routes/dto/route-response.dto.ts
src/modules/routes/infrastructure/prisma-route.repository.ts
src/modules/routes/routes.controller.ts
src/modules/routes/routes.module.ts
test/routes.e2e-spec.ts
src/modules/routes/application/create-route.use-case.spec.ts
src/modules/routes/application/list-routes.use-case.spec.ts
```

## Testing agregado o actualizado

### Unitarios

- `GetRouteByIdUseCase`
  - Devuelve ruta existente.
  - Respeta `FEATURE_ROUTES_READ`.
  - Responde `NotFoundException` si no existe.

- `UpdateRouteUseCase`
  - Edita una ruta existente.
  - Respeta `FEATURE_ROUTES_UPDATE_ENABLED`.
  - Responde `NotFoundException` si no existe o fue eliminada.

- `SoftDeleteRouteUseCase`
  - Inhabilita ruta.
  - Cambia `status` a `INACTIVA`.
  - Llena `deletedAt`.
  - Respeta `FEATURE_ROUTES_SOFT_DELETE_ENABLED`.

### E2E backend

- `GET /routes/:id`
- validación de id inválido
- `PATCH /routes/:id`
- validación de body vacío
- validación de body inválido
- `DELETE /routes/:id`
- validación de id inválido

## Validación arquitectónica

- `RoutesController` sigue sin lógica de negocio.
- Los use cases coordinan reglas de aplicación.
- `RouteRepository` concentra el contrato de persistencia.
- `PrismaRouteRepository` sigue siendo el único adapter que conoce Prisma.
- `deletedAt` se usa como soft delete real y el listado principal lo excluye.
- La futura autorización `ADMIN` para escritura puede integrarse en guards o use cases sin romper contratos.

## SOLID aplicado

- S: cada use case tiene una intención única: leer detalle, editar o inhabilitar.
- O: la persistencia puede cambiar manteniendo `RouteRepository`.
- L: `PrismaRouteRepository` cumple todos los métodos del contrato.
- I: el contrato expone solo operaciones necesarias para RF-01.
- D: los use cases dependen de abstracciones, no de Prisma.

## No incluido en esta fase

- Autenticación JWT.
- Roles ADMIN/OPERADOR.
- Guards de autorización.
- Importación masiva por endpoint.
- Integración SOAP.
- Dashboard.
- Docker.
- CI/CD.
- Frontend Angular: el ZIP recibido contiene backend solamente; no se agregó un workspace Angular nuevo para no alterar la raíz actual ni introducir una segunda aplicación sin base existente.

## Nota de compatibilidad

El schema Prisma no cambia respecto a Fase 1 porque `deletedAt` y `status` ya estaban modelados. No se requiere migración nueva por modelo; el comando `pnpm prisma:migrate --name init` sigue siendo válido para ambientes limpios.
