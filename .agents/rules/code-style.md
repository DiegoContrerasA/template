# Estilo de código general

Aplica a cualquier archivo `.ts`/`.tsx` que se escriba o edite en este repo, en cualquier capa.

## No dejar comentarios

**No agregues comentarios explicando qué hace el código.** El código debe ser autoexplicativo por naming: nombres de variables, funciones, tipos y componentes claros, en vez de un comentario al lado. Esto tiene prioridad sobre el hábito por defecto de "igualar la densidad de comentarios del archivo vecino": en este repo, igualar significa **no agregar ninguno**, aunque el archivo de al lado ya tenga JSDoc.

Excepciones, y solo esas:
- Un comentario de **una sola línea** cuando el comportamiento es genuinamente no obvio y, sin la aclaración, alguien podría "arreglarlo" mal (ejemplo real del repo, `shared/lib/fetcher.ts`):
  ```ts
  return new Promise(() => {}) // nunca resuelve para evitar errores adicionales
  ```
- Directivas de herramientas (no son documentación, son instrucciones para el linter/compilador): `// biome-ignore ...`, `@ts-expect-error ...`.
- Si estás **editando** un archivo que ya usa JSDoc corto en sus tipos exportados, no lo borres al tocarlo, pero tampoco expandas el patrón a archivos nuevos.

No generes bloques `/** ... */` describiendo props, componentes o funciones nuevas. No dejes `// TODO` a menos que el usuario lo pida explícitamente.

## TypeScript

- `type` para props de componentes y formas locales a un archivo/slice (`type ProductCardProps = {...}`). `interface` para modelos de dominio que viven en `entities/*/types` o `shared/models` (`export interface Product {...}`).
- No prefijo `I` en interfaces (no `IProduct`, sí `Product`). Para payloads/responses de un service, sufijo descriptivo: `ProductCreatePayload`, `ProductListResponse` — no genéricos como `Payload`/`Response` a secas.
- Nunca `any`. Si el tipo real no se puede expresar, `unknown` + narrowing explícito.
- No uses `enum`. Si necesitás un conjunto cerrado de valores, un objeto `as const` (mismo patrón que `shared/config/storage-keys.ts`) o un union de literales de string.
- Generics con nombres descriptivos cuando el genérico importa para quien lee la firma (`<TFieldValues extends FieldValues>`); una sola letra (`T`) está bien para genéricos triviales de una función utilitaria.

## Imports

- Cruzar de capa siempre con el alias `@/...` (`@/shared/lib/utils`, `@/entities/product`), nunca `../../../`. Las reglas de `noRestrictedImports` en `biome.json` solo detectan violaciones de capa escritas con el alias — un import relativo que cruce de capa se cuela sin que el linter lo vea, así que la disciplina acá es manual.
- Dentro de tu propio slice (misma entity/feature/widget/page), imports relativos (`./services/product.services`, `../types/product.types`).
- No armes un import "que junta todo" de un slice ajeno; importá solo lo que ese slice expone en su `index.ts`.
- Dejá que Biome ordene los imports (`assist.actions.source.organizeImports` ya está en `on`) — no pelees el orden a mano.

## Naming de archivos

- Componentes: kebab-case (`product-card.tsx`, `delete-product-dialog.tsx`).
- Hooks: kebab-case con prefijo `use-` (`use-product.ts`, `use-delete-product.ts`) para todo lo nuevo en `entities/`, `features/`, `widgets/`, `pages/`. (`shared/hooks/useDebounce.ts` y compañía quedaron en camelCase de una etapa anterior del proyecto — no repliques ese patrón en código nuevo, incluso dentro de `shared/`.)
- Services: `{entidad}.services.ts` — un solo archivo por entidad, no uno por endpoint (ver [`services-and-hooks.md`](./services-and-hooks.md)).
- Tipos/constantes/helpers: kebab-case con sufijo descriptivo (`product.types.ts`, `product.constants.ts`).
- Carpetas de slice (`entities/{nombre}`, `features/{nombre}`, etc.): kebab-case, singular para entities (`product`, no `products`), caso de uso completo para features (`product-delete`, no `delete`).

## Exports

- Componentes React: **default export** al final del archivo (`export default ProductCard`). Es el patrón ya usado en todo `shared/components` y `pages/*`.
- Todo lo demás (hooks, services, helpers, constantes, tipos): **named export** (`export const useProduct = ...`). Nunca default export en un archivo que no sea un componente.
- El único punto de entrada de un slice es su `index.ts`/`index.tsx`; no importar un archivo interno de otro slice saltándose el barrel.

## Formato

Lo resuelve Biome (`npm run biome:check`), no hay que pensarlo a mano: comillas dobles, sin punto y coma salvo que ASI lo requiera, 2 espacios. Si Biome y un hábito personal no coinciden, gana Biome — no pelees el formatter con overrides puntuales salvo que el usuario lo pida.

## Manejo de errores

- Servicios: dejar que el error de `fetcher`/axios se propague (`Promise.reject`); no atrapar-y-loguear silenciosamente en `entities/`.
- Mutations en `features/`: usar los callbacks `onError`/`onSuccess` de React Query para decidir qué mostrar (toast, mensaje de campo), no `try/catch` alrededor de `mutate()`.
- Nunca `console.log` en código que se commitea. Para debugging temporal, quitalo antes de terminar la tarea.
