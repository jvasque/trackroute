# CHANGELOG FASE 2

## Objetivo de la fase

Completar RF-01 agregando edicion de rutas e inhabilitacion logica end-to-end, manteniendo el stack actual y la arquitectura modular existente.

## Archivos agregados

- `backend/src/modules/routes/application/get-route-by-id.use-case.ts`
- `backend/src/modules/routes/application/get-route-by-id.use-case.spec.ts`
- `backend/src/modules/routes/application/update-route.use-case.ts`
- `backend/src/modules/routes/application/update-route.use-case.spec.ts`
- `backend/src/modules/routes/application/soft-delete-route.use-case.ts`
- `backend/src/modules/routes/application/soft-delete-route.use-case.spec.ts`
- `backend/src/modules/routes/schemas/route-id-param.schema.ts`
- `backend/src/modules/routes/schemas/update-route.schema.ts`
- `frontend/src/app/app.component.ts`
- `frontend/src/app/app.config.ts`
- `frontend/src/app/app.routes.ts`
- `frontend/src/app/core/config/feature-flags.service.ts`
- `frontend/src/app/features/routes/components/route-form/route-form.component.ts`
- `frontend/src/app/features/routes/components/route-form/route-form.component.html`
- `frontend/src/app/features/routes/components/route-form/route-form.component.css`
- `frontend/src/app/features/routes/components/route-form/route-form.component.spec.ts`
- `frontend/src/app/features/routes/data-access/routes-api.service.ts`
- `frontend/src/app/features/routes/models/route.model.ts`
- `frontend/src/app/features/routes/pages/routes-page/routes-page.component.ts`
- `frontend/src/app/features/routes/pages/routes-page/routes-page.component.html`
- `frontend/src/app/features/routes/pages/routes-page/routes-page.component.css`
- `frontend/src/app/features/routes/pages/routes-page/routes-page.component.spec.ts`

## Archivos modificados

- `README.md`
- `backend/README.md`
- `frontend/README.md`
- `backend/.env.example`
- `backend/CHANGELOG_FASE.md`
- `backend/src/config/env.schema.ts`
- `backend/src/config/env.service.ts`
- `backend/src/config/feature-flags.service.ts`
- `backend/src/modules/routes/domain/route.entity.ts`
- `backend/src/modules/routes/domain/route.repository.ts`
- `backend/src/modules/routes/dto/route-response.dto.ts`
- `backend/src/modules/routes/infrastructure/prisma-route.repository.ts`
- `backend/src/modules/routes/routes.controller.ts`
- `backend/src/modules/routes/routes.module.ts`
- `backend/test/routes.e2e-spec.ts`

## Endpoints agregados/modificados

- `GET /routes`
  El listado sigue paginado y excluye rutas con soft delete.
- `GET /routes/:id`
  Devuelve una ruta activa por id.
- `POST /routes`
  Se mantiene para creacion.
- `PATCH /routes/:id`
  Permite edicion parcial de una ruta existente.
- `DELETE /routes/:id`
  Realiza inhabilitacion logica seteando `deletedAt` y `status=INACTIVA`.

## Variables de entorno nuevas

- `FEATURE_ROUTES_UPDATE_ENABLED=true`
- `FEATURE_ROUTES_SOFT_DELETE_ENABLED=true`

## Feature flags

- `FEATURE_ROUTES_READ`
- `FEATURE_ROUTES_CREATE`
- `FEATURE_ROUTES_SEED`
- `FEATURE_ROUTES_UPDATE_ENABLED`
- `FEATURE_ROUTES_SOFT_DELETE_ENABLED`

## Tests agregados

- Unitarios de `UpdateRouteUseCase`
- Unitarios de `SoftDeleteRouteUseCase`
- Unitarios de `GetRouteByIdUseCase`
- E2E backend para `GET /routes/:id`
- E2E backend para `PATCH /routes/:id`
- E2E backend para `DELETE /routes/:id`
- Frontend para render asincrono sin interaccion extra
- Frontend para creacion con toast y reset
- Frontend para edicion reutilizando el formulario
- Frontend para inhabilitacion con confirmacion previa

## Decisiones tecnicas

- Se reutiliza un solo formulario Angular para crear y editar, cambiando modo, labels y valores iniciales.
- La confirmacion de inhabilitacion usa `window.confirm` para no introducir otra capa modal en esta fase.
- Los mensajes de escritura se manejan con toasts no bloqueantes, separados del error banner del listado.
- La escritura sigue centralizada en use cases y servicios de pagina, dejando espacio para requerir `ADMIN` despues sin rehacer contratos ni componentes.
- El listado depende del backend para excluir soft deleted; el frontend solo refresca y vuelve a consultar.

## Riesgos o limites conocidos

- La confirmacion nativa del navegador es suficiente para la fase, pero luego puede reemplazarse por un dialogo consistente con el sistema visual.
- El backend requiere `pnpm prisma generate` si el cliente de Prisma no fue regenerado despues de cambios de schema o instalacion limpia.
- La autorizacion por rol `ADMIN` todavia no esta implementada.

## Comandos de validacion

- `cd backend && pnpm test`
- `cd backend && pnpm test:e2e`
- `cd frontend && pnpm exec tsc -p tsconfig.spec.json --noEmit`
- `cd frontend && pnpm test`
- `cd frontend && pnpm exec ng build --configuration development`

## Commits sugeridos

- `feat(routes): habilitar edicion e inhabilitacion logica en backend`
- `feat(frontend): agregar flujo de edicion e inhabilitacion de rutas`
- `docs(fase-2): actualizar readmes y changelog de la fase`

## Checklist previo al PR

- [ ] `backend/.env.example` incluye flags de update y soft delete
- [ ] `pnpm prisma generate` ejecutado en backend
- [ ] `pnpm test` y `pnpm test:e2e` pasan en backend
- [ ] `pnpm exec tsc -p tsconfig.spec.json --noEmit` pasa en frontend
- [ ] `pnpm test` pasa en frontend
- [ ] `pnpm exec ng build --configuration development` pasa en frontend
- [ ] listado no muestra rutas soft deleted
- [ ] editar refresca la tabla y mantiene render fluido
- [ ] inhabilitar pide confirmacion y remueve la ruta del listado tras refrescar
