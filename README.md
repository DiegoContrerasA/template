# boilerplate-reactjs-screaming

Boilerplate de React + TypeScript + Vite con arquitectura **screaming**: la estructura de carpetas grita qué hace la app, no con qué framework está hecha.

## Stack

- React 19 + Vite (React Compiler activado)
- React Router
- TanStack Query (React Query)
- React Hook Form + Zod
- Tailwind CSS + Base UI / shadcn
- i18next
- Biome (lint/format)

## Scripts

```bash
npm run dev            # servidor de desarrollo
npm run build           # biome:check + type-check + build de producción
npm run preview         # sirve el build de producción
npm run biome:check     # lint + format (aplica fixes)
npm run biome:lint      # solo lint (aplica fixes)
npm run biome:format    # solo format (aplica fixes)
```

---

# Arquitectura

El proyecto sigue una variante de **Feature-Sliced Design (FSD)**: capas ordenadas por nivel de abstracción, donde cada capa solo puede depender de las capas inferiores (nunca de una capa superior ni de un "hermano" del mismo nivel).

Este documento es la única fuente de verdad sobre cómo debe componerse cada `entity`, `feature`, `widget` y `page`. No debe haber un `README.md` dentro de `src/entities`, `src/features`, `src/widgets`, `src/pages`, `src/shared` ni `src/app`: toda esa documentación vive aquí.

Para las reglas operativas de cómo escribir el código dentro de esa estructura (componentes, servicios/hooks, Tailwind, política de comentarios, convención de commits) y ejemplos completos de cada capa, ver [`.agents/rules/orquestador.md`](./.agents/rules/orquestador.md).

## Regla general de dependencias entre capas

```
pages/      → puede importar de widgets/, features/, entities/, shared/
widgets/    → puede importar de features/, entities/, shared/           (no de pages/)
features/   → puede importar de entities/, shared/                      (no de otra feature, ni de widgets/, ni de pages/)
entities/   → puede importar solo de shared/ y de sí misma              (no de otra entity, ni de features/, widgets/ ni pages/)
app/        → puede importar de todas las capas (es la capa superior)
shared/     → no importa de ninguna capa superior (es la base)
```

**Nadie importa de `app/`.** `app/` es la capa superior (igual que en FSD): monta providers, layouts y guards, y para eso consume a las demás capas. Si una pieza de `features/`, `widgets/` o `pages/` necesita algo "global" (sesión, usuario actual, permisos), eso no vive en `app/`: vive en una `entity` (p. ej. `entities/session`) que expone su context y sus hooks, y `app/` solo monta el Provider. Así no hay ciclos.

Violar esto (p. ej. una `entity` importando de otra `entity`, o una `feature` importando de otra `feature`) es un anti-patrón. Si dos piezas del mismo nivel necesitan hablarse, la composición se resuelve **un nivel arriba** (una `feature` compone dos `entities`; una `page` compone dos `features`).

---

## 1. `src/entities/` — Capa de dominio

**Qué es:** el modelo de datos de la aplicación. Representa un concepto de negocio (producto, orden, usuario, etc.). Es la capa de reglas de negocio puras y acceso a APIs. **No tiene componentes React con JSX ni componentes Provider.** La única excepción es el estado de dominio compartido por toda la app (p. ej. la sesión): la entity puede definir el context (`createContext`) y los hooks que producen o leen su valor, pero el componente `<Provider>` (JSX) se monta en `app/providers/`.

**Estructura interna:**

```
src/entities/{nombre-entidad}/
├── types/          # Interfaces, tipos y enums del dominio
│   └── {concepto}.types.ts
├── services/       # UN solo archivo con todas las funciones async que llaman a la API de esta entidad
│   └── {entidad}.services.ts
├── hooks/          # (opcional) Hooks — uno por integración (una query o una mutation por archivo)
│   └── use-{concepto}.ts
├── helpers/        # (opcional) Funciones puras de transformación/validación + constantes de dominio
│   └── {concepto}.ts / {concepto}.constants.ts
├── context/        # (opcional) Solo el createContext de un estado de dominio compartido (sin JSX)
│   └── {concepto}-context.ts
└── index.ts        # Public API — único punto de acceso externo
```

**Qué va en cada carpeta:**
- **`types/`** — forma de los datos del dominio (payload/response de API, enums). Prefijos: `I{Entity}{Action}Payload`, `I{Entity}{Action}Response`. Nunca tipos de UI (props de componentes) ni tipos que dependan de React.
- **`services/`** — **un único archivo `{entidad}.services.ts` por entidad** que agrupa todas sus funciones `async` (get, create, update, delete, etc.), no un archivo por endpoint. Usan siempre el cliente HTTP de `@/shared/lib` y las constantes/enums de `@/shared`. Sin hooks, sin estado, sin `fetch`/`axios` directo fuera de ese cliente compartido.
- **`hooks/`** — archivos `.ts` (sin JSX), **uno por integración**: cada hook envuelve una sola operación del `services.ts` con `useQuery`/`useMutation`, o encapsula lógica de negocio reutilizable en más de un lugar. No manejan estado de UI (modales, formularios).
- **`helpers/`** — funciones puras sin side effects (sin `console.log`, `localStorage`, HTTP) que transforman/derivan datos de esta misma entidad; también constantes de dominio (límites, validaciones).
- **`context/`** — (opcional) solo para estado de dominio que necesita toda la app (sesión, usuario actual). Un archivo `.ts` con el `createContext` (inicializado en `null`). La lógica del estado va en un hook `use-{concepto}-state.ts` y la lectura en `use-{concepto}.ts` (que lanza error si falta el Provider). El componente Provider **no** va acá: vive en `app/providers/` y solo conecta `use-{concepto}-state` con el context. Ver el ejemplo en [`.agents/rules/templates/entity.md`](./.agents/rules/templates/entity.md#entity-con-estado-compartido-context).
- **`index.ts`** — exporta todo el API público, en orden: `types` → `helpers` → `context` → `hooks` → `services`.

**Prohibido:** importar de otra `entity`, de `features/`, de `pages/` o de `app/`; poner componentes JSX o componentes Provider; hooks que devuelvan JSX; partir `services/` en un archivo por endpoint.

---

## 2. `src/features/` — Capa de funcionalidades

**Qué es:** una **funcionalidad completa y autocontenida** que resuelve **un caso de uso concreto** (borrar un producto, aplicar un cupón, cambiar de plan, etc.). Combina UI (componentes) + lógica con estado (hooks) + utilidades propias. **No sabe dónde será usada** — no conoce la página ni el layout; se conecta desde `pages/` (o desde un `widget`).

**Estructura interna:**

```
src/features/{nombre-feature}/
├── components/       # Componentes React de la feature
│   └── {nombre}.tsx
├── hooks/            # Hooks con lógica de negocio y estado React (mutations, queries) — uno por integración
│   └── use-{accion}.ts
├── provider/         # (opcional) Context Provider si la feature comparte estado entre sus componentes
│   └── {nombre}-provider.tsx
├── constants/        # (opcional) Constantes, enums e interfaces propias de la feature
│   └── {contexto}.ts
├── utils/            # (opcional) Funciones utilitarias específicas de esta feature
│   └── {nombre}.ts
└── index.ts          # Public API — único punto de acceso externo
```

**Cómo se crea una feature (proceso):**
1. Identificar el caso de uso: una feature = un caso de uso (si hace 5 cosas distintas, son 5 features).
2. Verificar que las `entities` necesarias (types + services) ya existen; si no, crearlas primero.
3. Crear la estructura de carpetas.
4. Implementar en este orden: `constants` (si aplica) → hooks internos → hooks públicos → componentes internos → componente principal.
5. Crear `index.ts` exportando solo lo que las `pages` necesitan consumir.
6. Verificar que no hay violaciones de capa (no importa de otra feature/pages, no tiene fetch directo, no conoce rutas).

**Patrones de hooks:** wrapper simple de un service (`useMutation` directo); mutation con callbacks `onSuccess`/`onError` + loading combinado (`isPendingSuccess || isPending`) para que la `page` decida qué hacer después (navegar, refrescar, etc.); mutation con invalidación/actualización de cache de React Query; optimistic update con rollback; composición de varios services de una misma entity.

**Patrones de componentes:** dialog/modal con interfaz estándar `open`, `onClose`, `onSubmit`, `isPending` (la lógica de mutation vive en el hook, no en el componente); componente presentacional con props tipadas; componente "autónomo" que integra su propio hook (p. ej. un botón de favorito); Context Provider público (se exporta en `index.ts`, la `page` lo envuelve) para features complejas con estado compartido, o interno (vive en `components/`, no se exporta) cuando es un detalle de implementación.

**`index.ts` — qué exportar / qué no:**
- Exportar: componente(s) principal(es), hooks públicos, tipos necesarios para props.
- No exportar: subcomponentes internos, hooks que solo consumen otros hooks internos, providers internos, utils internos.

**Prohibido:** importar de otra `feature` o de `pages/`; definir services HTTP propios (van en `entities/`); conocer su contexto de uso (p. ej. lógica condicional por ruta); hacer `fetch` directo sin pasar por una entity; definir tipos de layout/página; usar `useNavigate` u otra lógica de routing (se resuelve vía callback `onSuccess` que decide la page); acumular demasiadas responsabilidades en una sola feature "dios".

---

## 3. `src/widgets/` — Capa de bloques de UI compuestos

**Qué es:** bloques de interfaz **grandes y compuestos**, que orquestan varias `features`/`entities` para resolver una porción sustancial de una pantalla (no un caso de uso puntual, sino una sección completa de producto). Es el nivel intermedio entre `features` (una acción concreta) y `pages` (la pantalla completa con routing).

**Estructura interna:**

```
src/widgets/{nombre-widget}/
├── components/     # Componentes de UI del widget (pueden tener subcarpetas)
├── hooks/          # (opcional) Hooks propios del widget
├── providers/      # (opcional) Context providers que orquestan estado compartido entre los componentes del widget
├── constants/      # (opcional) Constantes propias del widget
├── types/          # (opcional) Tipos propios del widget (no de dominio — eso va en entities/)
├── schemas/        # (opcional) Esquemas de validación (p. ej. zod) para formularios del widget
├── adapters/       # (opcional) Adaptadores que transforman datos de entities al formato que necesita el widget
├── utils/          # (opcional) Utilidades específicas del widget
└── index.ts        # Public API — único punto de acceso externo
```

**Cómo se usa:** las `pages` importan el widget (o piezas de su `index.ts`) y lo insertan en el layout de la ruta.

**Regla de dependencias:** un widget puede importar de `features/`, `entities/` y `shared/`, pero no de `pages/` ni de otro widget (si dos widgets necesitan compartir algo, eso se extrae a `features/`, `entities/` o `shared/`).

---

## 4. `src/pages/` — Capa de páginas/rutas

**Qué es:** el nivel más alto de composición de UI. Cada carpeta es una pantalla real de la aplicación, mapeada a una ruta. Es la única capa que puede conocer routing, layout de la pantalla, y que puede componer múltiples `features`/`widgets` entre sí.

**Estructura interna:**

```
src/pages/{nombre-pagina}/
├── components/    # Componentes específicos de esta página (no reutilizables fuera de ella)
├── hooks/         # (opcional) Hooks específicos de la página (p. ej. fetch de datos propios de esa vista)
├── constants/     # (opcional) Constantes propias de la página (p. ej. breadcrumbs)
└── index.tsx      # Componente de entrada de la página (lo que registra src/routes.tsx)
```

**Responsabilidad de la page:** decide navegación (usa `useNavigate`/`react-router`), decide qué pasa cuando una `feature` termina su acción (vía los callbacks `onSuccess`/`onError` que la feature expone), y compone widgets/features entre sí para armar la pantalla completa.

**Regla de dependencias:** una page puede importar de `widgets/`, `features/`, `entities/` y `shared/`. Ninguna otra capa puede importar de `pages/`.

---

## 5. `src/shared/` — Capa base, transversal

**Qué es:** todo lo que es **genérico y reutilizable**, sin lógica de negocio ni conocimiento de dominio. Es la base de la que dependen todas las demás capas; `shared/` no depende de ninguna de ellas.

**Estructura interna:**

```
src/shared/
├── components/    # Componentes de UI genéricos (primitivas shadcn en ui/)
├── hooks/         # Hooks genéricos sin lógica de dominio (useDebounce, useMediaQuery, etc.)
├── lib/           # Utilidades de bajo nivel: cliente HTTP (fetcher), i18n, storage, helpers numéricos/moneda
├── models/        # Tipos e interfaces base compartidos por toda la app (no ligados a una sola entity)
├── config/        # Constantes globales, variables de entorno, query keys, storage keys
└── providers/     # (opcional) Context providers transversales (tema, permisos, tracking)
```

**Qué va en `shared/` vs. otra capa:**
- Un componente sin lógica de negocio → `shared/components/`.
- Un hook sin lógica de dominio → `shared/hooks/`.
- Un tipo que "cruza" entidades y no pertenece a ninguna en particular → `shared/models/` (nunca duplicado dentro de una entity).

**Prohibido:** importar de `entities/`, `features/`, `widgets/` ni `pages/`; contener lógica de dominio (si algo sabe de "productos" o "pedidos", no pertenece aquí).

---

## 6. `src/app/` — Inicialización y configuración global

**Qué es:** el punto de arranque que envuelve toda la aplicación.

**Estructura interna:**

```
src/app/
├── providers/    # Componentes Provider globales (SessionProvider, tema, React Query client). Solo conectan; la lógica vive en la entity
├── layouts/      # Estructuras de página reutilizables que definen la shell visual (AppLayout, AuthLayout)
└── router/       # Guards de navegación (PrivateRoute, PublicRoute)
```

La definición de rutas en sí vive en `src/routes.tsx`.

**Regla de dependencias:** puede importar de todas las capas (`shared/`, `entities/`, `features/`, `widgets/`, `pages/`) y **ninguna capa puede importar de `app/`**. No debe contener lógica de negocio ni UI específica de una feature: un provider de `app/` solo conecta el hook de estado de una entity con su context (`<SessionContext.Provider value={useSessionState()}>`), y los guards/layouts leen ese estado con el hook público de la entity (`useSession()`).

---

## Resumen de navegación (de mayor a menor abstracción)

```
pages/      → pantalla completa, conoce routing y layout
  ↓ compone
widgets/    → bloque grande de UI que orquesta varias features/entities
  ↓ compone
features/   → un caso de uso puntual (UI + hook con estado + entities)
  ↓ consume
entities/   → modelo de dominio + acceso a API (types, services, helpers, hooks)
  ↓ se apoya en
shared/     → base transversal sin lógica de negocio (UI genérica, http client, utils, i18n)
```

## Criterio rápido: ¿en qué capa va esto?

```
¿Modela una llamada a API o el dato de un concepto de negocio?         → entities/
¿Es una funcionalidad completa (UI + lógica + estado) para un caso     → features/
  de uso puntual, sin conocer dónde se usa?
¿Orquesta varias features/entities para armar una sección grande       → widgets/
  de una pantalla?
¿Es la pantalla completa, conoce la ruta y decide navegación/layout?   → pages/
¿Es genérico, sin lógica de negocio, reutilizable en cualquier lado?   → shared/
¿Es configuración/arranque global de la app (providers, layouts,       → app/
  guards de router)?
```
