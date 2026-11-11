# Componentes

Cómo escribir un componente React en cualquier capa (`shared/components`, `entities/*/components` si aplicara, `features/*/components`, `widgets/*/components`, `pages/*/components`). Ver [`code-style.md`](./code-style.md) para naming/exports generales y [`styling.md`](./styling.md) para clases/Tailwind.

## Forma base

Function component como arrow function, props tipadas con `type {Componente}Props`, default export al final. Sin `React.FC`, sin `memo()` salvo que haya un problema de performance medido.

```tsx
type ProductCardProps = {
  name: string
  price: number
  onSelect?: (id: string) => void
}

const ProductCard = ({ name, price, onSelect }: ProductCardProps) => (
  <button onClick={() => onSelect?.(id)} className="...">
    ...
  </button>
)

export default ProductCard
```

- Desestructurá las props en la firma, no `props.algo` dentro del body.
- Valores por defecto en la desestructuración (`disabled = false`), no `defaultProps`.
- Si el componente es genérico sobre un formulario (`react-hook-form`), tipalo con `<T extends FieldValues>` + `control`/`name` tipados con `Control<T>`/`Path<T>`.

## Presentacional vs. contenedor

- **`shared/components`** es siempre presentacional: recibe datos y callbacks por props, no hace fetch, no conoce React Query, no conoce ninguna entity. Si un componente de `shared` necesita saber de "producto" o "pedido", no pertenece ahí.
- **`entities/*/components`** (si existe) puede mostrar datos de esa entidad (card, badge) pero no dispara mutations ni conoce otras entities.
- **`features/*/components`** es donde vive la mezcla UI + lógica de un caso de uso: el componente usa el hook de la feature (que trae la mutation/query), pero la lógica de red vive en el hook, no en el componente. El componente decide *qué* renderizar según el estado que el hook le da (`isPending`, `data`, `error`), no *cómo* pedirlo.

## Dialogs / modales

Interfaz estándar para cualquier dialog de una feature, construido sobre el `Dialog` de shadcn (`shared/components/ui/dialog.tsx`):

```tsx
type DeleteProductDialogProps = {
  open: boolean
  onClose: (open: boolean) => void
  onSubmit: () => void
  isPending: boolean
}
```

- `open`/`onClose` controlan visibilidad (el padre es dueño del estado, no el dialog).
- `onSubmit` es el callback que ejecuta la acción — la mutation vive en el hook de la feature que compone este dialog, nunca `useMutation` directo dentro del componente del dialog.
- `isPending` deshabilita el botón de confirmar y lo deshabilita mientras la mutation está en curso.

Ver el ejemplo completo en [`templates/feature.md`](./templates/feature.md).

## Componentes "autónomos"

Un componente que integra su propio hook (ej. un botón de favorito que hace su propia mutation al hacer click) es válido en `features/` cuando el caso de uso es así de chico — no hace falta separar dialog/hook si no hay reutilización real. No lo hagas en `shared/` (ahí siempre presentacional puro).

## Primitivas nuevas

Antes de escribir un componente de UI genérico nuevo, revisá `shared/components/ui/*` (shadcn/Base UI) — es muy probable que ya exista o que se pueda componer con lo que hay. Si hace falta una primitiva realmente nueva (no específica de ningún caso de uso), va en `shared/components/ui/`, siguiendo el patrón de esos archivos (wrapper de Base UI/Radix, `data-slot` en el elemento raíz, `cn()` para clases). Nunca crees una primitiva de UI genérica dentro de `features/`, `widgets/` o `pages/`.

## Accesibilidad mínima

- `aria-invalid` en controles de formulario inválidos (los componentes de shadcn ya lo soportan — replicalo en fields nuevos).
- Texto para lectores de pantalla en botones que son solo ícono: `<span className="sr-only">Cerrar</span>` (patrón usado en `DialogContent`).
- Labels de formulario siempre asociados por `htmlFor`/`id` (usar `useId()`), no solo posición visual.

## Qué NO hacer

- No `useEffect` para derivar estado que se puede calcular en el render (ver la skill `vercel-react-best-practices` para el patrón general).
- No lógica de fetch (`fetch`, `axios`, `useQuery`) directo dentro de un componente de `shared/` o `entities/*/components`.
- No `useNavigate` dentro de `features/*/components` — la navegación la decide la `page` en el callback `onSuccess` que la feature expone (ver [`services-and-hooks.md`](./services-and-hooks.md)).
- No estilos inline ni CSS-in-JS — ver [`styling.md`](./styling.md).
- No `"use client"` (ni `"use server"`). Esto es una SPA con Vite, no hay React Server Components: la directiva no hace nada. Si un componente de shadcn llega con ella, borrala (`components.json` ya tiene `"rsc": false`).
- No crear componentes Provider en `entities/`. El Provider de un estado de dominio global (p. ej. la sesión) va en `app/providers/` y solo conecta el hook de la entity con su context (ver [`templates/entity.md`](./templates/entity.md#entity-con-estado-compartido-context)).
