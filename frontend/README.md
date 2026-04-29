# Frontend - Rutas

Frontend Angular para las Fases 1B y 2 del flujo de rutas.

## Cobertura actual

- Ruta `/routes`.
- Tabla con filtros y paginacion.
- Creacion de rutas.
- Edicion de rutas reutilizando el mismo formulario.
- Inhabilitacion con confirmacion previa.
- Refresco del listado despues de crear, editar o inhabilitar.
- Toasts informativos de exito y error en operaciones de escritura.

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
```

## Tests

```bash
pnpm exec tsc -p tsconfig.spec.json --noEmit
pnpm test
pnpm exec ng build --configuration development
```
