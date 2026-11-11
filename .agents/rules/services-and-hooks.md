# Servicios y hooks

Cómo escribir el acceso a datos de una entity y los hooks que lo envuelven. Ver [`../../README.md`](../../README.md) para las reglas de capas (`entities/`, `features/`) y [`templates/entity.md`](./templates/entity.md) / [`templates/feature.md`](./templates/feature.md) para un ejemplo completo end-to-end.

## Services: **un solo archivo por entidad**

No un archivo por endpoint. Todas las funciones `async` de una entity (list, get, create, update, delete) viven juntas en `entities/{entidad}/services/{entidad}.services.ts`.

```ts
// entities/product/services/product.services.ts
import { fetcher } from "@/shared/lib/fetcher"
import type {
  Product,
  ProductCreatePayload,
  ProductListResponse,
  ProductUpdatePayload,
} from "../types/product.types"

export const getProducts = (params?: { page?: number; search?: string }) =>
  fetcher<never, ProductListResponse>("/products", undefined, {
    method: "get",
    params,
  })

export const getProduct = (id: string) =>
  fetcher<never, Product>(`/products/${id}`, undefined, { method: "get" })

export const createProduct = (payload: ProductCreatePayload) =>
  fetcher<ProductCreatePayload, Product>("/products", payload, {
    method: "post",
  })

export const updateProduct = (id: string, payload: ProductUpdatePayload) =>
  fetcher<ProductUpdatePayload, Product>(`/products/${id}`, payload, {
    method: "patch",
  })

export const deleteProduct = (id: string) =>
  fetcher<never, void>(`/products/${id}`, undefined, { method: "delete" })
```

Reglas:
- Siempre `fetcher` de `@/shared/lib/fetcher` — nunca `axios`/`fetch` directo, ni siquiera dentro de `entities/`.
- Tipado explícito de payload y response en cada llamada (`fetcher<Payload, Response>`); no dejar que infiera `unknown`.
- Cero estado, cero hooks, cero JSX en este archivo. Si estás importando `react` o `@tanstack/react-query` acá, está en el lugar equivocado.
- El `method` va explícito en `options` (`"get" | "post" | "patch" | "put" | "delete"`, tal como lo tipa `axios`); no inventes un enum `HttpMethods` propio — no existe en este repo y `fetcher` ya tipa `AxiosRequestConfig`.
- Si la entidad crece mucho (10+ endpoints), se puede dividir por *responsabilidad* dentro del mismo archivo con comentarios de sección — pero sigue siendo un archivo, no N archivos por verbo.

## Hooks: **uno por integración**

Cada hook envuelve **una sola** función del `.services.ts` con `useQuery` o `useMutation`. Nada de un hook "god" que devuelva 5 mutations juntas.

```ts
// entities/product/hooks/use-products.ts
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/shared/config/query-keys"
import { getProducts } from "../services/product.services"

export const useProducts = (params?: { page?: number; search?: string }) =>
  useQuery({
    queryKey: [queryKeys.products, params],
    queryFn: () => getProducts(params),
  })
```

```ts
// entities/product/hooks/use-delete-product.ts
import { useMutation } from "@tanstack/react-query"
import { deleteProduct } from "../services/product.services"

export const useDeleteProduct = () =>
  useMutation({
    mutationFn: deleteProduct,
  })
```

- Un archivo, un hook, un nombre: `use-{verbo}-{entidad}.ts` para mutations (`use-delete-product.ts`), `use-{entidad}(-{algo}).ts` para queries (`use-products.ts`, `use-product.ts`).
- Query keys centralizadas en `@/shared/config/query-keys.ts` (hoy es `{}` — ir agregando una entrada por entity a medida que se crean, no strings sueltos repetidos en cada hook).
- Un hook de `entities/` no conoce UI: no recibe `onSuccess` con lógica de navegación ni de toast — eso se arma un nivel arriba, en el hook de la `feature` que lo consume.

## Hooks de `features/`: composición + decisión

El hook de una feature envuelve el hook (o los hooks) de la entity y agrega lo que le corresponde a un caso de uso concreto: invalidar cache, combinar loading states, y — sobre todo — exponer `onSuccess`/`onError` para que la `page` decida qué pasa después.

```ts
// features/product-delete/hooks/use-delete-product.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProduct } from "@/entities/product"
import { queryKeys } from "@/shared/config/query-keys"

type UseDeleteProductArgs = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useDeleteProduct = ({
  onSuccess,
  onError,
}: UseDeleteProductArgs = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.products] })
      onSuccess?.()
    },
    onError,
  })
}
```

Notá que acá sí se importa desde `@/entities/product` (el `index.ts` público de la entity), nunca desde `entities/product/services/...` directo — una feature consume la *public API* de la entity, no sus archivos internos.

## Qué NO hacer

- No partir `services/` en un archivo por endpoint (`get-product.services.ts`, `delete-product.services.ts`, ...) — es exactamente lo que este repo decidió evitar.
- No un hook que agrupe varias mutations/queries no relacionadas "para no crear tantos archivos" — la regla es 1 hook = 1 integración, el ahorro de archivos se hace en `services/`, no acá.
- No `useNavigate`, `toast()` de UI, ni JSX dentro de un hook de `entities/`.
- No hacer `fetch`/`axios` fuera de `entities/*/services` en ninguna capa.
