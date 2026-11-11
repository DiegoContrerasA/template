# Template: page

Ejemplo de `src/pages/products/`, componiendo el widget de [`widget.md`](./widget.md). Referencia: [`../../../README.md`](../../../README.md) (capa `pages/`).

```
src/pages/products/
├── constants/
│   └── breadcrumb.ts
└── index.tsx
```

Una `page` es la única capa que conoce routing y layout. Si solo está renderizando un widget sin lógica propia, ni siquiera necesita `components/`/`hooks/` propios.

## `constants/breadcrumb.ts`

```ts
export const productsBreadcrumb = [
  { label: "Home", href: "/home" },
  { label: "Productos", href: "/products" },
]
```

## `index.tsx`

```tsx
import { useTranslate } from "@/shared/lib/i18n"
import { ProductExplorer } from "@/widgets/product-explorer"

const Products = () => {
  const { t } = useTranslate()

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("products.title")}</h1>
      <ProductExplorer />
    </div>
  )
}

export default Products
```

## Registro en `src/routes.tsx`

```tsx
import Products from "./pages/products"

// dentro de appRouter, en el árbol que corresponda (privado/público):
{
  path: "products",
  element: <Products />,
},
```

## Cuándo la page sí necesita `components/`/`hooks/` propios

Si la pantalla combina más de un widget/feature con lógica de composición propia de esa vista (por ejemplo, decidir qué mostrar según un query param, o un fetch que solo tiene sentido en esa ruta), eso va en `pages/products/hooks/use-*.ts` y `pages/products/components/*.tsx` — nunca reutilizable fuera de esta page. Si empieza a crecer y podría reutilizarse en otra ruta, es señal de que en realidad es un `widget`.
