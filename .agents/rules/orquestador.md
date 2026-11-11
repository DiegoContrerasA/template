# Orquestador de reglas

Punto de entrada de las reglas de este repo para cualquier agente de código (Claude Code, Codex, o similar). `AGENTS.md`/`CLAUDE.md` en la raíz apuntan acá.

No repitas contenido de estos archivos en otro lado ni los dupliques: si algo cambia, se edita acá una sola vez.

## Leer primero, siempre

| Archivo | Qué cubre |
|---|---|
| [`../../README.md`](../../README.md) | Arquitectura: capas (`entities/`, `features/`, `widgets/`, `pages/`, `shared/`, `app/`), qué puede importar de qué, estructura de carpetas de cada capa. Léelo antes de crear cualquier entity/feature/widget/page nueva. |
| [`code-style.md`](./code-style.md) | Reglas generales de código: **no dejar comentarios**, TypeScript, naming de archivos, exports, imports, manejo de errores. Aplica siempre, en cualquier capa. |

## Según lo que vayas a tocar

| Vas a... | Leé |
|---|---|
| Escribir o editar un componente React (en cualquier capa) | [`components.md`](./components.md) |
| Escribir un `.services.ts` o un hook de `entities/`/`features/` | [`services-and-hooks.md`](./services-and-hooks.md) |
| Escribir estilos / usar Tailwind / agregar una primitiva de UI | [`styling.md`](./styling.md) |
| Crear una entity desde cero | [`templates/entity.md`](./templates/entity.md) |
| Agregar estado global de dominio (sesión, usuario actual) o un provider en `app/` | [`templates/entity.md`](./templates/entity.md#entity-con-estado-compartido-context) |
| Crear una feature desde cero | [`templates/feature.md`](./templates/feature.md) |
| Crear un widget desde cero | [`templates/widget.md`](./templates/widget.md) |
| Crear una page desde cero | [`templates/page.md`](./templates/page.md) |
| Hacer un commit | [`commits.md`](./commits.md) |

## Resumen de una línea por regla

- **`code-style.md`** — no comentarios en el código (salvo la única excepción documentada ahí), `type` para props/`interface` para dominio, sin `any`/`enum`, kebab-case, default export solo en componentes, cruzar de capa siempre con `@/...`.
- **`components.md`** — arrow function + props tipadas + default export; `shared/` es 100% presentacional; dialogs con `open`/`onClose`/`onSubmit`/`isPending`; la lógica de red vive en el hook, no en el componente; sin `"use client"` (es Vite, no hay RSC).
- **Capa `app/`** (ver `README.md`) — es la capa superior: importa de todas y **nadie importa de `app/`**. El estado global de dominio (sesión) vive en una entity con su context y hooks; `app/providers/` solo monta el Provider.
- **`services-and-hooks.md`** — **un solo `{entidad}.services.ts` por entity** (no uno por endpoint); **un hook por integración** (`useQuery`/`useMutation` envolviendo una sola función del service); las features exponen `onSuccess`/`onError` para que la page decida.
- **`styling.md`** — solo Tailwind (nada de CSS Modules/styled-components), `cn()` para combinar clases, `cva()` para variantes, componer antes de crear primitivas nuevas.
- **`commits.md`** — conventional commits validados por commitlint/Husky, tipos permitidos, formato de subject, cuándo commitear y cuándo no.

## Si una regla de acá contradice algo que ya está en el código

Estas reglas valen para código **nuevo**. Si un archivo existente no las sigue (por ejemplo, `shared/hooks/useDebounce.ts` en camelCase), no lo reescribas de forma no solicitada solo para alinearlo — pero el código nuevo que escribas sí sigue estas reglas, aunque el archivo vecino no lo haga.
