# Frontend - Rutas

Frontend Angular para las fases implementadas del flujo de rutas, incluyendo monitoreo de rutas activas.

## Cobertura actual

- Ruta `/routes`.
- Ruta `/monitoring`.
- Tabla con filtros y paginacion.
- Creacion de rutas.
- Edicion de rutas reutilizando el mismo formulario.
- Inhabilitacion con confirmacion previa.
- Refresco del listado despues de crear, editar o inhabilitar.
- Toasts informativos de exito y error en operaciones de escritura.
- Polling cada 30 segundos para monitoreo de rutas activas.
- Estados de loading, empty y error para el panel de monitoreo.

## Requisitos

- Node 22 LTS.
- pnpm.
- Backend corriendo en `http://localhost:3000`.

## Instalacion y arranque

```bash
pnpm install
pnpm start
```

Abrir:

```txt
http://localhost:4200/routes
http://localhost:4200/monitoring
```

## Configuracion

Archivo:

```txt
src/environments/environment.ts
```

Valores actuales:

```ts
apiBaseUrl: 'http://localhost:3000'
featureFlags.routesListEnabled: true
featureFlags.routesCreateEnabled: true
featureFlags.trackingEnabled: true
```

## Tests

```bash
pnpm exec tsc -p tsconfig.spec.json --noEmit
pnpm test
pnpm exec ng build --configuration development
```
