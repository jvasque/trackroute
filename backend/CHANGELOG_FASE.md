# CHANGELOG FASE 3

## Objetivo de la fase

Completar RF-02 implementando monitoreo de rutas activas con adapters intercambiables, snapshots persistidos, cache TTL y panel frontend con polling cada 30 segundos, sin romper la gestion actual de rutas.

## Archivos agregados

- `.dockerignore`
- `backend/prisma/migrations/20260429170000_route_tracking_snapshot/migration.sql`
- `backend/.dockerignore`
- `backend/Dockerfile`
- `backend/src/modules/routes/application/get-active-routes-tracking.use-case.ts`
- `backend/src/modules/routes/application/get-active-routes-tracking.use-case.spec.ts`
- `backend/src/modules/routes/domain/tracking-adapter.ts`
- `backend/src/modules/routes/dto/route-tracking-response.dto.ts`
- `backend/src/modules/routes/infrastructure/stub-tracking.adapter.ts`
- `backend/src/modules/routes/infrastructure/stub-tracking.adapter.spec.ts`
- `backend/src/modules/routes/infrastructure/cached-tracking.adapter.ts`
- `backend/src/modules/routes/infrastructure/cached-tracking.adapter.spec.ts`
- `backend/src/modules/routes/infrastructure/soap-tracking.adapter.ts`
- `frontend/src/app/features/routes/pages/monitoring-page/monitoring-page.component.ts`
- `frontend/src/app/features/routes/pages/monitoring-page/monitoring-page.component.html`
- `frontend/src/app/features/routes/pages/monitoring-page/monitoring-page.component.css`
- `frontend/src/app/features/routes/pages/monitoring-page/monitoring-page.component.spec.ts`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `frontend/nginx/default.conf`
- `frontend/src/environments/environment.production.ts`
- `docker-compose.yml`

## Archivos modificados

- `README.md`
- `backend/README.md`
- `frontend/README.md`
- `backend/.env.example`
- `backend/CHANGELOG_FASE.md`
- `backend/prisma/schema.prisma`
- `backend/src/config/env.schema.ts`
- `backend/src/config/env.service.ts`
- `backend/src/config/feature-flags.service.ts`
- `backend/src/modules/routes/domain/route.entity.ts`
- `backend/src/modules/routes/domain/route.repository.ts`
- `backend/src/modules/routes/infrastructure/prisma-route.repository.ts`
- `backend/src/modules/routes/routes.controller.ts`
- `backend/src/modules/routes/routes.module.ts`
- `backend/test/routes.e2e-spec.ts`
- `frontend/src/app/app.routes.ts`
- `frontend/src/app/core/config/feature-flags.service.ts`
- `frontend/src/app/features/routes/data-access/routes-api.service.ts`
- `frontend/src/app/features/routes/models/route.model.ts`
- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.development.ts`
- `frontend/angular.json`

## Endpoints agregados/modificados

- `GET /routes/active/tracking`
  Devuelve solo rutas activas con la ultima lectura normalizada de rastreo.
- `GET /routes`
  Se mantiene excluyendo soft deleted y sin cambios de contrato por RF-02.
- `PATCH /routes/:id`
  Sin cambios funcionales en esta fase; se valida que el monitoreo no rompa la edicion existente.
- `DELETE /routes/:id`
  Sin cambios funcionales en esta fase; se valida que el monitoreo no rompa la inhabilitacion existente.

## Variables de entorno nuevas

- `FEATURE_TRACKING_ENABLED=true`
- `FEATURE_SOAP_CACHE_ENABLED=true`
- `FEATURE_SOAP_STUB_ENABLED=true`
- `TRACKING_PROVIDER=stub`
- `SOAP_TRACKING_URL=http://localhost:4001/mock-soap/tracking`
- `SOAP_TRACKING_TIMEOUT_MS=5000`

## Feature flags

- `FEATURE_TRACKING_ENABLED`
- `FEATURE_SOAP_CACHE_ENABLED`
- `FEATURE_SOAP_STUB_ENABLED`
- `FEATURE_TRACKING_BACKGROUND_JOB_ENABLED` reservado para un job opcional futuro; no se activa en esta entrega.

## Tests agregados

- Unitario de `StubTrackingAdapter`
- Unitario de `CachedTrackingAdapter`
- Unitarios de `GetActiveRoutesTrackingUseCase`
- E2E backend de `GET /routes/active/tracking`
- E2E backend de `GET /routes/active/tracking` con feature flag off
- Frontend de `/monitoring` para loading
- Frontend de `/monitoring` para empty
- Frontend de `/monitoring` para error
- Frontend de `/monitoring` para polling cada 30 segundos

## Decisiones tecnicas

- El contrato del use case depende de `TrackingAdapter`, no del provider SOAP concreto.
- La seleccion de provider queda controlada por `TRACKING_PROVIDER` y `FEATURE_SOAP_STUB_ENABLED`.
- El cache TTL de 60 segundos se resuelve en dos niveles: snapshots persistidos en repositorio y wrapper `CachedTrackingAdapter` para llamadas repetidas del provider dentro del mismo proceso.
- El frontend usa polling con `timer(0, 30000)` para cumplir RF-02 sin introducir WebSockets en esta fase.
- La ruta `/monitoring` queda protegida por feature flag para no exponer una pantalla inconsistente cuando el feature este apagado.
- Para despliegue en Hostinger, Angular en produccion consume `/api` y Nginx hace reverse proxy hacia el backend para evitar hardcodear `localhost` y simplificar CORS.

## Riesgos o limites conocidos

- `SoapTrackingAdapter` queda preparado para el contrato SOAP, pero el mock actual sigue siendo stub controlado por flags.
- El parseo SOAP actual usa extraccion simple por tags; si el proveedor real introduce namespaces o envelopes mas complejos, hara falta endurecer el parser.
- El TTL persistido usa `createdAt` del snapshot; si mas adelante se quiere invalidacion por tiempo de fuente, podria migrarse a `sourceTimestamp`.
- No se implementa job en background en esta entrega.

## Comandos de validacion

- `cd backend && pnpm prisma generate`
- `cd backend && pnpm test`
- `cd backend && pnpm test:e2e`
- `cd frontend && pnpm exec tsc -p tsconfig.spec.json --noEmit`
- `cd frontend && pnpm test`
- `cd frontend && pnpm exec ng build --configuration development`

## Commits sugeridos

- `feat(tracking): agregar snapshots y adapters para monitoreo de rutas activas`
- `feat(frontend): incorporar pantalla monitoring con polling y estados`
- `docs(rf-02): actualizar readmes, env y changelog de monitoreo`

## Checklist previo al PR

- [ ] `backend/.env.example` incluye flags y provider de tracking
- [ ] `pnpm prisma generate` ejecutado en backend
- [ ] migracion `route_tracking_snapshot` presente y aplicable
- [ ] `pnpm test` y `pnpm test:e2e` pasan en backend
- [ ] `pnpm exec tsc -p tsconfig.spec.json --noEmit` pasa en frontend
- [ ] `pnpm test` pasa en frontend
- [ ] `pnpm exec ng build --configuration development` pasa en frontend
- [ ] `/monitoring` refresca cada 30 segundos sin recargar
- [ ] `/monitoring` oculta la pantalla si `FEATURE_TRACKING_ENABLED=false`
- [ ] flujo de `/routes` sigue estable para listar, filtrar, editar e inhabilitar
