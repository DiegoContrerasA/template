# Template: feature

Ejemplo completo de `src/features/product-delete/`, consumiendo la entity de [`entity.md`](./entity.md). Referencia: [`../../../README.md`](../../../README.md) (capa `features/`), [`../components.md`](../components.md), [`../services-and-hooks.md`](../services-and-hooks.md).

```
src/features/product-delete/
├── components/
│   └── delete-product-dialog.tsx
├── hooks/
│   └── use-delete-product.ts
└── index.ts
```

Una feature = un caso de uso. "Borrar un producto" es un caso de uso; "gestionar productos" no lo es (eso sería un `widget`).

## `hooks/use-delete-product.ts`

Envuelve el hook de la entity, agrega invalidación de cache y expone `onSuccess`/`onError` para que la `page` decida qué hacer después (navegar, cerrar el dialog, mostrar un toast).

```ts
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

## `components/delete-product-dialog.tsx`

Interfaz estándar `open`/`onClose`/`onSubmit`/`isPending`. La lógica de mutation vive en el hook de arriba, no acá — este componente solo compone el `Dialog` de shadcn.

```tsx
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

type DeleteProductDialogProps = {
  open: boolean
  onClose: (open: boolean) => void
  onSubmit: () => void
  isPending: boolean
  productName: string
}

const DeleteProductDialog = ({
  open,
  onClose,
  onSubmit,
  isPending,
  productName,
}: DeleteProductDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogDescription>
          ¿Seguro que querés eliminar "{productName}"? Esta acción no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onClose(false)}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
          Eliminar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default DeleteProductDialog
```

## `index.ts`

Solo lo que una `page`/`widget` necesita consumir: el componente principal y el hook público.

```ts
export { default as DeleteProductDialog } from "./components/delete-product-dialog"
export { useDeleteProduct } from "./hooks/use-delete-product"
```

## Cómo la usa una page

```tsx
const [productToDelete, setProductToDelete] = useState<Product | null>(null)

const { mutate, isPending } = useDeleteProduct({
  onSuccess: () => {
    toast.success("Producto eliminado")
    setProductToDelete(null)
  },
})

// ...

{productToDelete && (
  <DeleteProductDialog
    open={!!productToDelete}
    onClose={() => setProductToDelete(null)}
    onSubmit={() => mutate(productToDelete.id)}
    isPending={isPending}
    productName={productToDelete.name}
  />
)}
```

La `page` es quien decide navegar/mostrar el toast en `onSuccess`; la feature nunca lo hace por su cuenta.
