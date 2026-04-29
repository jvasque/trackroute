# Frontend - Rutas

Frontend Angular para Fase 1B. Consume el backend NestJS existente y cubre:

- Ruta `/routes`.
- Tabla de rutas.
- Filtros por origen, destino, vehículo, estado y transportista.
- Paginación.
- Formulario de creación.
- Estados de loading, empty y error.
- Feature flags frontend.

## Requisitos

- Node 22 LTS.
- pnpm.
- Backend corriendo en `http://localhost:3000`.

## Instalación

```bash
cd frontend
pnpm install
```

## Correr frontend

```bash
pnpm start
```

Abrir:

```txt
http://localhost:4200/routes
```

## Tests

```bash
pnpm test
```

## Configuración

La configuración está en:

```txt
src/environments/environment.ts
```

Valores principales:

```ts
apiBaseUrl: 'http://localhost:3000'
featureFlags.routesListEnabled: true
featureFlags.routesCreateEnabled: true
```

Angular no carga `.env` nativamente en runtime. Para esta fase se usan environments versionados y explícitos.
