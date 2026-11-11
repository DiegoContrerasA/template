# Template: widget

Ejemplo de `src/widgets/product-explorer/`: orquesta la entity `product` ([`entity.md`](./entity.md)) y la feature `product-delete` ([`feature.md`](./feature.md)) para armar una sección completa (grilla + filtros + acción de borrar). Referencia: [`../../../README.md`](../../../README.md) (capa `widgets/`).

```
src/widgets/product-explorer/
├── components/
│   ├── product-grid.tsx
│   └── product-explorer.tsx
├── hooks/
│   └── use-product-filters.ts
└── index.ts
```

Un widget existe cuando una sección es demasiado grande/compuesta para ser una feature (combina una query, una lista, filtros y una acción de otra feature), pero no llega a ser una pantalla completa con ruta propia — eso es una `page`.

## `hooks/use-product-filters.ts`

Estado de filtros propio del widget (no pertenece a la entity ni a la feature).

```ts
import { useState } from "react"
import type { ProductListParams } from "@/entities/product"

export const useProductFilters = () => {
  const [filters, setFilters] = useState<ProductListParams>({ page: 1 })

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search, page: 1 }))

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }))

  return { filters, setSearch, setPage }
}
```

## `components/product-grid.tsx`

Presentacional: recibe los productos ya resueltos y un callback, no hace fetch.

```tsx
import type { Product } from "@/entities/product"

type ProductGridProps = {
  products: Product[]
  onDelete: (product: Product) => void
}

const ProductGrid = ({ products, onDelete }: ProductGridProps) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
      <div key={product.id} className="rounded-lg border p-4">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-muted-foreground">${product.price}</p>
        <button onClick={() => onDelete(product)} className="text-destructive text-sm">
          Eliminar
        </button>
      </div>
    ))}
  </div>
)

export default ProductGrid
```

## `components/product-explorer.tsx`

Compone la query de la entity, el estado de filtros propio del widget y el dialog de la feature.

```tsx
import { useState } from "react"
import { useProducts } from "@/entities/product"
import type { Product } from "@/entities/product"
import { DeleteProductDialog, useDeleteProduct } from "@/features/product-delete"
import { useProductFilters } from "../hooks/use-product-filters"
import ProductGrid from "./product-grid"

const ProductExplorer = () => {
  const { filters, setSearch } = useProductFilters()
  const { data, isLoading } = useProducts(filters)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const { mutate, isPending } = useDeleteProduct({
    onSuccess: () => setProductToDelete(null),
  })

  if (isLoading) return <p>Cargando...</p>

  return (
    <div className="flex flex-col gap-4">
      <input
        placeholder="Buscar..."
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 w-full max-w-sm rounded-lg border px-3"
      />
      <ProductGrid products={data?.items ?? []} onDelete={setProductToDelete} />
      {productToDelete && (
        <DeleteProductDialog
          open={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onSubmit={() => mutate(productToDelete.id)}
          isPending={isPending}
          productName={productToDelete.name}
        />
      )}
    </div>
  )
}

export default ProductExplorer
```

## `index.ts`

```ts
export { default as ProductExplorer } from "./components/product-explorer"
```

Solo se expone el componente compuesto — `ProductGrid` y `use-product-filters` son detalles internos del widget y no se exportan.
