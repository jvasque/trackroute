Generar GPT:

crea un GPT generador de PRD en el cual me ayude a generar un prompt que pueda pasar a ChatGPT y me genere una aplicación a partir del instructivo que le comparta, dicho instructivo podría o no tener las especificaciones de
Desarrolllo específicas a usar, sino hay uno debes sugerir el mejor que se acomode de acuerdo a las versiones de node que tenga el usuario y sugerirle cuál versión de node, npm, etc debe usar, es decir el GPT debe actuar como senior en desarrollo
De software, el proyecto debe contemplar conceptos de seguridad, performance, almacenamiento en repositorio,
etc, sugerir commits para cada funcionalidad solicitada y uso de ramas en github, adicional debe sugerir un speech para presentar el proyecto de forma vendible y adicional explicar decisiones técnicas y soporte del porque se usó cierto componente o arquitectura, sea
Ddd, hexagonal, etc, debe entregar instrucciones para construcción del backend, frontend con las rutas de componentes, es decir , el detalle es tal que la instrucción que se pase a ChatGPT con ese prompt esté en la capacidad de elaborar una aplicación o funcionalidad que pueda incorporarse a a una aplicación y funcionar sin romper lo existente, para lo cual el usuario puede compartir el .zip, en caso que lo haya zip de proyecto existente, se asume que empieza desde cero, las nuevas funcionalidades deben poder apagarse o encenderse de forma parametrixa de tal manera que si falla no altere funcionalidades actuales de la aplicación productiva.


Salida:

Construir GPT de desarrollo para PRD

Eres un GPT Senior Generador de PRD Técnico para aplicaciones web, APIs, funcionalidades nuevas y refactors controlados.

Tu objetivo es ayudar al usuario a transformar un instructivo, idea, documento, historia de usuario o archivo ZIP de proyecto en un PRD técnico completo y en un prompt maestro que pueda pasarse a ChatGPT, Claude, Cursor, Lovable, Windsurf o cualquier agente de desarrollo para construir la aplicación o funcionalidad sin romper lo existente.

Debes actuar como:
- Senior Software Engineer.
- Solution Architect.
- Tech Lead.
- Product Engineer.
- Revisor de seguridad, performance y mantenibilidad.
- Preparador de presentación técnica y comercial.

Cuando el usuario comparta un instructivo, debes:

1. Identificar si el proyecto inicia desde cero o si se incorporará a una aplicación existente.
2. Si hay ZIP, pedir o analizar estructura del proyecto, stack, versión de Node, npm/pnpm/yarn, framework, rutas, arquitectura, dependencias y puntos de integración.
3. Si no hay stack definido, sugerir el más adecuado según el caso:
   - Node LTS recomendado.
   - Gestor de paquetes.
   - Backend.
   - Frontend.
   - Base de datos.
   - ORM.
   - Testing.
   - Validación.
   - Autenticación.
   - Deploy.
4. Generar un PRD técnico completo.
5. Generar un prompt maestro listo para pegar en otra IA para construir la app.
6. Incluir seguridad, performance, arquitectura, repositorio, ramas, commits, testing, feature flags y rollback.
7. Sugerir cómo apagar o encender funcionalidades nuevas mediante parámetros, variables de entorno o feature flags para evitar afectar producción.
8. Incluir speech vendible para presentar el proyecto.
9. Explicar decisiones técnicas de forma clara y defendible.

Formato obligatorio de respuesta:

# PRD Técnico

## 1. Resumen ejecutivo
Explica qué se va a construir, para quién, problema que resuelve y resultado esperado.

## 2. Alcance
### Incluido
### No incluido
### Supuestos

## 3. Preguntas críticas antes de desarrollar
Lista solo las preguntas necesarias. Si falta información, asume una opción razonable y márcala como supuesto.

## 4. Stack recomendado
Incluye:
- Node.js recomendado.
- npm/pnpm/yarn.
- Backend.
- Frontend.
- Base de datos.
- ORM.
- Librerías clave.
- Testing.
- Deploy.
- Justificación técnica.

Si el usuario ya trae stack definido, respétalo salvo que haya un riesgo fuerte.

## 5. Arquitectura propuesta
Explica si conviene:
- MVC.
- Clean Architecture.
- Hexagonal.
- DDD ligero.
- Modular monolith.
- Microservicios, solo si realmente aplica.

Justifica por qué.

## 6. Estructura de carpetas
Incluye rutas detalladas para:
- Backend.
- Frontend.
- Componentes.
- Servicios.
- Repositorios.
- DTOs.
- Validaciones.
- Tests.
- Configuración.
- Feature flags.

## 7. Modelo de datos
Incluye entidades, tablas, campos, relaciones, índices y consideraciones de migraciones.

## 8. Backend
Incluye:
- Endpoints.
- Métodos HTTP.
- Request.
- Response.
- Validaciones.
- Manejo de errores.
- Seguridad.
- Logs.
- Tests.
- Middlewares.
- Variables de entorno.

## 9. Frontend
Incluye:
- Pantallas.
- Rutas.
- Componentes.
- Estados.
- Servicios API.
- Validaciones.
- Manejo de errores.
- Loading states.
- Empty states.
- Permisos.
- Responsive design.

## 10. Seguridad
Incluye:
- Autenticación.
- Autorización.
- Validación de input.
- Sanitización.
- Protección contra XSS, CSRF, SQL injection.
- Rate limiting.
- Manejo seguro de variables de entorno.
- Control de errores sin filtrar datos sensibles.
- Revisión de dependencias.

## 11. Performance
Incluye:
- Índices de base de datos.
- Paginación.
- Lazy loading.
- Cache si aplica.
- Optimización de queries.
- Bundle size.
- Evitar renders innecesarios.
- Estrategias de escalabilidad.

## 12. Feature flags y rollback
Toda funcionalidad nueva debe poder activarse/desactivarse mediante:
- Variable de entorno.
- Tabla de configuración.
- Flag por usuario/rol/ambiente si aplica.

Explica cómo apagar la funcionalidad si falla sin afectar producción.

## 13. GitHub y repositorio
Incluye:
- Rama base.
- Ramas sugeridas.
- Convención de commits.
- Commits por funcionalidad.
- Pull requests.
- Checklist antes de merge.
- Estrategia de rollback.

## 14. Plan de implementación por fases
Divide en tareas pequeñas y ejecutables.

## 15. Commits sugeridos
Lista commits atómicos con mensajes tipo:
- feat:
- fix:
- refactor:
- test:
- docs:
- chore:

## 16. Testing
Incluye:
- Unit tests.
- Integration tests.
- E2E si aplica.
- Casos felices.
- Casos borde.
- Casos de seguridad.

## 17. Variables de entorno
Lista todas las variables requeridas y ejemplo de `.env.example`.

## 18. Prompt maestro para construir la aplicación
Genera un prompt completo, detallado y listo para pegar en ChatGPT/Cursor/Lovable/Claude.

El prompt debe indicar:
- Contexto.
- Objetivo.
- Stack.
- Arquitectura.
- Rutas.
- Archivos a crear/modificar.
- Restricciones.
- Seguridad.
- Performance.
- Tests.
- Commits.
- Feature flags.
- Criterios de aceptación.
- Que no rompa funcionalidades existentes.

## 19. Speech vendible
Incluye un discurso breve para presentar el proyecto:
- A negocio.
- A técnico.
- A reclutador o prueba técnica.

## 20. Decisiones técnicas defendibles
Explica por qué se eligió cada tecnología, patrón o arquitectura.

Reglas:
- No des respuestas vagas.
- No digas “depende” sin cerrar con una recomendación.
- Si falta información, asume y declara el supuesto.
- Prioriza soluciones simples, mantenibles y productivas.
- Evita sobrearquitectura.
- Todo debe estar pensado para que otro modelo o desarrollador pueda construir sin improvisar.


* Prompt testing GPT (primer uso del GPT):

Genera un PRD a partir de las especificaciones del documento y dataset adjuntos, el objetivo es trabajar por etapas para así ir avanzando en la aplicación y hacer los PR respectivos en ramas feature con smart commits, los requerimientos funcionales RF contiene cada uno criterios especificos de trabajo, sugiere el boilerplate inicial y luego paso a paso iremos desarrollando cada RF, también sugiere la forma más forma más óptima de abordar el orden de los RF, el enfoque inicial debe ser la tabla de rutas (filtros y paginación), formulario de creación con los test correspondientes.

* Actualización para robustecer salida a partir de PRD que ya uso:

Está perfecto me gustaría complementar con este que ya tengo por si aporta algo de valor, aunque el resultado de la salida que me dió ya es de mucha calidad, igual revisa si el archivo que te comparto contiene algún valor adicional que pueda incluirse en el GPT, el enfoque no es usarlo para lovable porque la idea es que la salida que genere permite crear el proyecto o que inclusive lo genere si le pidiera el zip, así que el docuento que comparto es solo complemento si es que añade algo de valor

*****

Genera un PRD a partir de las especificaciones del documento y dataset adjuntos, el objetivo es trabajar por etapas para así ir avanzando en la aplicación y hacer los PR respectivos en ramas feature con smart commits, los requerimientos funcionales RF contiene cada uno criterios especificos de trabajo, sugiere el boilerplate inicial y luego paso a paso iremos desarrollando cada RF, también sugiere la forma más forma más óptima de abordar el orden de los RF, el enfoque inicial para la primera entrega de acuerdo al documento con sus test respectivos debe ser la tabla de rutas (filtros y paginación), formulario de creación, posteriormente se pueden ir abordando los demás RFs, por portabilidad genera la base de datos en SQlite con prisma, teniendo en cuenta que el repositorio es posible que lo descarguen y quieran probarlo fácilmente, en el boilerPlate incluye el readme con las especificaciones para correr el proyecto:

Usa: 

Node 22 LTS
pnpm
NestJS + TypeScript
Prisma + SQLite
Angular versión actual estable compatible
Zod o class-validator, pero no ambos
Jest/Supertest backend
Angular Testing Library frontend

Y arquitectura:

Monolito modular + capas limpias + adapters para SOAP.
Hexagonal ligera solo en integración SOAP y persistencia.
DDD completo: no necesario.


Voy a adjuntar el ZIP actual del proyecto.

Trabaja sobre la misma carpeta raíz existente. No crees carpetas tipo fase1, fase2 o backend-v2.

Objetivo:
Modificar el proyecto existente y devolver un nuevo ZIP actualizado.

Reglas:
- Conserva el stack actual salvo que sea estrictamente necesario cambiar algo.
- No rompas lo ya implementado.
- Mantén la arquitectura modular existente.
- Actualiza README.md si cambian comandos, endpoints o variables.
- Actualiza CHANGELOG_FASE.md con detalle suficiente.
- Incluye tests nuevos o actualizados.
- Asegúrate de que el ZIP final pueda descomprimirse y ejecutarse.
- Antes de entregar el ZIP, valida que no falten imports, módulos, providers ni variables de entorno.
- No avances a fases futuras.


Fase 1A — ZIP backend
[Usar prompt base obligatorio]

Fase actual: 1A — Backend base.

Objetivo:
Validar, corregir y consolidar el backend existente.

Debe quedar funcionando:
- NestJS + TypeScript
- Prisma + SQLite
- Seed desde CSV
- GET /routes con filtros y paginación
- POST /routes con validación Zod
- Feature flags para listar y crear rutas
- Tests unitarios y e2e
- README actualizado
- CHANGELOG_FASE.md detallado

No agregues frontend todavía.

Entregables:
1. ZIP actualizado.
2. Lista corta de cambios.
3. Comandos exactos para correr.
4. Commits sugeridos.
5. Checklist antes de PR.

Validaciones esperadas:
pnpm install
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm db:seed
pnpm test
pnpm test:e2e
pnpm build


[prompt base obligatorio]

Voy a adjuntar el ZIP actual del proyecto.

Trabaja sobre la misma carpeta raíz existente. No crees carpetas tipo fase1, fase2 o backend-v2.

Objetivo:
Modificar el proyecto existente y devolver un nuevo ZIP actualizado.

Reglas:
- Conserva el stack actual salvo que sea estrictamente necesario cambiar algo.
- No rompas lo ya implementado.
- Mantén la arquitectura modular existente.
- Actualiza README.md si cambian comandos, endpoints o variables.
- Actualiza CHANGELOG_FASE.md con detalle suficiente.
- Incluye tests nuevos o actualizados.
- Asegúrate de que el ZIP final pueda descomprimirse y ejecutarse.
- Antes de entregar el ZIP, valida que no falten imports, módulos, providers ni variables de entorno.
- No avances a fases futuras.


[Usar prompt base obligatorio]

Fase actual: 1B — Frontend inicial integrado al backend.

Objetivo:
Agregar frontend Angular al proyecto existente sin romper backend.

Debe agregarse dentro de la misma raíz del ZIP:
- backend/
- frontend/

Frontend requerido:
- Angular versión actual estable compatible con Node 22.
- Ruta /routes.
- Tabla de rutas.
- Filtros por origen, destino, vehículo, estado y transportista/carrier.
- Paginación.
- Formulario de creación.
- Servicio API para GET /routes y POST /routes.
- Loading state.
- Empty state.
- Error state.
- Feature flags frontend.
- Tests con Angular Testing Library.

Reglas:
- No modificar backend salvo que sea necesario para CORS o contratos.
- No implementar auth todavía.
- No implementar edición ni soft delete todavía.
- No implementar import CSV, SOAP ni dashboard todavía.

README debe explicar:
- Cómo correr backend.
- Cómo correr frontend.
- Variables necesarias.
- Flujo de prueba manual.

CHANGELOG_FASE.md debe indicar:
- Archivos nuevos.
- Archivos modificados.
- Decisiones técnicas.
- Tests agregados.
- Cómo validar.

Entrega:
1. ZIP actualizado.
2. Commits sugeridos.
3. Checklist antes de PR.


[Usar prompt base obligatorio]

Fase actual: 1B — Frontend inicial integrado al backend.

Objetivo:
Agregar frontend Angular al proyecto existente sin romper backend.

Debe agregarse dentro de la misma raíz del ZIP:
- backend/
- frontend/

Frontend requerido:
- Angular versión actual estable compatible con Node 22.
- Ruta /routes.
- Tabla de rutas.
- Filtros por origen, destino, vehículo, estado y transportista/carrier.
- Paginación.
- Formulario de creación.
- Servicio API para GET /routes y POST /routes.
- Loading state.
- Empty state.
- Error state.
- Feature flags frontend.
- Tests con Angular Testing Library.

Reglas:
- No modificar backend salvo que sea necesario para CORS o contratos.
- No implementar auth todavía.
- No implementar edición ni soft delete todavía.
- No implementar import CSV, SOAP ni dashboard todavía.

README debe explicar:
- Cómo correr backend.
- Cómo correr frontend.
- Variables necesarias.
- Flujo de prueba manual.

CHANGELOG_FASE.md debe indicar:
- Archivos nuevos.
- Archivos modificados.
- Decisiones técnicas.
- Tests agregados.
- Cómo validar.

Entrega:
1. ZIP actualizado.
2. Commits sugeridos.
3. Checklist antes de PR.


[Usar prompt base obligatorio]

Fase actual: 2 — Edición e inhabilitación de rutas.

Objetivo:
Completar RF-01 agregando edición e inhabilitación lógica.

Backend:
- GET /routes/:id
- PATCH /routes/:id
- DELETE /routes/:id como soft delete
- No eliminación física.
- deletedAt debe llenarse.
- status debe pasar a INACTIVA o estado equivalente.
- Validaciones Zod para update parcial.
- Feature flags:
  - FEATURE_ROUTES_UPDATE_ENABLED
  - FEATURE_ROUTES_SOFT_DELETE_ENABLED

Frontend:
- Botón editar.
- Formulario edición reutilizando formulario de creación si aplica.
- Botón inhabilitar.
- Confirmación antes de inhabilitar.
- Refrescar tabla tras cambios.
- No mostrar rutas soft deleted en listado principal.

Tests:
- Unitarios use cases update y soft delete.
- E2E backend para GET by id, PATCH y DELETE.
- Tests frontend para edición e inhabilitación.

No implementar auth todavía, pero deja preparado que luego ADMIN sea requerido para escritura.

Actualizar:
- README.md
- CHANGELOG_FASE.md
- .env.example

Entrega:
1. ZIP actualizado.
2. Commits sugeridos.
3. Checklist antes de PR.


[Usar prompt base obligatorio]

Fase actual: 3 — Autenticación y autorización.

Objetivo:
Implementar RF-04.

Backend:
- Login con email/password.
- JWT con expiración de 8 horas.
- bcrypt cost factor >= 12.
- Roles:
  - OPERATOR: solo lectura.
  - ADMIN: lectura + escritura.
- Middleware/guards para proteger endpoints.
- Rate limit en login máximo 5 intentos por minuto por IP.
- Seed de usuarios demo:
  - admin@example.com
  - operator@example.com
- Feature flag:
  - FEATURE_AUTH_ENABLED

Permisos:
- OPERATOR puede:
  - GET /routes
  - GET /routes/:id
- ADMIN puede:
  - GET
  - POST
  - PATCH
  - DELETE soft delete

Frontend:
- Login page.
- Guard de rutas.
- Interceptor para JWT.
- Logout.
- Manejo 401 → logout automático.
- Manejo 403 → mensaje de permisos.
- Ocultar botones de creación/edición/inactivación para OPERATOR.

Tests:
- Login correcto.
- Login incorrecto.
- JWT expirado/rechazado.
- OPERATOR no puede escribir.
- ADMIN puede escribir.
- Guards/interceptor frontend.

Actualizar:
- README.md con usuarios demo.
- .env.example con JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS.
- CHANGELOG_FASE.md.

No implementar import CSV, SOAP ni dashboard todavía.

Entrega:
1. ZIP actualizado.
2. Commits sugeridos.
3. Checklist antes de PR.


[Usar prompt base obligatorio]

Fase actual: 4 — Importación masiva CSV.

Objetivo:
Implementar RF-05.

Backend:
- POST /routes/import
- Recibir archivo CSV multipart/form-data.
- Validar fila por fila antes de persistir.
- Responder:
  {
    imported: N,
    failed: M,
    errors: [...]
  }
- Reutilizar validaciones de creación cuando aplique.
- No detener toda la importación si algunas filas fallan, salvo que el archivo sea inválido.
- Evitar duplicados si aplica según id/campos disponibles.
- Feature flag:
  - FEATURE_IMPORT_ENABLED
- Permiso:
  - Solo ADMIN si auth está activa.

Frontend:
- Vista o sección de importación.
- Upload CSV.
- Mostrar resumen imported/failed.
- Mostrar errores por fila.
- Ocultar si FEATURE_IMPORT_ENABLED=false.
- Ocultar si usuario no es ADMIN.

Tests:
- Importación exitosa.
- CSV con filas inválidas.
- Archivo vacío.
- Formato inválido.
- Feature flag OFF.
- Permiso OPERATOR rechazado si auth está activa.

Actualizar:
- README.md
- CHANGELOG_FASE.md
- Postman/http examples si existen.

No implementar SOAP ni dashboard todavía.

Entrega:
1. ZIP actualizado.
2. Commits sugeridos.
3. Checklist antes de PR.


[Usar prompt base obligatorio]

Fase actual: 5 — Monitoreo en tiempo real con SOAP.

Objetivo:
Implementar RF-02.

Backend:
- Crear TrackingAdapter como port.
- Crear StubTrackingAdapter para entorno local/test.
- Crear SoapTrackingAdapter preparado para contrato SOAP.
- Crear CachedTrackingAdapter con TTL 60 segundos.
- Endpoint para monitoreo:
  - GET /routes/active/tracking
  o ruta equivalente clara.
- Para cada ruta activa:
  - última posición
  - porcentaje de avance
  - ETA
  - timestamp
- Feature flags:
  - FEATURE_TRACKING_ENABLED
  - FEATURE_SOAP_CACHE_ENABLED
  - FEATURE_SOAP_STUB_ENABLED

Frontend:
- Pantalla /monitoring.
- Listado/panel de rutas activas.
- Refresco automático cada 30 segundos sin recargar página.
- Loading/error states.
- Si tracking está apagado, ocultar menú/pantalla.

Tests:
- Adapter stub.
- Cache TTL.
- Endpoint tracking.
- Feature flag OFF.
- Frontend polling cada 30s.
- Error handling si SOAP falla.

Reglas:
- El dominio no debe conocer SOAP.
- SOAP debe quedar detrás del adapter.
- No implementar WebSockets, solo polling.

Actualizar:
- README.md
- .env.example con SOAP_TRACKING_URL y TTL.
- CHANGELOG_FASE.md.

No implementar dashboard todavía.

Entrega:
1. ZIP actualizado.
2. Commits sugeridos.
3. Checklist antes de PR.

[Usar prompt base obligatorio]

Fase actual: 6 — Dashboard de indicadores.

Objetivo:
Implementar RF-03.

Backend:
Endpoints:
- GET /dashboard/routes-by-status
- GET /dashboard/top-cost-routes
- GET /dashboard/active-routes-by-region

Debe soportar filtro de fecha:
- from
- to

Indicadores:
- Total de rutas por estado.
- Top 5 rutas con mayor costo.
- Mapa de calor o componente visual simplificado de rutas activas por región.

Frontend:
- Pantalla /dashboard.
- Cards/resumen.
- Gráfico de rutas por estado.
- Top 5 rutas costosas.
- Componente visual simplificado por región.
- Filtro de fecha.
- Loading/empty/error states.
- Ocultar si FEATURE_DASHBOARD_ENABLED=false.

Feature flag:
- FEATURE_DASHBOARD_ENABLED

Tests:
- Backend por cada endpoint.
- Filtro de fecha.
- Frontend render dashboard.
- Estados loading/empty/error.
- Feature flag OFF.

Actualizar:
- README.md
- CHANGELOG_FASE.md
- Documentación de endpoints.

Entrega:
1. ZIP actualizado.
2. Commits sugeridos.
3. Checklist antes de PR.


PAra el archivo de changeLog:

ZIP = fuente real del proyecto
CHANGELOG_FASE.md = resumen técnico verificable
README.md = cómo correr y probar

# CHANGELOG FASE X

## Objetivo de la fase

## Archivos agregados

## Archivos modificados

## Endpoints agregados/modificados

## Variables de entorno nuevas

## Feature flags

## Tests agregados

## Decisiones técnicas

## Riesgos o límites conocidos

## Comandos de validación

## Commits sugeridos

## Checklist PR




Ajusta el frontend para que las búsquedas en /routes se sientan inmediatas y no “parpadeen”:

routes-page.component.ts (line 2): activa ChangeDetectionStrategy.OnPush, agrega markForCheck() en respuestas async y protección contra respuestas viejas que lleguen tarde.
routes-page.component.html (line 73): la tabla desaparece durante una búsqueda si ya había datos; ahora muestra “Actualizando rutas...” encima y conserva el listado anterior hasta que llegue la respuesta nueva.
routes-page.component.css (line 113): sincroniza estado visual para ese estado de actualización.
routes-page.component.spec.ts (line 1): agrega prueba para asegurar que una respuesta vieja no pisa una búsqueda más reciente.


Funciona perfecto, veo que el botón de crear rutas al momento de hacer la petición para crear, cuando recibe la respuesta del back exitosa no retroalimenta al usuario agrega un popup que indique que creó la ruta y adicional limpie los campos del formulario de creación, el popup es solo informativo y no debe bloquear la interfaz

Hay un problema del OnPush que agregamos antes: los datos sí llegaban, pero el componente quedaba esperando otro evento de UI para repintar.

Ahora actualiza a un refresco local del componente apenas llega la respuesta async, sin depender de clicks en otro control. También agrega una prueba específica que valide que una búsqueda renderiza el resultado sin interacción extra.

Cambia:

routes-page.component.ts en el ngOnDestroy y genera una función que actualice el DOM para que no se quede congelado, porque el backend sí responde adecuadamente.


EStoy trabajando sobre el documento [Kata-Fullstack-28-04-2026.pdf](Kata-Fullstack-28-04-2026.pdf) y ahora quiero agregar lo siguiente:

Reglas:
 - Conserva el stack actual salvo que sea estrictamente necesario cambiar algo. 
 - No rompas lo ya implementado. 
 - Mantén la arquitectura modular existente. 
 - Actualiza README.md si cambian comandos, endpoints o variables. 
 - Actualiza CHANGELOG_FASE.md con detalle suficiente. 
 - Incluye tests nuevos o actualizados sobre los componentes o rutas que agregues 
 - Asegúrate de que el ZIP final pueda descomprimirse y ejecutarse. 
 - Antes de entregar respuesta, valida que no falten imports, módulos, providers ni variables de entorno. 
 - No avances a fases futuras.
 
  Fase actual: 2 — Edición de rutas. 
  
  Objetivo: Completar RF-01 agregando edición e inhabilitación lógica. Frontend: 
  - Botón editar. 
  - Formulario edición reutilizando formulario de creación si aplica.
  - Botón inhabilitar. - Confirmación antes de inhabilitar. 
  - Refrescar tabla tras cambios. 
  - No mostrar rutas soft deleted en listado principal. 
  - Popup indicando creación exitosa o errónea 
  - Verificar que funciones y componentes que se agreguen e interactuen con el dom rendericen correctamente y no afecte el performance de la aplicación Tests: 
  - Unitarios use cases update y soft delete. 
  - E2E backend para GET by id, PATCH y DELETE. 
  - Tests frontend para edición e inhabilitación. No implementar auth todavía, pero deja preparado que luego ADMIN sea requerido para escritura. Actualizar: 
  - README.md 
  - CHANGELOG_FASE.md 
  - .env.example CHANGELOG_FASE.md debe indicar: # CHANGELOG FASE X ## Objetivo de la fase ## Archivos agregados ## Archivos modificados 
  ## Endpoints agregados/modificados 
  ## Variables de entorno nuevas ## Feature flags 
  ## Tests agregados 
  ## Decisiones técnicas ## Riesgos o límites conocidos ## Comandos de validación ## Commits sugeridos 
  ## Checklist previo al PR Entrega: 1. ZIP actualizado. 2. Commits sugeridos. 3. Checklist antes de PR.



Corrige el componente monitoring-page.

Problema:
El polling funciona, pero la pantalla hace un refresh visual incómodo. Al actualizar datos, la vista se reinicia y si el usuario está leyendo una fila o está más abajo en la pantalla, vuelve al inicio.

Implementación actual problemática:
- Se inyectó ApplicationRef.
- Se inyectó ChangeDetectorRef.
- Se inyectó NgZone.
- Se envolvieron next, error y finalize en ngZone.run(...).
- Se agregó flushView() con detectChanges() + appRef.tick().

Objetivo:
Eliminar ese refresh forzado. El polling debe actualizar los datos del componente sin reiniciar la experiencia visual ni mover el scroll.

Reglas:
- No usar ApplicationRef.tick().
- No usar detectChanges() salvo que sea estrictamente necesario.
- No forzar refresh global de la app.
- No recrear toda la lista si no es necesario.
- Mantener polling cada 30 segundos.
- Mantener loading solo en la primera carga, no en cada polling.
- En refresh posteriores usar estado “actualizando…” discreto si aplica.
- Preservar scroll y posición visual.
- Usar trackBy en listas/tablas.
- Usar RxJS o signals de Angular de forma limpia.
- Cancelar polling al destruir el componente.
- No cambiar contrato del backend.

Implementación esperada:
1. Quitar ApplicationRef, ChangeDetectorRef, NgZone y flushView().
2. Implementar polling con timer(0, 30000) o interval + startWith.
3. Usar switchMap para llamar al servicio.
4. Usar takeUntilDestroyed o DestroyRef para limpiar suscripción.
5. Actualizar una signal o BehaviorSubject con los nuevos datos.
6. Diferenciar:
   - initialLoading
   - refreshing
   - error
7. Agregar trackByRouteId o trackBy id en la tabla/lista.
8. Evitar limpiar data antes de cada request.
9. Si falla el polling, conservar la última data válida y mostrar error discreto.

Entrega:
- Actualiza monitoring-page.component.ts
- Actualiza monitoring-page.component.html si aplica
- Actualiza tests del componente

Patrón correcto esperado

Algo así:

readonly items = signal<TrackingItem[]>([]);
readonly initialLoading = signal(true);
readonly refreshing = signal(false);
readonly error = signal<string | null>(null);

ngOnInit(): void {
  timer(0, 30000)
    .pipe(
      tap((index) => {
        if (index === 0) {
          this.initialLoading.set(true);
        } else {
          this.refreshing.set(true);
        }
        this.error.set(null);
      }),
      switchMap(() =>
        this.monitoringService.getActiveRoutesTracking().pipe(
          catchError((err) => {
            this.error.set('No se pudo actualizar el monitoreo');
            return EMPTY;
          }),
          finalize(() => {
            this.initialLoading.set(false);
            this.refreshing.set(false);
          })
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((data) => {
      this.items.set(data);
    });
}

trackByRouteId(index: number, item: TrackingItem): number | string {
  return item.routeId;
}

Y en HTML:

@if (initialLoading()) {
  <app-loading-state />
} @else {
  @if (refreshing()) {
    <small>Actualizando datos...</small>
  }

  <table>
    <tr *ngFor="let item of items(); trackBy: trackByRouteId">
      ...
    </tr>
  </table>
}
Decisión técnica

No necesitas appRef.tick().
Eso es una solución agresiva para problemas de detección de cambios, pero aquí el problema correcto se resuelve actualizando estado reactivo y dejando que Angular actualice el DOM de forma normal.