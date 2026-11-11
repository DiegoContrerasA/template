# Template: entity

Ejemplo completo de `src/entities/product/`. Referencia: [`../../../README.md`](../../../README.md) (capa `entities/`) y [`../services-and-hooks.md`](../services-and-hooks.md).

```
src/entities/product/
├── types/
│   └── product.types.ts
├── services/
│   └── product.services.ts
├── hooks/
│   ├── use-products.ts
│   └── use-delete-product.ts
├── helpers/
│   └── product.ts
└── index.ts
```

## `types/product.types.ts`

```ts
export interface Product {
  id: string
  name: string
  price: number
  stock: number
  createdAt: string
}

export interface ProductCreatePayload {
  name: string
  price: number
  stock: number
}

export type ProductUpdatePayload = Partial<ProductCreatePayload>

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
}

export interface ProductListParams {
  page?: number
  search?: string
}
```

## `services/product.services.ts`

```ts
import { fetcher } from "@/shared/lib/fetcher"
import type {
  Product,
  ProductCreatePayload,
  ProductListParams,
  ProductListResponse,
  ProductUpdatePayload,
} from "../types/product.types"

export const getProducts = (params?: ProductListParams) =>
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

## `hooks/use-products.ts` (query)

```ts
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/shared/config/query-keys"
import { getProducts } from "../services/product.services"
import type { ProductListParams } from "../types/product.types"

export const useProducts = (params?: ProductListParams) =>
  useQuery({
    queryKey: [queryKeys.products, params],
    queryFn: () => getProducts(params),
  })
```

## `hooks/use-delete-product.ts` (mutation, sin orquestación — eso vive en la feature)

```ts
import { useMutation } from "@tanstack/react-query"
import { deleteProduct } from "../services/product.services"

export const useDeleteProduct = () =>
  useMutation({
    mutationFn: deleteProduct,
  })
```

Cada operación nueva (`useProduct`, `useCreateProduct`, `useUpdateProduct`...) es un archivo nuevo en `hooks/`, no se agregan más funciones a los hooks de arriba.

## `helpers/product.ts`

Funciones puras, sin side effects, que transforman datos de esta misma entity:

```ts
import type { Product } from "../types/product.types"

export const isOutOfStock = (product: Product) => product.stock <= 0

export const formatProductLabel = (product: Product) =>
  `${product.name} (${product.stock} disponibles)`
```

## `index.ts`

Único punto de acceso externo. Orden: types → helpers → hooks → services.

```ts
export type {
  Product,
  ProductCreatePayload,
  ProductListParams,
  ProductListResponse,
  ProductUpdatePayload,
} from "./types/product.types"

export { isOutOfStock, formatProductLabel } from "./helpers/product"

export { useProducts } from "./hooks/use-products"
export { useDeleteProduct } from "./hooks/use-delete-product"

export {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./services/product.services"
```

`features/`, `widgets/` y `pages/` importan **solo** desde `@/entities/product` (este `index.ts`), nunca desde `entities/product/services/...` ni `entities/product/hooks/...` directo.

## Entity con estado compartido (context)

Solo para estado de dominio que necesita toda la app (sesión, usuario actual). Para estado puntual de una feature, usá el `provider/` de la feature. Ejemplo real del repo: `src/entities/session/`.

```
src/entities/session/
├── types/
│   └── session.types.ts
├── context/
│   └── session-context.ts
├── hooks/
│   ├── use-session-state.ts
│   └── use-session.ts
└── index.ts
```

### `context/session-context.ts`

Solo el `createContext`, inicializado en `null` para que `useSession` detecte si falta el Provider.

```ts
import { createContext } from "react"
import type { SessionContextValue } from "../types/session.types"

export const SessionContext = createContext<SessionContextValue | null>(null)
```

### `hooks/use-session-state.ts` (la lógica del estado)

```ts
import { useCallback, useEffect, useState } from "react"
import { storageKeys } from "@/shared/config/storage-keys"
import { storage } from "@/shared/lib/storage"
import type { SessionContextValue, User } from "../types/session.types"

export const useSessionState = (): SessionContextValue => {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    setUser(storage.get<User>(storageKeys.user))
  }, [])

  const onLogin = useCallback((user: User) => {
    setUser(user)
    storage.set(storageKeys.user, user)
    storage.set(storageKeys.accessToken, user.backendToken)
  }, [])

  const onLogout = useCallback(() => {
    setUser(null)
    storage.clear()
  }, [])

  return { user, onLogin, onLogout }
}
```

### `hooks/use-session.ts` (lo que consumen las demás capas)

```ts
import { useContext } from "react"
import { SessionContext } from "../context/session-context"

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
```

### El Provider vive en `app/providers/`, no en la entity

```tsx
// src/app/providers/session-provider.tsx
import { SessionContext, useSessionState } from "@/entities/session"

type SessionProviderProps = {
  children: React.ReactNode
}

const SessionProvider = ({ children }: SessionProviderProps) => (
  <SessionContext.Provider value={useSessionState()}>
    {children}
  </SessionContext.Provider>
)

export default SessionProvider
```

- `app/` (guards, layouts), `pages/`, `widgets/` y `features/` leen la sesión con `useSession()` desde `@/entities/session`. Nunca desde `app/`.
- `shared/` no conoce la sesión: nunca importa `User` ni nada de `@/entities/session`. Cómo llega la credencial al cliente HTTP (cookies, header, link de GraphQL) depende del stack de cada proyecto. En este boilerplate la entity escribe `storageKeys.accessToken` al hacer login y `fetcher` la lee.
